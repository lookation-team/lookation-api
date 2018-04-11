import jwt from 'jsonwebtoken'

require('dotenv').config()

const SECRET = process.env.AUTH_SECRET || 'SECRET'

const getToken = id => jwt.sign(
    {
        id: id,
        scope: ['user']
    },
    SECRET,
    { expiresIn: 60 * 60 },
    { algorithm: 'HS256'}
)

export { getToken }
