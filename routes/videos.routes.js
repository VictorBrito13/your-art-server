const express = require('express')
const router = express.Router()
const videoController = require('../controllers/videos')
const { authMiddleware } = require('../middlewares/session')
const { multerMiddleware } = require('../helpers/uploadVideo')

//*Post video / Get videos
router.route('/', authMiddleware)
.get(videoController.getVideos)
.post(videoController.newVideo)

//*Delete video / Get video
router.route('/video/:videoId/:userId?', authMiddleware)
.get(videoController.getVideo)
.delete(videoController.deleteVideo)

//*Upload Media
router.post('/video/uploadVideo/:videoId/:userId', multerMiddleware.single('video'), videoController.uploadVideo)

//*Get Media
router.get('/media/:video', videoController.getMedia)

module.exports = router