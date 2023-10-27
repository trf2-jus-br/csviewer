import DB from './db'
import RV from './rv'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

// store.setState("loading", "Preparando...");


export class Context {
    db = undefined
    rv = undefined

    loading = true
    message = undefined

    constructor() {
        console.log('contruindo context')
        // console.log(JSON.stringify(serverRuntimeConfig.context.tableNames))
    }

    setMessage(msg) { message = msg }

    async initialize() {
        if (this.db) return
        this.db = new DB('CORRENTE')
        await this.db.carregar(this.setMessage)

        this.rv = new RV()
        await this.rv.carregar(this.setMessage)

        this.loading = false

        console.log('salvando context em serverRuntimeConfig')
        serverRuntimeConfig.context = this
        console.log(JSON.stringify(serverRuntimeConfig.context.db.tableNames))
    }
}

export async function useContext() {
    if (!serverRuntimeConfig.context.db) {
        const ctx = new Context()
        await ctx.initialize()
        serverRuntimeConfig.context = ctx
    }
    return serverRuntimeConfig.context
}