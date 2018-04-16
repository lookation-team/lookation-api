import LookerRoutes from './LookerRoutes'
import PositionRoutes from './PositionRoutes'

module.exports = (server, io) => {
    LookerRoutes(server)
    PositionRoutes(server, io)
}
