import { Client } from 'pg'
require('dotenv').config()

const client = new Client({
    connectionString: process.env.PG_CON
})

const query = (text, params) => {
    return client.query(text, params)
        .then((result = []) => result.rows)
        .catch(e => console.error(e.stack))
}

export { client, query }
