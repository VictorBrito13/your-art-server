const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/session')

//*Controllers
const controllers = require('../controllers/comments')

router.route('/:idPost/:userId?', authMiddleware)
.post(controllers.add_component)
.get(controllers.getComments)

module.exports = router