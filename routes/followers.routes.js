const express = require('express')
const router = express.Router()

//Middlewares
const { authMiddleware } = require('../middlewares/session')

//Controllers
const controllers = require('../controllers/followers')

//Routes
router.post('/:idUser/:idNewFollower', authMiddleware, controllers.new_follower)
router.delete('/:idUser/:idOldFollower', authMiddleware, controllers.delete_follower)
router.get('/getFollow/:userId/:followId', authMiddleware, controllers.followComprobate)
router.get('/getFollows/:userId', authMiddleware, controllers.getFollows)

module.exports = router