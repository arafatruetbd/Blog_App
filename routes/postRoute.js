const router = require('express').Router();
const { isAuthenticate  }=require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const postvalidator = require('../validator/dashboardValidator/postValidator/postValidator')
const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    DeleteGetController,
    AllPostGetController
}=require('../controllers/postController')

router.get('/create',isAuthenticate,createPostGetController)
router.post('/create',isAuthenticate,upload.single('post-thumbnail'),postvalidator,createPostPostController)


router.get('/edit/:postId',isAuthenticate,editPostGetController)
router.post('/edit/:postId',isAuthenticate,upload.single('post-thumbnail'),postvalidator,editPostPostController)


router.get('/delete/:postId',isAuthenticate,DeleteGetController)

router.get('/',isAuthenticate,AllPostGetController)
module.exports = router