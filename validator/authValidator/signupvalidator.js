const User =require('../../models/User');
const {body}=require('express-validator');

module.exports =[
    body('username')
       .isLength({ min: 2, max: 15 }).withMessage('username Must Be Between 2 to 15 chars')
       .custom(async username =>{
           let user = await User.findOne({ username })
           if(user){
               return Promise.reject('Username already use')
           }
       })
       .trim()
       ,
       body('email')
           .isEmail().withMessage('Please provide a valid message')
           .custom(async email =>{
            let  Email = await User.findOne({ email })
            if(Email){
                return Promise.reject('Email already use')
            }
        })
        .normalizeEmail()
        ,
        body('password')
        .isLength({ min: 5 }).withMessage('password Must Be greater than 5 chars')
        ,
        body('confirmpassword')
        .isLength({ min: 5 }).withMessage('provide confirm passseord')
        .custom((confirmpassword,{req})=>{
          if(confirmpassword !== req.body.password){
             throw new Error('password Doesnot match') 
          }
          return true;
        })
]