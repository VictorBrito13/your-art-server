const express = require('express')
const router = express.Router()

//*Middlewares
const { authMiddleware } = require('../middlewares/session')

//*Controllers
const controller = require('../controllers/likes')

router.post('/:idPost/:idUser', authMiddleware, controller.new_like)
router.delete('/:idPost/:idUser', authMiddleware, controller.delete_like)
router.get('/comprobate/:userId/:postId', authMiddleware, controller.comprobateLike)
router.get('/getLikes/:postId', authMiddleware, controller.getLikes)
router.post('/dislike/:videoId/:userId', controller.dislike)
router.delete('/dislike/delete/:userId/:videoId', controller.delete_dislike)

module.exports = router