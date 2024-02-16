import { parse } from 'fast-csv'
import fs from 'fs'
import { humanize } from '../utils/text'
import Func from './func'
import { format } from '@fast-csv/format'
import iconv from 'iconv-lite'
import { Transform } from 'stream'

// const parse = require('fast-csv')

function isTabelaBasica(str) {
    if (process.env.CSVIEWER_MODE === 'SERH') {
        if (str.length === 0) {
            return false;
        }

        return str.startsWith('Tabela Básica') || str.startsWith('Tabela-Básica');
    }
    return false;
}

const DB = class DB {

    structure = undefined

    cacheEnabled = false

    dir = undefined
    cacheFilename = undefined

    tableNames = []

    tables = {
    }

    constructor(structure) {
        this.structure = structure
        this.dir = process.env.CSVIEWER_DIR_JUI
        this.cacheFilename = `${process.env.CSVIEWER_DIR_DATA}/cache.json`
    }

    async carregar() {
        if (this.cacheEnabled && fs.existsSync(this.cacheFilename)) {
            console.log(`carregando do cache: ${this.cacheFilename}`)
            const data = JSON.parse(fs.readFileSync(this.cacheFilename, { encoding: 'utf8', flag: 'r' }))
            this.tableNames = data.tableNames
            this.tables = data.tables
            return
        }

        for (let i = 0; i < this.structure.tables.length; i++) {
            const tablestru = this.structure.tables[i]
            if (tablestru.concatenate)
                await this.concatenate(tablestru.directory, tablestru.table, tablestru.meta, tablestru.concatenate)
            await this.importar(tablestru.directory, tablestru.table, tablestru.meta)
        }

        const preprocessarTituloDaTabela = (t) => {
            if (isTabelaBasica(t))
                return 'aaa' + t.substring('Tabela Básica'.length)
            if (t.startsWith('Gaju') || t.startsWith('Substituicao'))
                return 'aaa' + t
            return t
        }

        this.tableNames.sort((a, b) => preprocessarTituloDaTabela(a).localeCompare(preprocessarTituloDaTabela(b)))

        if (this.cacheEnabled) {
            console.log('escrevendo em ' + this.cacheFilename)
            fs.writeFileSync(this.cacheFilename, JSON.stringify({ tableNames: this.tableNames, tables: this.tables }));
        }

        // Cria ou valida o meta.ui
        //
        this.tableNames.forEach(tname => {
            const table = this.tables[tname]
            if (!table.meta || !table.meta.headers) return
            if (!table.meta.ui) {
                const ui = []
                table.meta.headers.forEach(h => {
                    const column = {
                        column: h.name,
                        width: 3,
                    }
                    ui.push(column)
                })
                table.meta.ui = ui
                if (!isTabelaBasica(tname))
                    console.log(`${tname} -> ui: ${JSON.stringify(ui, null, 0).replace(/\[]/g, `[\n${' '.repeat(20)}`).replace(/\},/g, `},\n${' '.repeat(20)}`)}`)
            } else {
                table.meta.ui.forEach(c => {
                    if (!table.meta.headers.find(h => h.name === c.column))
                        throw new Error(`Tabela ${tname} não contém a coluna ${c.column} que está definida na ui`)
                })
                table.meta.headers.forEach(h => {
                    if (!table.meta.ui.find(c => h.name === c.column))
                        throw new Error(`Tabela ${tname} contém a coluna ${h.name} que não está definida na ui`)
                })
            }
            table.meta.ui.forEach(c => c.caption = c.caption || humanize(c.column))
        })
    }

    protegerDadosPessoais(row) {
        const sensiveis = [
            'bairro_pessoa',
            'complemento_logradouro_pessoa',
            'cep_pessoa',
            'email_pessoal_pessoa',
            // 'id_cor_raca_pessoa',
            'id_municipio_endereco_pessoa',
            'id_pais_endereco_pessoa',
            // 'id_tipo_logradouro_pessoa',
            // 'id_tipo_sanguineo_pessoa',
            'logradouro_pessoa',
            'dta_nascimento_pessoa',
            'nome_mae_pessoa',
            'nome_pai_pessoa',
            'numero_logradouro_pessoa',
            'celular_pessoa',
            'telefone_pessoa',
            'nome_conjuge_pessoa'
        ]

        sensiveis.forEach(s => { if (row[s]) row[s] = row[s].replace(/[^ ]/g, '*') })
    }

    record(tableName, pk) {
        return this.tables[tableName].index[pk]
    }

    importar(directory, csv, meta) {
        return new Promise((resolve, reject) => {
            const fBasica = isTabelaBasica(csv)
            this.tableNames.push(csv)
            const table = {
                meta: {
                    ...meta,
                    name: csv,
                    headers: undefined,
                    exists: undefined,
                },
                index: {},
                data: []
            }
            this.tables[csv] = table

            const addData = row => {
                // console.log(row)
                if (process.env.CSVIEWER_MODE === 'SERH') {
                    this.protegerDadosPessoais(row)

                    table.meta.headers.forEach(h => {
                        if (row[h.name]) {
                            if (h.name.startsWith('sin_')) row[h.name] = { 'S': 'Sim', 'N': 'Não' }[row[h.name]]
                        }
                    })
                }

                if (meta.enums) {
                    meta.enums.forEach(enm => {
                        let from = row[enm.key]
                        if (enm.buildFk) from = enm.buildFk(row)
                        if (!from) return
                        if (enm.table) {
                            const enumTable = this.tables[enm.table]
                            if (!enumTable.index[from]) {
                                console.log(`Enum index não ${enumTable.index} não contém: ${from}`)
                            }
                            const enumTableRow =enumTable.index[from]
                            if (!enumTableRow) {
                                console.log(`Enum index não ${enumTable.index} não contém: ${from}`)
                            }
                            try {
                                row[`_${enm.key}`] = enumTableRow[enumTable.meta.descr]
                            } catch (error) {
                                console.log(`Enum ${enm.table} não contém a coluna ${enumTable.meta.descr}`)
                            }
                        } else if (enm.values) {
                            // console.log(enm.values)
                            row[`_${enm.key}`] = enm.values[from]
                        }
                    })
                }
                table.index[Func.pk(table, row)] = row;
                table.data.push(row)
            }

            let filepathname = `${this.dir}/${directory}${csv}.csv`
            if (directory && directory !== '' && !directory.startsWith('.'))
                filepathname = `${directory}/${csv}.csv`
            // console.log(`Localizando arquivo: ${filepathname}`)
            const exists = fs.existsSync(filepathname)
            table.meta.exists = exists
            if (!exists) {
                console.log(`Tabela '${csv}' - NÃO ENCONTRADA`)
                resolve()
            }
            const stats = fs.statSync(filepathname)
            table.meta.modified = stats.mtime
            table.meta.created = stats.ctime
            fs.createReadStream(filepathname, { encoding: 'latin1' })
                .pipe(parse({
                    headers: true,
                    ignoreEmpty: true,
                    discardUnmappedColumns: true, // isso deveria ser false. está mascarando erro.
                    quote: '"',
                    escape: '"',
                    delimiter: fBasica ? ',' : ';'
                }))
                .on('data-invalid', (row, rowNumber, reason) => {
                    console.log(`Invalid row ${rowNumber}: ${reason}`);
                })
                // .on('error', error => console.error(error))
                .on('headers', row => table.meta.headers = row.map(name => { return { name, caption: humanize(name) } }))
                .on('data', addData)
                .on('end', (rowCount) => {
                    console.log(`Tabela '${csv}' - ${rowCount} linhas`)
                    // console.log(table.data[0])
                    resolve()
                });
        })
    }

    concatenate(directory, csv, meta, regex) {
        return new Promise((resolve, reject) => {
            // Create a transform stream to convert input data to Latin-1 encoding
            const latin1TransformStream = new Transform({
                transform(chunk, encoding, callback) {
                    const latin1Buffer = iconv.encode(chunk.toString(), "ISO-8859-1")
                    this.push(latin1Buffer)
                    callback()
                },
            })

            const filepathname = `${process.env.CSVIEWER_DIR_DATA}/${csv}.csv`
            // Filter the tables that will be concatenated
            const selectedTables = []
            this.tableNames.forEach(tname => { if (tname.match(regex) && this.tables[tname].meta.exists) selectedTables.push(this.tables[tname]) })
            if (selectedTables.length === 0) return

            // sort by name
            const selectedRecords = []
            selectedTables.forEach(t => t.data.forEach(r => selectedRecords.push(r)))
            selectedRecords.sort((a, b) => {
                const pka = Func.pk(selectedTables[0], a)
                const pkb = Func.pk(selectedTables[0], b)
                if (pka < pkb) {
                    return -1;
                }
                if (pka > pkb) {
                    return 1;
                }
                return 0;
            })

            // console.log(selectedTables)

            if (!selectedRecords || !selectedRecords.length || !selectedTables || !selectedTables.length || !selectedTables[0].meta || !selectedTables[0].meta.headers)
                throw `não foi possível gerar a tabela concatenada ${csv}!`

            const csvStream = format({ delimiter: ';', headers: selectedTables[0].meta.headers.map(h => h.name) });
            csvStream.pipe(latin1TransformStream).pipe(fs.createWriteStream(filepathname)).on('finish', () => resolve());
            selectedRecords.forEach(r => csvStream.write(r))
            csvStream.end();
        })
    }


}

export default DB;
