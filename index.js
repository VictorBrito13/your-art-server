require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const port = process.env.PORT || 6601
const URL = process.env.URL || 'mongodb://127.0.0.1:27017/your_art'

mongoose.connect(URL)
.then(() => {
    console.log('data base conected')
    app.listen(port,() => {
        console.log(`app running in the port: ${port}`)
    })
})
.catch((err) => {
    console.error(err)
})