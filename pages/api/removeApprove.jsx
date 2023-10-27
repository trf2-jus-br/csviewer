import { apiHandler } from "../../utils/apis";

import { useContext } from '../../utils/context'

const handler = async function (req, res) {
    const context = await useContext()
    const tablename = req.body.tablename
    const pk = req.body.pk
    const record = req.body.record
    const message = req.body.message
    await context.rv.removeApprove(tablename, pk, record, message)
    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});


