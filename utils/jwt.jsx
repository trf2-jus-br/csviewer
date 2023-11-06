import * as jose from 'jose'

export default {
    secret: new TextEncoder().encode(process.env.CSVIEWER_JWT_SECRET),

    alg: 'HS256',

    async buildJwt(payload) {
        return await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: this.alg })
            .setIssuedAt()
            .setIssuer(process.env.CSVIEWER_API_URL_BROWSER)
            .setExpirationTime(process.env.CSVIEWER_JWT_EXPIRATION_TIME)
            .sign(this.secret)
    },

    async parseJwt(jwt) {
        const { payload, protectedHeader } = await jose.jwtVerify(jwt, this.secret, {
            issuer: process.env.CSVIEWER_API_URL_BROWSER,
        })

        return payload
    }
}