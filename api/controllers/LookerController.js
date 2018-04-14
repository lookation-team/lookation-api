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
    .catch(err => reply(Boom.badImplementation(err)))
}

exports.getLookers = (req, reply) => {
    LookerManager.findAll()
    .then(rows => {
        reply(rows.map(l => {
            const looker = new Looker(l)
            return looker.getBasicInfo()
        }))
    })
    .catch(err => reply(Boom.badImplementation(err)))
}

exports.postLooker = (req, reply) => {
    const newLooker = new Looker(req.payload)
    newLooker.save()
    .then(looker => {
        const resLooker = new Looker(looker)
        reply(resLooker.getBasicInfo())
    })
    .catch(err => reply(Boom.badImplementation(err)))
}

exports.getLooker = (req, reply) => {
    LookerManager.findById(req.params.id)
    .then(looker => {
        if (!looker.id) return reply(looker)
        const resLooker = new Looker(looker)
        reply(resLooker.getFullInfo())
    })
    .catch(err => reply(Boom.badImplementation(err)))
}

exports.putLooker = (req, reply) => {
    const looker = new Looker(Object.assign({ id: req.params.id }, req.payload))
    looker.update()
    .then(l => {
        const resLooker = new Looker(l)
        reply(resLooker.getBasicInfo())
    })
    .catch(err => reply(Boom.badImplementation(err)))
}

exports.deleteLooker = (req, reply) => {
    const looker = new Looker(req.params)
    looker.remove()
    .then(() => {
        reply({ message: 'Looker successfully deleted' })
    })
    .catch(err => reply(Boom.badImplementation(err)))
}
