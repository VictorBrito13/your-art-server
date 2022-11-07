const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        return cb(null, './uploads_videos')
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        return cb(null, fileName)
    }
})

const multerMiddleware = multer({storage})
module.exports = { multerMiddleware }