const { hash, compare} = require('bcryptjs')

const encript = async (password) => {
    const passwordEncripted = await hash(password, 10)
    return passwordEncripted
}

const compareEncript = async (passwordPlain, hash) => {
    const passwordCheck = await compare(passwordPlain, hash)
    return passwordCheck
}

module.exports = { encript, compareEncript }