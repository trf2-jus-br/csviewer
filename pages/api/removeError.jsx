import { apiHandler } from "../../utils/apis";
import context from '../../utils/context'

const handler = async function (req, res) {
    const tablename = req.body.tablename
    const pk = req.body.pk
    const field = req.body.field
    const value = req.body.value
    const message = req.body.message

    context.rv.removerErro(tablename, pk, field, value, message)

    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});


