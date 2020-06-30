const { body } = require('express-validator');

module.exports=[
    body('email')
        .not().isEmpty().withMessage('Please provide Email'),
    body('password')
         .not().isEmpty().withMessage('please provide password')
]