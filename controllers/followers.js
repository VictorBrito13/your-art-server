const userModel = require('../models/users')

const controllers = {
    //New follower
    new_follower: async (req, res) => {
        try{
            let idUser = req.params.idUser
            let idNewFollower = req.params.idNewFollower

            //user
            const user = await userModel.findById(idUser)
            const followersUser = user.followers
            const newFollow = {
                username: user.username,
                _id: user._id,
                avatar: user.avatar
            }
            //user new follower
            const newFollowerUser = await userModel.findById(idNewFollower)
            const followsUser = newFollowerUser.follows
            const newFollower = {
                username: newFollowerUser.username,
                _id: newFollowerUser._id,
                avatar: newFollowerUser.avatar
            }
            followsUser.push(newFollow)
            followersUser.push(newFollower)

            const data = await userModel.findByIdAndUpdate(idUser, {followers: followersUser}, {new: true})
            const dataFollow = await userModel.findByIdAndUpdate(idNewFollower, {follows: followsUser}, {new: true})

            return res.status(200).send({
                user: data,
                userNewFollower: dataFollow
            })
        }catch(err){
            console.error(err)
        }
    },
    //Delete follower
    delete_follower: async (req, res) => {
        try{
            let userId = req.params.idUser
            let oldFollowerId = req.params.idOldFollower

            const user = await userModel.findById(userId)
            const oldFollower = await userModel.findById(oldFollowerId)

            const userFollowers = user.followers
            const oldFollowerFollows = oldFollower.follows

            userFollowers.forEach((follower, index) => {
                if(follower._id.equals(oldFollower._id)){
                    userFollowers.splice(index, 1)
                }
            })
            oldFollowerFollows.forEach((follow, index) => {
                if(follow._id.equals(user._id)){
                    oldFollowerFollows.splice(index, 1)
                }
            })

            const newUser = await userModel.findByIdAndUpdate(userId, {followers: userFollowers}, {new: true})
            const newOldFollower = await userModel.findByIdAndUpdate(oldFollowerId, {follows: oldFollowerFollows}, {new: true})

            res.status(200).send({
                user: newUser,
                newOldFollower: newOldFollower
            })
        }catch (err){
            console.error(err)
        }
    },
    //Get a follower
    followComprobate: async (req, res) => {
        let userId = req.params.userId
        let followId = req.params.followId
        const user = await userModel.findById(userId)
        const followToComprobate = await userModel.findById(followId).select('_id')
        const follows = user.follows

        let exists = false

        follows.forEach((follow) => {
            if(follow._id.equals(followToComprobate._id)){
                exists = true
            }
        })

        if(!exists){
            return res.status(200).send({exists, message: 'This is not a follow user'})
        }else{
            return res.status(200).send({exists})
        }
    },

    getFollows: async (req, res) => {
        let userId = req.params.userId
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({message: 'User not found'})
        }
        const userFollows = user.follows
        const userFollowsNum = userFollows.length
        const userFollowers = user.followers
        const userFollowersNum = userFollowers.length

        return res.status(200).send({
            follows: userFollows,
            numFollows: userFollowsNum,
            followers: userFollowers,
            userFollowersNum: userFollowersNum
        })
    }

}

module.exports = controllers