const { body } = require('express-validator')
const validator = require('validator')
const linkValidator = value => {
    if (value) {
        if (!validator.isURL(value)){
            throw new Error('Please Provide valid URL')
        }
    }
    return true
}
module.exports = [
    body('name')
       .not().isEmpty().withMessage('Name cannot Be Empty')
       .isLength( { max: 50 }).withMessage('Tittle cannot be more than 50 chars')
       .trim()
        ,
    body('tittle')
    .not().isEmpty().withMessage('Tittle cannot Be Empty')
    .isLength({max: 100 }).withMessage('Tittle cannot be more than 100 chars')
    .trim()
    , 
 body('bio')
      .not().isEmpty().withMessage('Bio cannot Be Empty')
     .isLength({max: 500 }).withMessage('Bio cannot be more than 500 chars')
     .trim()
     ,

body('website')
   .custom(linkValidator)
,
body('facebook')
.custom(linkValidator)
,
body('twitter')
.custom(linkValidator)
,
body('github')
.custom(linkValidator)

]