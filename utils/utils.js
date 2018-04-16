import jwt from 'jsonwebtoken'

const SECRET = process.env.AUTH_SECRET || 'SECRET'

const emptyFunc = () => {}

const jwtVerify = (token, callback) => {
    jwt.verify(token, new Buffer(SECRET, 'base64'), callback)
}

const jwtDecode = token => {
    return jwt.decode(token)
}

export { emptyFunc, jwtVerify, jwtDecode }
