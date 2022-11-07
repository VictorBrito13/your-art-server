const express = require('express')
const router = express.Router()

//*Middlewares
//Validators
const { validateUserRegister, validateUserLogin } = require('../validators/usersValidators')
//AuthMiddleware
const { authMiddleware } = require('../middlewares/session')

//*Controllers
const controller = require('../controllers/user_controllers')

//*Upload avatar
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads_avatar')
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.split('.').pop()
        if(ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'jpeg'){
            filename = `${Date.now()}${file.originalname}`
            cb(null, filename)
        }else{
            return cb("ext not allowed")
        }
    }
})
const upload = multer({storage: storage})


//*ROUTES
//Register
router.post('/register', validateUserRegister, controller.createUser)
//upload Avatar
router.post('/uploadAvatar/:userId', upload.single('avatar'), controller.uploadFile)
//Delete user
router.post('/delete/:id', authMiddleware, controller.deleteUser)

//Login
router.post('/login', validateUserLogin, controller.log_in)

//get user
router.get('/user/:userId', authMiddleware, controller.getUser)
router.get('/avatar/:avatar', controller.getAvatar)

module.exports = router