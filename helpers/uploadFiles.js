const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        let extFile = file.originalname.split('.').pop()
        if (extFile == 'jpg' || extFile == 'gif' || extFile == 'png' || extFile == 'jpeg'){
            const filename = `${Date.now()}-${file.originalname}`
            cb(null, filename)
        }else{
            return cb("Error")
        }
    }
})

module.exports = {storage}