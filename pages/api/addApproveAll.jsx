import { apiHandler } from "../../utils/apis";

import { useContext } from '../../utils/context'

const handler = async function (req, res) {
    const context = await useContext()

    for (let i = 0; i < context.db.tableNames.length; i++) {
        const tablename = context.db.tableNames[i]
        const tableStructure = this.Structure.find(j => j.table === tablename)
        if (!tableStructure || !tableStructure.alsoUpdate) continue
        const table = context.db.table[tablename]

        for (let j = 0; j < table.data.length; j++) {
            const record = table.data[j]
            const pk = req.body.pk
            const message = req.body.message
    
            await context.rv.addApprove(req.session, tablename, pk, record, message)
        }
        // console.log('Approve')

    }

    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});


