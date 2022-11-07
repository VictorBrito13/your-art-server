const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = new Schema({
    role:{
        type: ['user', 'admin'],
        default: 'user'
    },
    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    avatar:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    posts:[
        {
            title: String,
            body: String,
            files: Array
        }
    ],
    videos:[
        {
            title: String,
            description: String,
            file: String
        }
    ],
    followers:{
        type: Array
    },
    follows:{
        type: Array
    },
    likes:{//Content that i like
        type: Array
    }
})

module.exports = mongoose.model('users', userModel)