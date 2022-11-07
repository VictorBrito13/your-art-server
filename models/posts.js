const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostModel = new Schema({
    title:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: false
    },
    body:{
        type: String,
        required: true
    },
    files:{
        type: Array,
        required: false
    },
    comments:[
        {
            username: String,
            body: String
        }
    ],
    likes:[
        {
            username: String,
            avatar: String
        }
    ]
})

module.exports = mongoose.model('posts', PostModel)