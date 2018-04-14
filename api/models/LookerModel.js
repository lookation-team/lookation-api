import argon2 from 'argon2'
import LookerManager from '../dbManagers/LookerManager'

class Looker {
    constructor(obj = {}) {
        this.id = obj.id
        this.firstName = obj.firstName
        this.lastName = obj.lastName
        this.password = obj.password
        this.userName = obj.userName
        this.email = obj.email
        this.phoneNumber = obj.phoneNumber
        this.gender = obj.gender
        this.birthDate = obj.birthDate
    }

    hashPassword() {
        return argon2.hash(this.password, {
                timeCost: 5, memoryCost: 14, parallelism: 2, type: argon2.argon2id
            })
            .then(hash => {
                this.password = hash
                return hash
            })
            .catch(err => console.log(err))
    }

    checkPassword(password) {
        return argon2.verify(this.password, password)
            .catch(err => console.log(err))
    }

    save() {
        return this.hashPassword()
            .then(hash => {
                const looker = Object.assign({}, this)
                delete looker.id
                return LookerManager.insert(looker)
            })
    }

    remove() {
        return LookerManager.deleteOne(this.id)
    }

    update() {
        const updateLooker = () => {
            return LookerManager.updateOne(this)
        }
        if (this.password) {
            return this.hashPassword()
                .then(() => {
                    updateLooker()
                })
        }
        return updateLooker()
    }
}

export default Looker
