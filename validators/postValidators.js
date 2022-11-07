const { check, validationResult } = require('express-validator')

const postValidator = [
    check("title")
    .exists()
    .notEmpty(),

    check("body")
    .exists()
    .notEmpty(),
    check("files")
    .exists()
    .isArray({min: 1, max: 5})
    .notEmpty(),

    (req, res, next) => {
        try{
            validationResult(req).throw()
            return next()
        }catch(err){
            console.error(err)
            return res.status(500).send({error: err.array()})
        }
    }
]