const usersModel = require('../models/users')
const { verifyToken } = require('../helpers/jwt')

const authMiddleware = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            res.status(404).send("No token")
        }
        const token = req.headers.authorization.split(' ').pop()
        const dataToken = await verifyToken(token)
        if(!dataToken.id){
            res.status(404).send("No id")
        }
        const user = await usersModel.findById(dataToken._id)
        req.user = user
        next()
    }catch(e){
        console.error(e)
    }
}

module.exports = { authMiddleware }