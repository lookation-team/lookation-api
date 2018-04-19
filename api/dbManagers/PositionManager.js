import { query, queryFirst } from '../conf/dbConf'

module.exports = {
    insert(position){
        return queryFirst(`INSERT into position(id, location, "creationDate", looker_id) VALUES (uuid_generate_v4(), ST_GeomFromText('POINT($1 $2)', 4326), $3, $4)`,
            [
                position.longitude,
                position.latitude,
                position.date,
                position.id
            ])
    },
    findByLookerId(id){
        return query('SELECT id, ST_AsGeoJSON(location) as coords, "creationDate", looker_id FROM position WHERE looker_id=$1', [id])
    }
}