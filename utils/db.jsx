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

        return str.charAt(0).toUpperCase() === str.charAt(0);
    }
    // if (process.env.CSVIEWER_MODE === 'JUI') {
    //     return str.startsWith('Gaju')
    // }
    return false;
}

const DB = class DB {

    structure = undefined

    cacheEnabled = false

    dir = undefined
    cacheFilename = undefined
    enum_dir = process.env.DIR_ENUMS

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
            // console.log('directory', tablestru.directory, 'table', tablestru.table, 'meta', tablestru.meta)
            await this.importar(tablestru.directory, tablestru.table, tablestru.meta)
        }

        const preprocessarTituloDaTabela = (t) => {
            if (t.startsWith('Tabela Básica') || t.startsWith('Gaju') || t.startsWith('Substituicao'))
                return 'aaa' + t.substring('Tabela Básica'.length)
            return t
        }

        this.tableNames.sort((a, b) => preprocessarTituloDaTabela(a).localeCompare(preprocessarTituloDaTabela(b)))

        if (this.cacheEnabled) {
            console.log('escrevendo em ' + this.cacheFilename)
            fs.writeFileSync(this.cacheFilename, JSON.stringify({ tableNames: this.tableNames, tables: this.tables }));
        }
    }

    protegerDadosPessoais(row) {
        const sensiveis = [
            'bairro_pessoa',
            'complemento_logradouro_pessoa',
            'cep_pessoa',
            'email_pessoal_pessoa',
            'id_cor_raca_pessoa',
            'id_municipio_endereco_pessoa',
            'id_pais_endereco_pessoa',
            'id_tipo_logradouro_pessoa',
            'id_tipo_sanguineo_pessoa',
            'logradouro_pessoa',
            'dta_nascimento_pessoa',
            'nome_mae_pessoa',
            'nome_pai_pessoa',
            'numero_logradouro_pessoa',
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
                        const from = row[enm.key]
                        if (!from) return
                        if (enm.table) {
                            const enumTable = this.tables[enm.table]
                            row[enm.key] = enumTable.index[from][enumTable.meta.descr]
                        } else if (enm.values) {
                            row[enm.key] = enm.values[from]
                        }
                    })
                }
                table.index[Func.pk(table, row)] = row;
                table.data.push(row)
            }

            let filepathname = `${fBasica ? this.enum_dir : this.dir}/${directory}${csv}.csv`
            if (directory !== '' && !directory.startsWith('.'))
                filepathname = `${directory}/${csv}.csv`
            console.log(`Localizando arquivo: ${filepathname}`)
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
                    delimiter: fBasica ? ',' : ';'
                }))
                .on('error', error => console.error(error))
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
