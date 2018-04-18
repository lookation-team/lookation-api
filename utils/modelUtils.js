import jwt from 'jsonwebtoken'

require('dotenv').config()

const SECRET = process.env.AUTH_SECRET || 'SECRET'

const getToken = (id, scope = ['user']) => jwt.sign(
    {
        id: id,
        scope: scope
    },
    SECRET,
    { expiresIn: 60 * 60 },
    { algorithm: 'HS256'}
)

export { getToken }
