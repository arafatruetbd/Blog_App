const {body} = require('express-validator')
const cheerio = require('cheerio')

module.exports=[
    body('tittle')
    .not().isEmpty().withMessage('tittle can not be empty')
    .isLength({max: 100}).withMessage('Tittle can not be great than 100 Chars')
    .trim()
    ,
    body('body')
    .not().isEmpty().withMessage('body no be empty')
    .custom(value =>{
      let node =cheerio.load(value)
      text =node.text()
      if(text.length>5000){
        throw new Error('Body cannot be Greater than 5000 chars')
      }
      return true
    })




]