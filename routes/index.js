const express = require('express')
const router = express.Router()
const fs = require('fs')

function removeExt(file){
    let fileName = file.split('.').shift()
    return fileName
}

fs.readdir(__dirname, (err, files) => {
    if(err) throw err
    files.forEach((file) => {
        let fileName = removeExt(file)
        if(fileName !== 'index')
        router.use(`/${fileName}`, require(`./${file}`))
    })
})

module.exports = router