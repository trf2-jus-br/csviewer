import { apiHandler } from "../../utils/apis"
import jwt from "../../utils/jwt";
import xml2js from 'xml2js';
import createHttpError from "http-errors"
import Fetcher from '../../utils/fetcher'

// Verifica as credenciais, obtém os dados do usuário através do SIGA.
async function logarSiga(auth) {
    // let errorMessage = undefined
    // const setErrorMessage = function (e) {
    //     errorMessage = e
    //     console.log(`Erro de Login: ${errorMessage}`)
    // }

    try {

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

        // Ao logar pelo siga, o usuário terá a permissão 'estatística' e
        // caso seja da COSADM terá acesso a 'CRUD'
        return {
            nome: data.usuario.titularNome,
            matricula: data.usuario.titularSigla,
            lotacao: data.usuario.lotaTitularSigla,
        };
    } catch (err) {
        // caso http status seja diferente de 200, encaminha o erro enviado pelo SIGA.
        const res = err?.response;
        if (res)
            throw createHttpError(res.status, res.data?.errormsg);

        throw err;
    }
}

const login = async function (req, res) {
    // obtém o login e senha
    const auth = req.headers.authorization;

    console.log('vou logar' + auth)

    const usuario = await logarSiga(auth);

    // Não enviamos a token do SIGA pro usuário, pois não conseguiríamos validar se o usuário alterou ela.
    // Por essa razão criamos outro JWT utilizando.
    const token = await jwt.buildJwt(usuario);

    // Salvamos no cookie um JWT que será utilizado exclusivamente para validar o login.
    res.setHeader("Set-Cookie", [
        `csviewer_token=${token}; Secure; HttpOnly; Path=/api`,
        `csviewer_usuario=${JSON.stringify(usuario)}; Secure; Path=/`
    ])

    delete usuario.matricula;

    res.status(200).send(usuario);
}

const logout = async function (req, res) {
    res.setHeader("Set-Cookie", [
        `csviewer_token=deslogado; Secure; HttpOnly; Path=/api; Max-Age=-1`,
        `csviewer_usuario=deslogado; Secure; Path=/; Max-Age=-1`
    ])

    res.status(200).send(null);
}

export default apiHandler({
    "POST": login,
    "DELETE": logout
})