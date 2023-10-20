import { parse } from 'fast-csv'
import fs from 'fs'
import TextUtils from './text'
import Structure from './structure'
import Func from './func'

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

    inicializarErro(tablename, pk, field) {
        if (!this.data[tablename]) this.data[tablename] = {}
        if (!this.data[tablename][pk]) this.data[tablename][pk] = {}
        if (!this.data[tablename][pk].erro) this.data[tablename][pk].erro = {}
        if (!this.data[tablename][pk].erro[field]) this.data[tablename][pk].erro[field] = {}
    }

    async acrescentarErro(tablename, pk, field, value, message) {
        this.inicializarErro(tablename, pk, field)
        this.data[tablename][pk].erro[field] = { value: value, message: message }
        await this.gravar()
    }

    async removerErro(tablename, pk, field, value, message) {
        this.inicializarErro(tablename, pk, field)
        delete this.data[tablename][pk].erro[field]
        await this.gravar()
    }

    consultarPorPK(tablename, pk) {
        if (!this.data[tablename]) return
        if (!this.data[tablename][pk]) return
        return this.data[tablename][pk]
    }

    consultarErro(tablename, pk, field) {
        if (!this.data[tablename]) return
        if (!this.data[tablename][pk]) return
        if (!this.data[tablename][pk].erro) return
        return this.data[tablename][pk].erro[field]
    }

    async aprovar(tablename, pk, field, value, message) {
        this.inicializarErro(tablename, pk, field)
        delete this.data[tablename][pk].erro[field]
        await this.gravar()
    }

}

export default RV;
