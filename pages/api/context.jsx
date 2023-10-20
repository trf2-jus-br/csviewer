import { apiHandler } from "../../utils/apis";
import context from '../../utils/context'

const handler = async function (req, res) {
    res.status(200).json({ loading: context.loading, message: context.message });
}

export default apiHandler({
    'GET': handler
});


