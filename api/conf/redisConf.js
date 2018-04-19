import redis from 'redis'
require('dotenv').config()

const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'

const client = redis.createClient(REDIS_PORT, REDIS_HOST)

export { client }
