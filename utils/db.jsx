import { parse } from 'fast-csv'
import fs from 'fs'
import TextUtils from '../utils/text'
import Structure from './structure.ts'
import Func from './func'

// const parse = require('fast-csv')

function isTabelaBasica(str) {
    if (str.length === 0) {
        return false;
    }

    return str.charAt(0).toUpperCase() === str.charAt(0);
}


const DB = class DB {

    dir = undefined
    dirCache = undefined
    enum_dir = process.env.DIR_ENUMS

    tableNames = []

    tables = {
    }

    constructor(anterior) {
        this.dir = anterior ? process.env.DIR_ANTERIOR : process.env.DIR_CORRENTE
        this.dirCache = `${process.env.DIR_CACHE}/${anterior ? 'anterior' : 'corrente'}.json`
    }

    async carregar() {
        if (fs.existsSync(this.dirCache)) {
            console.log(`carregando do cache: ${this.dirCache}`)
            const data = JSON.parse(fs.readFileSync(this.dirCache, { encoding: 'utf8', flag: 'r' }))
            this.tableNames = data.tableNames
            this.tables = data.tables
            return
        }

        for (let i = 0; i < Structure.length; i++)
            await this.importar(Structure[i].table, Structure[i].meta)

        const preprocessarTituloDaTabela = (t) => {
            if (t.startsWith('Tabela Básica'))
                return 'zzz' + t.substring('Tabela Básica'.length)
            return t
        }

        this.tableNames.sort((a, b) => preprocessarTituloDaTabela(a).localeCompare(preprocessarTituloDaTabela(b)))

        console.log('escrevendo em ' + this.dirCache)
        fs.writeFileSync(this.dirCache, JSON.stringify({ tableNames: this.tableNames, tables: this.tables }));
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

    importar(csv, meta) {
        return new Promise((resolve, reject) => {
            const fBasica = isTabelaBasica(csv) 
            this.tableNames.push(csv)
            const table = {
                meta: {
                    ...meta,
                    name: csv,
                    headers: undefined,
                },
                index: {},
                data: []
            }
            this.tables[csv] = table

            const addData = row => {
                this.protegerDadosPessoais(row)

                table.meta.headers.forEach(h => {
                    if (row[h.name]) {
                        if (h.name.startsWith('sin_')) row[h.name] = { 'S': 'Sim', 'N': 'Não' }[row[h.name]]
                    }
                })

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

            fs.createReadStream(`${fBasica ? this.enum_dir : this.dir}/${csv}.csv`)
                .pipe(parse({
                    headers: true,
                    ignoreEmpty: true,
                    discardUnmappedColumns: true, // isso deveria ser false. está mascarando erro.
                    delimiter: fBasica ? ',' : ';'
                }))
                .on('error', error => console.error(error))
                .on('headers', row => table.meta.headers = row.map(name => { return { name, caption: TextUtils.humanize(name) } }))
                .on('data', addData)
                .on('end', (rowCount) => {
                    console.log(`Tabela '${csv}' - ${rowCount} linhas`)
                    console.log(table.data[0])
                    resolve()
                });
        })
    }

}

export default DB;
