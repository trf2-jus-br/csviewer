import { apiHandler } from "../../utils/apis";

import { useContext } from '../../utils/context'

const handler = async function (req, res) {
    const context = await useContext()

    // console.log('Approve')
    const tablename = req.body.tablename
    const pk = req.body.pk
    const record = req.body.record
    const message = req.body.message

    await context.rv.addApprove(req.session, tablename, pk, record, message)
    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});


