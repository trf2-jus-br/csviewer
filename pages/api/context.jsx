import { apiHandler } from "../../utils/apis";
import Context from '../../utils/context'
import getConfig from 'next/config'
import { useContext } from '../../utils/context'

const handler = async function (req, res) {
    const context = await useContext()

    if (!context.db) {
        const ctx = new Context()
        await ctx.initialize()
        serverRuntimeConfig.context = ctx
    }
    res.status(200).json({ loading: serverRuntimeConfig.context.loading, message: serverRuntimeConfig.context.message });
}

export default apiHandler({
    'GET': handler
});


