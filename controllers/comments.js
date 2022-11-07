const postModel = require('../models/posts')
const videoModel = require('../models/videos')
const userModel = require('../models/users')

const controller = {
    //Add comment
    add_component: async (req, res) => {
        const { body } = req.body
        const userId = req.params.userId
        const user = await userModel.findById(userId).select('username')
        const comment = {
            username: user.username,
            body: body
        }

        let idPost = req.params.idPost
        const post = await postModel.findById(idPost) || await videoModel.findById(idPost)
        const comments = post.comments
        comments.unshift(comment)

        const postForUpdate = await postModel.findByIdAndUpdate(idPost, {comments: comments}, {new: true}) ||
                                await videoModel.findByIdAndUpdate(idPost, { comments: comments }, {new: true})
        return res.status(200).send({
            data: postForUpdate,
            comment
        })
    },
    getComments: async (req, res) => {
        try{
            const postId = req.params.idPost
            const post = await postModel.findById(postId) || await videoModel.findById(postId)
            if(!post) return res.status(404).send({message: 'No post found'})
            const comments = post.comments
            return res.status(200).send({data: comments})
        }catch(err){
            console.error(err)
        }
    }
}

module.exports = controller