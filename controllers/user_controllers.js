const fs = require('fs')
const Path = require('path')

//*Models
const modelUsers = require('../models/users')

//*Helpers
const { encript, compareEncript } = require('../helpers/log_register')

//*jsonToken
const { signToken } = require('../helpers/jwt')

const controllers = {
    //Create user account
    createUser: async (req, res) => {
        try{
            let user = new modelUsers()
            const { name, lastName, age, username, email, password } = req.body
            const checkEmail = await modelUsers.findOne({email: email})
            const checkUsername = await modelUsers.findOne({username: username})

            if(checkUsername){
                return res.status(406).send({message: 'the username is already in use'})
            }

            if(checkEmail){
                return res.status(406).send({ message: 'the email is already in use'})
            }else{
                user.name = name
                user.lastName = lastName
                user.age = age
                user.username = username
                user.email = email
                user.avatar = null
                user.password = await encript(password)

                const dataUser = await user.save()
                dataUser.set('password', undefined, {strict: false})

                const data = {
                    token: await signToken(dataUser),
                    user: dataUser
                }
                return res.status(200).send({data : data});
            }
        }catch(e){
            console.error(e)
        }
    },
    uploadFile: (req, res) => {
        try{
            var userId = req.params.userId
            var fileName = "la imagen no ha sido subida"

            if(req.file){
                var filePath = req.file.path
                var fileName = req.file.filename
                var extSplit = filePath.split('\.')
                var fileExt = extSplit[1]

                if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                    modelUsers.findByIdAndUpdate(userId, {avatar: fileName}, {new: true}, (err, userUpdated)=>{
                        if(err) return res.status(400).send({message: "something went wrong", error: err})
                        return res.status(202).send({
                            user: userUpdated
                        })
                    });
                }else{
                    fs.unlink(filePath, (err)=>{
                        return res.status(415).send({message: "the extension is not valid"})
                    });
                }
            }else{
                return res.status(406).send({
                message: "no files in the requiest"
                })
            }
        }catch(err){
            console.error(err)
        }
    },
    //Delete a user
    deleteUser: async (req, res) => {
        try{
            let id = req.params.id
            const { password } = req.body
            const user = await modelUsers.findById(id)
            const passwordCheck = await compareEncript(password, user.password)
            if(!passwordCheck){
                return res.status(500).send({message: 'The password is incorrect'})
            }
            const data = await modelUsers.findByIdAndRemove(id)
            return res.status(200).send({data: data})
        }catch(e){
            console.error(e)
        }
    },

    //Log_in
    log_in: async (req, res) => {
        try{
            const { password, email } = req.body
            const user = await modelUsers.findOne({email: email}).select('password _id name role username')
            if(!user){
                return res.status(404).send({ message: 'The user does not exist' })
            }
            const passwordCheck = await compareEncript(password, user.password)
            if(!passwordCheck){
                return res.status(500).send({ message: 'The password does not match with the email address'})
            }else{
                user.set('password', undefined, {strict: false})
            const data = {
                token: await signToken(user),
                user: user
            }
            return res.status(201).send({ data: data })
            }
        }catch(e){
            console.log("Error en el controlador de logIn")
            console.error(e)
        }
    },
    //Get user
    getUser: async (req, res) => {
        try{
            let id = req.params.userId

            const user = await modelUsers.findById(id).select('_id username followers follows posts avatar')

            if(!user){
                res.status(404).send({message: 'the user has not been found'})
            }

            res.status(200).send({data: user})
        }catch(err){
            console.error(err)
        }
    },
    getAvatar: async (req, res) => {
        let avatar = req.params.avatar
        let path = './uploads_avatar/'
        if(fs.existsSync(path + avatar)){
            return res.status(200).sendFile(Path.resolve(path + avatar))
        }else{
            return res.status(404).send({message: 'Avatar not found'})
        }
    }
}

module.exports = controllers