const bcrypt = require("bcrypt")

const makeHashedPassword = async (password) => {
    if(password) {
        return await bcrypt.hash(password, 10)
    }
}

const checkPassword = async (hashPassword, password) => {
    if(hashPassword && password) {
        return await bcrypt.compare(password, hashPassword)
    }
}

module.exports = {makeHashedPassword, checkPassword}