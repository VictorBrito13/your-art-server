const { sign, verify } = require('jsonwebtoken')
const MASTER_KEY = process.env.MASTER_KEY


//Create jsonwebToken
const signToken = async (user) => {
    try {
        const token = await sign(
            {
                name: user.name,
                id: user._id,
                username: user.username
            },
            MASTER_KEY,
            {
                expiresIn: '24h'
            }
        )
        return token
    }catch(e) {
        console.log("The token has not created in jwt.ts of helpers")
        console.error(e)
    }
}

const verifyToken = async function(token){
    try{
        return verify(token, MASTER_KEY)
    }catch(e){
        console.log(e)
    }
}

module.exports = { signToken, verifyToken }