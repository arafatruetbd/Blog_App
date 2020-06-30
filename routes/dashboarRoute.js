const router = require('express').Router();
const { isAuthenticate  }=require('../middleware/authMiddleware')
const profileValidator = require('../validator/dashboardValidator/profileValidator')
const { 
     dashboardController,
     createProfileGetController,
     createProfilePostController,
     editProfileGetController,
     editProfilePostController,
     bookMarksGetController,
     commentsGetController
} = require('../controllers/dashboardController');

router.get('/bookmarks',isAuthenticate,bookMarksGetController)


 router.get('/create-profile',isAuthenticate,createProfileGetController)
 router.post('/create-profile',isAuthenticate,profileValidator,createProfilePostController)

 router.get('/edit-profile',isAuthenticate,editProfileGetController)
 router.post('/edit-profile',isAuthenticate,profileValidator,editProfilePostController)
router.get('/comments',isAuthenticate,commentsGetController)
 
 router.get('/',isAuthenticate,dashboardController);

 module.exports = router;