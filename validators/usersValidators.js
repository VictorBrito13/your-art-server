const { check, validationResult } = require('express-validator');

const validateUserRegister = [
    check("name", "The name is not defined, set a name in the body")
    .exists()
    .notEmpty(),
    check("lastName", "The lastName is not defined, set a lastName in the body")
    .exists()
    .notEmpty(),
    check("age", "The age must be a number or the age is not defined in the body")
    .isNumeric()
    .exists()
    .notEmpty(),
    check("username", "The username is not defined in the body")
    .exists()
    .notEmpty(),
    check("email", "The email is not defined in the body or the email is incorrect")
    .exists()
    .notEmpty()
    .isEmail(),
    check("password", "The password is not defined in the body or is to short min 8 characters")
    .exists()
    .notEmpty()
    .isLength({min: 8, max: 50}),

    (req, res, next) => {
        try{
            validationResult(req).throw()
            return next()
        }catch(e){
            console.log(e)
            res.send(e.array())
        }
    }
]

const validateUserLogin = [
    check("email")
    .exists()
    .notEmpty()
    .isEmail(),
    check("password")
    .exists()
    .notEmpty()
    .isLength({min: 8, max: 50}),

    (req, res, next) =>{
        try{
            validationResult(req).throw()
            return next()
        }catch(e){
            console.error(e)
            console.log("Error en la validacion del login")
        }
    }
]

module.exports = { validateUserRegister, validateUserLogin }