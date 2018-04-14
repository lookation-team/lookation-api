import { query, queryFirst } from '../conf/dbConf'

module.exports = {
    findById(id){
        return queryFirst('SELECT * FROM looker WHERE id = $1', [id])
    },

    findByEmail(looker){
        return queryFirst('SELECT * FROM looker WHERE email = $1', [looker.email])
    },

    findAll(){
        return query('SELECT * FROM looker', [])
    },

    deleteOne(id){
        return query('DELETE FROM looker WHERE id = $1', [id])
    },

    insert(looker){
        return queryFirst('INSERT INTO looker(id, firstName, lastName, password, userName, email, phoneNumber, gender, birthDate) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email, phonenumber',
            [
                looker.firstName,
                looker.lastName,
                looker.password,
                looker.userName,
                looker.email,
                looker.phoneNumber,
                looker.gender,
                looker.birthDate
            ])
    },

    updateOne(looker, id){
        const keys = Object.keys(looker).filter(k => {
            if (looker[k] && k !== 'id') {
                return k
            }
        })
        const values = keys.map(k => looker[k])
        values.push(looker.id)
        const keyString = keys.map((k, i) => `${k} = $${i}`).join(', ')
        return query(`UPDATE looker SET ${keyString} WHERE id = $${keys.values.length}`, values)
    }
}
