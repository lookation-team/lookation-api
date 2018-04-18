import Boom from 'boom'
import { client } from '../conf/redisConf'
import { findByLookerId } from '../dbManagers/PositionManager'

exports.positions = (req, reply) => {
    client.multi()
    .sort('looker', 'BY', 'looker:*->timestamp', 'DESC')
    .sort('looker', 'BY', 'looker:*->timestamp', 'DESC', 'GET', 'looker:*->longitude', 'GET', 'looker:*->latitude', 'GET', 'looker:*->timestamp')
    .exec((err, rep) => {
        if (err) return reply(Boom.badImplementation())
        return reply(rep[0].map((o, i) => {
            return {
                id: o,
                longitude: rep[1][i*3],
                latitude: rep[1][i*3+1],
                date: rep[1][i*3+2]
            }
        }))
    })
}

exports.lookerPositions = (req, reply) => {
    findByLookerId(req.params.id)
    .then(rows => {
        reply(rows.map(r => {
            const positions = JSON.parse(r.coords)
            return {
                date: r.creationDate,
                looker_id: r.looker_id,
                longitude: positions.coordinates[0],
                latitude: positions.coordinates[1]
            }
        }))
    })
    .catch(err => reply(Boom.badImplementation()))
}
