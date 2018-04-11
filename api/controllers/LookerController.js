import Boom from 'boom'
import LookerManager from '../dbManagers/LookerManager'
import Looker from '../models/LookerModel'
import { simpleLooker, getToken } from '../../utils/modelUtils'

exports.login = (req, reply) => {
    const logLooker = new Looker(req.payload)
    LookerManager.findByEmail(logLooker)
    .then(row => {
        const error = Boom.unauthorized('invalid email or password', { email: logLooker.email })
        if (row[0]) {
            const looker = new Looker(row[0])
            looker.checkPassword(logLooker.password)
            .then(match => {
                if (match) {
                    const token = getToken(looker.id)
                    reply({ token: token }).header('Authorization', token)
                } else {
                    reply(error)
                }
            })
        } else {
            reply(error)
        }
    })
}

exports.getLookers = (req, reply) => {
    LookerManager.findAll()
        .then(rows => {
            reply(rows)
        })
}

exports.postLooker = (req, reply) => {
    LookerManager.save(req.payload, (err, user) => {
        if (err) return reply(err)
        reply(user)
    })
}

exports.getLooker = (req, reply) => {
    LookerManager.findById(req.params.id, (err, user) => {
        if (err) return reply(err)
        reply(simpleLooker(user))
    })
}

exports.putLooker = (req, reply) => {
    LookerManager.findOneAndUpdate(req.params.id, req.payload, (err, user) => {
        if (err) return reply(err)
        reply(user)
    })
}

exports.deleteLooker = (req, reply) => {
    LookerManager.remove(req.params.id, (err, user) => {
        if (err) return reply(err)
        reply({ message: 'Looker successfully deleted' })
    })
}
