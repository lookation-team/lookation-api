import jwt from 'jsonwebtoken'

const SECRET = process.env.AUTH_SECRET || 'SECRET'

const emptyFunc = () => {}

const jwtVerify = (token, callback) => {
    jwt.verify(token, SECRET, callback)
}

export { emptyFunc, jwtVerify }
