import fs from 'fs'
import { useContext } from './context'
import { isEmptyObject } from './rv-util'
import Structure from './structure'
import { removeAccents } from './text'

const RV = class RV {

    dirCache = undefined

    data = {
    }

    constructor() {
        this.dirCache = `${process.env.DIR_CACHE}/review.json`
    }

    async carregar() {
        if (fs.existsSync(this.dirCache)) {
            console.log(`carregando review.json: ${this.dirCache}`)
            this.data = JSON.parse(fs.readFileSync(this.dirCache, { encoding: 'utf8', flag: 'r' }))
            return
        }
    }

    gravar() {
        console.log('escrevendo em ' + this.dirCache)
        fs.writeFileSync(this.dirCache, JSON.stringify(this.data));
    }

    inicializarPk(tablename, pk) {
        if (!this.data[tablename]) this.data[tablename] = {}
        if (!this.data[tablename][pk]) this.data[tablename][pk] = {}
    }

    inicializarErro(tablename, pk, field) {
        this.inicializarPk(tablename, pk)
        if (!this.data[tablename][pk].error) this.data[tablename][pk].error = {}
        if (!this.data[tablename][pk].error[field]) this.data[tablename][pk].error[field] = {}
    }

    initializeEvent(tablename, pk) {
        this.inicializarPk(tablename, pk)
        if (!this.data[tablename][pk].event) this.data[tablename][pk].event = []
    }

    addEvent(tablename, pk, user, kind, message) {
        this.initializeEvent(tablename, pk)
        this.data[tablename][pk].event.push({ date: new Date(), user, kind, message })
    }

    removerErroVazio(tablename, pk) {
        const error = this.data[tablename][pk].error
        if (isEmptyObject(error))
            delete this.data[tablename][pk].error
    }

    async addApprove(tablename, pk, record, reflected) {
        this.inicializarPk(tablename, pk)
        this.data[tablename][pk].approved = record
        if (this.data[tablename][pk].error)
            delete this.data[tablename][pk].error
        this.addEvent(tablename, pk, '', 'Aprovação' + (reflected ? ' (refletido)' : ''))

        const tableStructure = Structure.find(i => i.table === tablename)
        if (tableStructure && tableStructure.alsoUpdate) {
            const context = await useContext()
            const alteredPk = removeAccents(record['NOME COMPLETO'])
            console.log(alteredPk)
            const alteredRecord = {
                "UG": record['UG'].substring(1),
                "Nome do Magistrado": alteredPk,
                "CPF": record['CPF'],
                "Cargo": record['JUIZ FEDERAL/JUIZ SUBSTITUTO'],
                "Período do Exercício Cumulativo": record['DATAS'].replaceAll(' a ', 'a').replaceAll(' e ', ','),
                "Órgão de Origem": record['ORIGEM'],
                "Órgão Acumulado": record['VARA/ÓRGÃO JURISD. ACUMULADO'],
                "Competência do Juízo": "Não se aplica",
                "Fundamentação": record['FUNDAMENTAÇÃO'],
                "Justificativa": record['JUSTIFICATIVA'] + (record['DESIGNAÇÕES'] ? ", " + record['DESIGNAÇÕES'] : '') + (record['AUSÊNCIAS'] ? ", " + record['AUSÊNCIAS'] : '') + (record['FERIADOS'] ? ", " + record['FERIADOS'] : '') + '.',
                "Código da Unidade": context.db.tables[tableStructure.alsoUpdate].index[alteredPk]['Código da Unidade']
            }
            await this.addApprove(tableStructure.alsoUpdate, alteredPk, alteredRecord, true)
        }
        if (!reflected) await this.gravar()
    }

    async removeApprove(tablename, pk, record, message, reflected) {
        this.inicializarPk(tablename, pk)
        delete this.data[tablename][pk].approved
        this.addEvent(tablename, pk, '', 'Cancelamento de Aprovação' + (reflected ? ' (refletido)' : ''))

        const tableStructure = Structure.find(i => i.table === tablename)
        if (tableStructure && tableStructure.alsoUpdate)
            await this.removeApprove(tableStructure.alsoUpdate, removeAccents(pk), record, message, true)
        if (!reflected) await this.gravar()
    }

    async addError(tablename, pk, field, value, message, reflected) {
        this.inicializarErro(tablename, pk, field)
        this.data[tablename][pk].error[field] = { value: value, message: message }
        if (this.data[tablename][pk].approved)
            delete this.data[tablename][pk].approved
        this.addEvent(tablename, pk, '', 'Registro de Erro' + (reflected ? ' (refletido)' : ''), `${field}: '${value}' - ${message}`)

        const tableStructure = Structure.find(i => i.table === tablename)
        if (tableStructure && tableStructure.alsoUpdate)
            await this.addError(tableStructure.alsoUpdate, removeAccents(pk), field, value, message, true)
        if (!reflected) await this.gravar()
    }

    async removeError(tablename, pk, field, value, message, reflected) {
        this.inicializarErro(tablename, pk, field)
        delete this.data[tablename][pk].error[field]
        this.removerErroVazio(tablename, pk)
        this.addEvent(tablename, pk, '', 'Cancelamento de Erro' + (reflected ? ' (refletido)' : ''), `${field}: '${value}'`)

        const tableStructure = Structure.find(i => i.table === tablename)
        if (tableStructure && tableStructure.alsoUpdate)
            await this.removeError(tableStructure.alsoUpdate, removeAccents(pk), field, value, message, true)
        if (!reflected) await this.gravar()
    }

    consultarPorPK(tablename, pk) {
        if (!this.data[tablename]) return
        if (!this.data[tablename][pk]) return
        return this.data[tablename][pk]
    }

    consultarErro(tablename, pk, field) {
        if (!this.data[tablename]) return
        if (!this.data[tablename][pk]) return
        if (!this.data[tablename][pk].error) return
        return this.data[tablename][pk].error[field]
    }
}

export default RV;

