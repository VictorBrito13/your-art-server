const videoModel = require('../models/videos')
const userModel = require('../models/users')
const fs = require('fs')
const Path = require('path')

const videoController = {
    //*New video
    newVideo: async (req, res) => {
        try {
            const { title, description } = req.body
            const video = new videoModel()
            video.title = title
            video.description = description
            video.likes = []
            video.dislikes = []
            video.comments = []
            video.files = null

            const data = await video.save()
            return res.status(200).send({ data })
        } catch (err) {
            console.error(err)
            return res.status(500).send(err)
        }
    },
    //*Upload file
    uploadVideo: async (req, res) => {
        const videoId = req.params.videoId
        const video = await videoModel.findById(videoId)
        const userId = req.params.userId
        const user = await userModel.findById(userId)
        if(!video) return res.status(500).send({message: 'the video does not exist'})
        const userVideos = user.videos
        if(!user) return res.status(404).send({message: 'The user does not exist'})
        if(req.file){
            const ext = req.file.filename.split('.').pop()
            const fileName = req.file.filename
            if(ext === 'mp4' || ext === 'webm'){
                const videoStructure = {
                    title: video.title,
                    description: video.description,
                    file: fileName,
                    _id: video._id
                }
                userVideos.unshift(videoStructure)
                await userModel.findByIdAndUpdate(userId, {videos: userVideos}, {new: true})
                const data = await videoModel.findByIdAndUpdate(videoId, {file: fileName}, {new: true})
                res.status(200).send({data})
            }else{
                fs.unlink(`./uploads_videos/${fileName}`, (err) => {
                    console.log(err)
                })
                res.status(500).send({message: 'The extension video must be mp4 or webm'})
            }
        }else{
            res.status(500).send({message: 'Must be a video'})
        }
    },
    //*Get videos
    getVideos: async (req, res) => {
        try{
            const data = await videoModel.find().exec()
            return res.status(200).send({data})
        }catch(err){
            console.log(err)
            return res.status(500).send(err)
        }
    },
    //*Get video
    getVideo: async (req, res) => {
        try{
            const videoId = req.params.videoId
            const data = await videoModel.findById(videoId)
            if(!data) return res.status(404).send({message: 'This video does not exist'})
            return res.status(200).send({data})
        }catch(err){
            console.log(err)
            return res.status(500).send(err)
        }
    },
    //*Delete video
    deleteVideo: async (req, res) => {
        try{
            const videoId = req.params.videoId
            const userId = req.params.userId
            const user = await userModel.findById(userId)
            if(!user) return res.status(404).send({message: 'The user does not exist'})
            const userVideos = user.videos
            userVideos.forEach((video, index) => {
                if(video._id.equals(videoId)) userVideos.splice(index, 1)
            })
            await userModel.findByIdAndUpdate(userId, {videos: userVideos}, {new: true})
            const data = await videoModel.findByIdAndRemove(videoId)
            if(!data) return res.status(404).send({message: 'This video does not exist'})
            return res.status(200).send({data: data})
        }catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    },
    //*Get media
    getMedia:(req, res) => {
        try{
            const video = req.params.video
            const path = './uploads_videos/'
            if(fs.existsSync(path + video)){
                return res.status(200).sendFile(Path.resolve(path + video))
            }else{
                return res.status(404).send({message: 'Video not found'})
            }
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = videoController