//Models
const postModel = require('../models/posts')
const userModel = require('../models/users')
const videoModel = require('../models/videos')

const controller = {
    //*Give like
    new_like: async (req, res) => {
        try {
            let idPost = req.params.idPost
            let idUser = req.params.idUser

            const post = await postModel.findById(idPost) || await videoModel.findById(idPost)
            const user = await userModel.findById(idUser)

            if(post.dislikes){
                post.dislikes.forEach((dislike, index) => {
                    if(dislike._id.equals(user._id)){
                        post.dislikes.splice(index, 1)
                    }
                })

                await videoModel.findByIdAndUpdate(post._id, {dislikes: post.dislikes}, {new: true})
            }

            const postLiked = {
                title: post.title,
                body: post.body || post.description,
                _id: post._id,
                files: post.files || post.file
            }
            const userLikes = user.likes
            const postLikes = post.likes

            const userLike = {
                username: user.username,
                avatar: user.avatar,
                _id: user._id
            }

            userLikes.push(postLiked)
            postLikes.push(userLike)

            const postUpdated = await postModel.findByIdAndUpdate(idPost, { likes: postLikes }, { new: true }) ||
                await videoModel.findByIdAndUpdate(idPost, { likes: postLikes }, { new: true })
            const userUpdated = await userModel.findByIdAndUpdate(idUser, { likes: userLikes }, { new: true })

            const data = {
                user: userUpdated,
                post: postUpdated
            }

            res.status(200).send({ data: data })
        } catch (err) {
            console.error(err)
        }
    },
    //*Delete like
    delete_like: async (req, res) => {
        try {
            let idPost = req.params.idPost
            let idUser = req.params.idUser

            const post = await postModel.findById(idPost) || await videoModel.findById(idPost)
            const user = await userModel.findById(idUser)

            const postLikes = post.likes
            const userLikes = user.likes

            postLikes.forEach((userLike, index) => {
                if (userLike._id.equals(user._id)) {
                    postLikes.splice(index, 1)
                }
            })

            userLikes.forEach((postLike, index) => {
                if (postLike._id.equals(post._id)) {
                    userLikes.splice(index, 1)
                }
            })

            const postUpdated = await postModel.findByIdAndUpdate(idPost, { likes: postLikes }, { new: true }) ||
                await videoModel.findByIdAndUpdate(idPost, { likes: postLikes }, { new: true })
            const userUpdated = await userModel.findByIdAndUpdate(idUser, { likes: userLikes }, { new: true })

            const data = {
                post: postUpdated,
                user: userUpdated
            }

            res.status(200).send({ data: data })
        } catch (err) {
            console.error(err)
        }
    },
    //*Comprobate like
    comprobateLike: async (req, res) => {
        let userId = req.params.userId
        let postId = req.params.postId

        const user = await userModel.findById(userId)
        const postToComprobate = await postModel.findById(postId).select('_id') ||
            await videoModel.findById(postId).select('_id dislikes')

        const userLikes = user.likes
        const postDislikes = postToComprobate.dislikes ? postToComprobate.dislikes : null
        let exist = false,
            existDislike = false

        if(postDislikes instanceof Array){
            postDislikes.forEach((dislike) => {
                if(dislike._id.equals(user._id)){
                    existDislike = true
                    return res.status(200).send({ existDislike, exist })
                }
            })
        }

        userLikes.forEach((post) => {
            if (post._id.equals(postToComprobate._id)) {
                exist = true
                return res.status(200).send({ existDislike, exist })
            }
        })

        if(!exist && !existDislike) return res.status(200).send({ exist, existDislike })
    },
    //*Get likes
    getLikes: async (req, res) => {
        let postId = req.params.postId
        const post = await postModel.findById(postId) || await videoModel.findById(postId)
        if (!post) {
            return res.status(404).send({ message: 'Post not found' })
        }
        const likesNum = post.likes.length
        const likesPost = post.likes
        const dislikesNum = post.dislikes ? post.dislikes.length : null

        return res.status(200).send({
            likes: likesPost,
            numLikes: likesNum,
            numDislikes: dislikesNum
        })
    },

    //*Dislike !!!(only for videos)!!!
    dislike: async (req, res) => {
        try {
            const userId = req.params.userId
            const videoId = req.params.videoId

            const user = await userModel.findById(userId)
            const video = await videoModel.findById(videoId)

            user.likes.forEach((postLiked, index) => {
                if (postLiked._id.equals(video._id)) {
                    user.likes.splice(index, 1)
                    video.likes.forEach((userLike, index) => {
                        if (userLike._id.equals(user._id)) video.likes.splice(index, 1)
                    })
                }
            })

            const dislikeUser = {
                username: user.username,
                _id: user._id
            }
            video.dislikes.unshift(dislikeUser)

            await userModel.findByIdAndUpdate(userId, { likes: user.likes }, { new: true })
            const data = await videoModel.findByIdAndUpdate(videoId, { dislikes: video.dislikes, likes: video.likes }, { new: true })
            res.status(200).send({ data })
        } catch (err) {
            console.log(err)
        }
    },
    delete_dislike: async (req, res) => {
        try{
            const userId = req.params.userId
            const videoId = req.params.videoId

            const video = await videoModel.findById(videoId).select(" _id dislikes")
            const dislikes = video.dislikes;

            dislikes.forEach((dislike, index) => {
                if (dislike._id.equals(userId)) {
                    dislikes.splice(index, 1)
                }
            });

            const data = await videoModel.findByIdAndUpdate(video._id, { dislikes }, { new: true })

            res.status(200).send({ data })
        }catch(err) {
            console.error(err)
        }
    }
}

module.exports = controller