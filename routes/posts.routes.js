const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../helpers/uploadFiles')


const uploads = multer({storage: storage})

//*Session token
const { authMiddleware } = require('../middlewares/session')

//*Controllers
const controllers = require('../controllers/posts_controllers')

//*Routes
//New post
router.post('/', authMiddleware, controllers.new_post)
router.post('/uploadFiles/:postId/:idUser', uploads.array('files', 5), controllers.uploadFiles)

//Posts
router.get('/', authMiddleware, controllers.get_posts)
router.get('/getImage/:image', controllers.getImage)

//Delete and get post
router.route('/:id/:idUser?', authMiddleware)//El primer id es del post y el segundo del usuario
.get(controllers.get_post)
.delete(controllers.delete_post)

module.exports = router