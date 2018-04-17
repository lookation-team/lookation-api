import Boom from 'boom'
import { position } from '../conf/Paths'
import { client } from '../conf/redisConf'
import { jwtDecode } from '../../utils/utils'

module.exports = (server, io) => {
    io.on('connection', socket => {
        const token = jwtDecode(socket.handshake.query.token)
        console.log(token)

        socket.on('position', pos => {
            console.log(pos)
            const multi = client.multi()
            multi.HMSET(`looker:${token.id}`, pos)
            multi.sadd('looker', token.id)
            multi.SSCAN('looker', 0)
            multi.exec((err, rep) => {
                const lookerPos = Object.assign({}, pos)
                lookerPos.id = token.id
                socket.broadcast.emit('lookerMouv', lookerPos)
            })
        })
    })

    server.route({
        method: 'GET',
        path: position.path,
        handler: (req, reply) => {
            client.multi()
                .smembers('looker')
                .sort('looker', 'by', 'looker:*->timestamp', 'get', 'looker:*->longitude', 'get', 'looker:*->latitude', 'get', 'looker:*->timestamp')
                .exec((err, rep) => {
                    if (err) return reply(Boom.badImplementation())
                    return reply(rep[0].map((o, i) => {
                        return {
                            id: o,
                            longitude: rep[1][i*3+1],
                            latitude: rep[1][i*3+2],
                            date: rep[1][i*3+3]
                        }
                    }))
                })
        },
        config: {
            description: 'Get list of all looker\'s positions',
            auth: 'token',
            tags: ['api']
        }
    })
}
