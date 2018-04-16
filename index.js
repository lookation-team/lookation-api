import Hapi from 'hapi'
import hapiauthjwt from 'hapi-auth-jwt-simple'
import { hapiConf, swaggerConf, useAuthStrategy, socketAuthMiddleware } from './api/conf/serverConf'
import { client } from './api/conf/dbConf'
import routes from './api/routes/routes'
import socket from 'socket.io'

require('dotenv').config()

/* Check .env file and variables */
if (!process.env.PG_CON) {
  throw 'Make sure you defined PG_CON in your .env file'
}

/* Start pgDB */
client.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
        throw err
    }
})

/* Start Web server */
const server = new Hapi.Server()
server.connection(hapiConf)

/* Register for swagger documentation */
server.register(swaggerConf, {
    select: 'api'
}, err => {
    if (err) throw err
})

/* Register for auth checking */
server.register(hapiauthjwt, err => { if (err) throw err })
useAuthStrategy(server)

/*Register for Nes Websockets*/
const io = socket.listen(server.listener)
io.use(socketAuthMiddleware)

/* Adding routes to the Server */
routes(server, io)

/* Starting servers */
server.start(err => {
    if (err) throw err
    console.log('Server running at: ', server.info.uri)
})
