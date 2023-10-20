import DB from './db'
import RV from './rv'

// store.setState("loading", "Preparando...");

class Context {
    db = undefined
    rv = undefined

    loading = true
    message = undefined

    constructor() {
        console.log('contruindo context')
    }

    setMessage(msg) { message = msg }

    async initialize() {
        if (this.db) return
        this.db = new DB('CORRENTE')
        await this.db.carregar(this.setMessage)

        this.rv = new RV()
        await this.rv.carregar(this.setMessage)

        this.loading = false
    }
}

const ctx = new Context()
ctx.initialize()

export default ctx;
