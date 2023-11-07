import Fetcher from '../../utils/fetcher'

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
            return
        }
        const body = JSON.parse(JSON.stringify(req.body))
        const auth = 'Basic ' + btoa(body.email.toUpperCase() + ':' + body.password)
        const respLogin = await Fetcher.post('https://siga.jfrj.jus.br/siga/api/v1/autenticar', {}, {
            headers: {
                Authorization: auth
            }
        })

        // busca os dados do usuário ( identificado pelo jwt)
        const data = await Fetcher.fetcher('https://siga.jfrj.jus.br/siga/api/v1/usuario', {
            headers: {
                Authorization: 'Bearer ' + respLogin.token
            }
        })

        if (!data) {
            res.status(404).send({ message: 'Usuário inexistente!' })
            return
        }

        if (!process.env.CSVIEWER_ALLOWED_USERNAMES.split(',').includes(data.usuario.titularSigla)) {
            res.status(403).send({ message: 'Usuário não autorizado!' })
            return
        }

        res.status(200).json({
            nome: data.usuario.titularNome,
            matricula: data.usuario.titularSigla,
            lotacao: data.usuario.lotaTitularSigla,
        });
    } catch (error) {
        res.status(405).send({ message: `{error.message}` })
        return
    }
};