import { apiHandler } from "../../utils/apis";
import { useContext, Context } from '../../utils/context'
import getConfig from 'next/config'

const handler = async function (req, res) {
    const { serverRuntimeConfig } = getConfig()
     const context = await useContext()
    const ctx = new Context()
    await ctx.initialize()
    serverRuntimeConfig.context = ctx
    res.status(200).json({ loading: serverRuntimeConfig.context.loading, message: serverRuntimeConfig.context.message });
    // res.status(200).json({  });
}

export default apiHandler({
    'POST': handler
});


