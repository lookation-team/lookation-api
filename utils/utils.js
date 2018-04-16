import jwt from 'jsonwebtoken'

const SECRET = process.env.AUTH_SECRET || 'SECRET'

const emptyFunc = () => {}

const jwtDecode = token => {
    return jwt.decode(token)
}

export { emptyFunc, jwtDecode }
