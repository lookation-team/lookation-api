import Paths from '../conf/Paths'
import LookerController from '../controllers/LookerController'
import Joi from 'joi'

module.exports = server => {
    server.route({
        method: 'GET',
        path: Paths.looker.path,
        handler: LookerController.getLookers,
        config: {
            description: 'Get list of all lookers',
            auth: {
                strategy: 'token',
                scope: ['admin']
            },
            tags: ['api']
        }
    })

    server.route({
        method: 'GET',
        path: Paths.looker.pathId,
        handler: LookerController.getLooker,
        config: {
            description: 'Get looker\'s details by ID',
            auth: 'token',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().length(36).required()
                }
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: Paths.looker.pathId,
        handler: LookerController.deleteLooker,
        config: {
            description: 'Delete looker by ID',
            auth: 'token',
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().length(36).required()
                }
            }
        }
    })

    server.route({
        method: 'POST',
        path : Paths.looker.path,
        handler: LookerController.postLooker,
        config: {
            description: 'Create a new looker',
            tags: ['api'],
            auth: false,
            validate: {
                payload: {
                    firstName: Joi.string().min(2).required(),
                    lastName: Joi.string().min(2).required(),
                    password: Joi.string().min(8).required(),
                    userName: Joi.string().min(2).required(),
                    email: Joi.string().email().required(),
                    /* TODO WRITE a Regular expression to check phone number validity */
                    phoneNumber: Joi.string(),
                    gender: Joi.string().valid(['man', 'woman', 'other']).required(),
                    birthDate: Joi.date().timestamp().required()
                }
            }
        }
    })

    server.route({
        method: 'POST',
        path : Paths.looker.login,
        handler: LookerController.login,
        config: {
            description: 'Login route',
            auth: false,
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).required()
                }
            }
        }
    })

    server.route({
        method: 'PUT',
        path : Paths.looker.pathId,
        handler: LookerController.putLooker,
        config: {
            description: 'Update looker informations',
            auth: 'token',
            tags: ['api'],
            validate: {
                payload: {
                    firstName: Joi.string().min(2),
                    lastName: Joi.string().min(2),
                    password: Joi.string().min(8),
                    userName: Joi.string().min(2),
                    email: Joi.string().email(),
                    /* TODO WRITE a Regular expression to check phone number validity */
                    phoneNumber: Joi.string(),
                    gender: Joi.string().valid(['man', 'woman', 'other']),
                    birthDate: Joi.date().timestamp()
                },
                params: {
                    id: Joi.string().length(36).required()
                }
            }
        }
    })
}
