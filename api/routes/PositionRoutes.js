import { position } from '../conf/Paths'
import { client } from '../conf/redisConf'
import { jwtVerify } from '../../utils/Utils'

module.exports = (server, io) => {
    /*server.route({
        method: 'GET',
        path: position.path,
        config: {
            id: 'position',
            handler: (req, reply) => {
                return `Hello World -- positions`
            }
        }
    })*/

    io.on('connection', socket => {
        socket.on('auth', token => {
            jwtVerify(token, (err, decoded) => {
                if (err) return socket.disconnect(true)

                socket.on('position', pos => {
                    const multi = client.multi()
                    multi.HMSET(`looker:${decoded.id}`, pos)
                    multi.sadd('looker', decoded.id)
                    multi.exec((err, rep) => {
                        console.log(err, rep)
                    })
                })
            })
        })
    })
}
