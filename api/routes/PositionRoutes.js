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
                socket.emit('lookerMouv', lookerPos)
            })
        })
    })
}
