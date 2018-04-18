require('dotenv').config()
const path = process.env.BASE_PATH || ''

module.exports = {
    looker: {
        login: `${path}login`,
        path: `${path}looker`,
        pathId: `${path}looker/{id}`,
    },
    position: {
        path: `${path}position`,
        looker: `${path}position/looker/{id}`
    }
}
