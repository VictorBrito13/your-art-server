const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoModel = new Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    file:{
        type: String
    },
    likes:[
        {
            username: String,
            avatar: String
        }
    ],
    dislikes: [
        {
            username: String,
            avatar: String
        }
    ],
    comments:[
        {
            username: String,
            body: String
        }
    ]
})

module.exports = mongoose.model('video', videoModel)