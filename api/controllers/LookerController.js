import Boom from 'boom'
import LookerManager from '../dbManagers/LookerManager'
import Looker from '../models/LookerModel'
import { getToken } from '../../utils/modelUtils'

exports.login = (req, reply) => {
    const logLooker = new Looker(req.payload)
    LookerManager.findByEmail(logLooker)
    .then(row => {
        const error = Boom.unauthorized('invalid email or password', { email: logLooker.email })
        if (row.id) {
            const looker = new Looker(row)
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
    const newLooker = new Looker(req.payload)
    newLooker.save()
    .then((err, looker) => {
        if (err) return reply(err)
        reply(looker)
    })
}

exports.getLooker = (req, reply) => {
    LookerManager.findById(req.params.id)
    .then(looker => {
        if (!looker.id) return reply(looker)
        delete looker.password
        reply(looker)
    })
}

exports.putLooker = (req, reply) => {
    LookerManager.findOneAndUpdate(req.params.id, req.payload)
    .then((err, looker) => {
        if (err) return reply(err)
        reply(looker)
    })
}

exports.deleteLooker = (req, reply) => {
    LookerManager.remove(req.params.id)
    .then((err, looker) => {
        if (err) return reply(err)
        reply({ message: 'Looker successfully deleted' })
    })
}
