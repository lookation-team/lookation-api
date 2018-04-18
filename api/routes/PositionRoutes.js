import Joi from 'joi'
import { position } from '../conf/Paths'
import { client } from '../conf/redisConf'
import { jwtDecode } from '../../utils/utils'
import { positions, lookerPositions } from '../controllers/PositionController'
import { insert } from '../dbManagers/PositionManager'

module.exports = (server, io) => {
    io.on('connection', socket => {
        const token = jwtDecode(socket.handshake.query.token)

        socket.on('position', pos => {
            const multi = client.multi()
            multi.HMSET(`looker:${token.id}`, pos)
            multi.sadd('looker', token.id)
            multi.SSCAN('looker', 0)
            multi.exec((err, rep) => {
                const lookerPos = Object.assign({}, pos)
                lookerPos.id = token.id
                socket.broadcast.emit('lookerMouv', lookerPos)
                insert(lookerPos)
            })
        })
    })

    server.route({
        method: 'GET',
        path: position.path,
        handler: positions,
        config: {
            description: 'Get last positions of all lookers',
            auth: 'token',
            tags: ['api']
        }
    })

    server.route({
        method: 'GET',
        path: position.looker,
        handler: lookerPositions,
        config: {
            description: 'Get all positions of one looker',
            auth: {
                strategy: 'token',
                scope: ['admin']
            },
            validate: {
                params: {
                    id: Joi.string().length(36).required()
                }
            },
            tags: ['api']
        }
    })
}
