const router = require('express').Router()

const { isAuthenticate } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
    uploadProfilePic,
    removeProfilePic,
    postImageUploadController
} = require('../controllers/uploadController')


router.post('/profilePic',
isAuthenticate,
upload.single('profilePic'),
uploadProfilePic)

router.delete('/profilePic',
isAuthenticate,
removeProfilePic)

router.post('/postImage',
isAuthenticate,
upload.single('post-image'),
postImageUploadController)

module.exports=router