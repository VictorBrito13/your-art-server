const postModel = require('../models/posts')
const userModel = require('../models/users')
const fs = require('fs')
const path = require('path')

const controller = {
    //*New post
    new_post: async (req, res) => {
        try{
            const { title, body } = req.body
            const post = new postModel()
            post.title = title
            post.body = body
            post.comments = []
            post.likes = []
            const data = await post.save()
            res.status(200).send({message: 'post created', data})
        }catch(e){
            console.log("Error in the new_post of post controller")
            console.error(e)
        }
    },
    //*upload post files
    uploadFiles: async (req, res) => {
        try{
            let postId = req.params.postId
            let idUser = req.params.idUser
            const post = await postModel.findById(postId)
            let ext = ''
            if(req.files){
                req.files.forEach((file) => {
                    post.files.push(file.filename)
                    let extFile = file.filename.split('.').pop()
                    ext = extFile
                })
                if(ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'jpeg'){
                    const user = await userModel.findById(idUser)
                    const userPost = user.posts
                    userPost.push(post)

                    await userModel.findByIdAndUpdate(idUser, {posts: userPost}, {new: true})
                    const data = await postModel.findByIdAndUpdate(postId, {user: user.username, files: post.files}, {new: true})
                    res.status(200).send({data})
                }else{
                    fs.unlink('./uploads', (err) => {
                        if(err) return res.send({error: err})
                        return res.status(500).send({message: "Invalid extension"})
                    })
                }
            }else{
                res.status(500).send({message: "There are not files in the request"})
            }
        }catch(e){
            console.error(e)
        }
    },
    //*Get posts
    get_posts: async (req, res) => {
        const data = await postModel.find().exec()
        return res.status(200).send({data})
    },
    //*Get post
    get_post: async (req, res) => {
        let id = req.params.id
        const post = await postModel.findById(id)
        const username = post.user
        const user = await userModel.findOne({username}).select('_id')
        return res.status(200).send({data: post, userProperty: user})
    },
    //*Delete post
    delete_post: async (req, res) => {
        let idPost = req.params.id
        let idUser = req.params.idUser
        const user = await userModel.findById(idUser)
        const userPosts = user.posts
        const post = await postModel.findById(idPost)
        const postFiles = post.files
        postFiles.forEach((file) => {
            fs.unlink('./uploads/' + file, (err) => {
                if(err) return res.send({error:err})
                return 'Archivo eliminado'
            })
        })
        let postToRemove = {}
        let indexPost
        userPosts.forEach((postUser) => {
            if(postUser._id.equals(post._id)){
                postToRemove = postUser
            }
        })
        userPosts.findIndex((postUser, index) => {
            if(postUser._id.equals(postToRemove._id)){
                indexPost = index
            }
        })
        userPosts.splice(indexPost,1)
        await userModel.findByIdAndUpdate(idUser, {posts: userPosts}, {new: true})

        const data = await postModel.findByIdAndRemove(idPost)
        res.send({data})
    },
    //*Get image
    getImage: (req, res) => {
        let image = req.params.image
        let pathFile = './uploads/'

        if(fs.existsSync(pathFile + image)){
            res.status(200).sendFile(path.resolve(pathFile + image))
        }else{
            res.status(404).send({message: 'the file does not exist'})
        }
    }
}

module.exports = controller