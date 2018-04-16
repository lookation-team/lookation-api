import swaggered from 'hapi-swaggered'
import swaggeredUI from 'hapi-swaggered-ui'
import jwt from 'jsonwebtoken'
import vision from 'vision'
import inert from 'inert'
import Boom from 'boom'

require('dotenv').config()

const PORT = process.env.PORT || 3333
const HOST = process.env.HOST || '127.0.0.1'
const SECRET = process.env.AUTH_SECRET || 'SECRET'

const hapiConf = {
    port: PORT,
    host: HOST,
    routes: { cors: true },
    labels: ['api']
}

const swaggerConf = [
    vision,
    inert,
    {
        register: swaggered,
        options: {
            auth: false,
            info: {
                title: 'LOOKATION API',
                description: 'Lookation\'s REST API documentation',
                version: '1.0'
            }
        }
    },
    {
        register: swaggeredUI,
        options: {
            title: 'LOOKATION API',
            path: '/lookdoc',
            auth: false,
            authorization: {
                field: 'apiKey',
                valuePrefix: 'bearer ',
                defaultValue: 'YOUR_API_TOKEN',
                placeholder: 'Enter your token here'
            },
            swaggerOptions: {}
        }
    }
]

const jwtValidate = (token, request, callback) => {
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return callback(Boom.forbidden('Invalid token'), false, null)
        callback(null, true, decoded)
    })
}

const useAuthStrategy = server => {
    server.auth.strategy('token', 'jwt', {
        key: SECRET,
        validateFunc: jwtValidate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    })
}

const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.query.token
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return next(Boom.forbidden('Invalid token'))
        return next()
    })
}

export { swaggerConf, hapiConf, useAuthStrategy, socketAuthMiddleware }
