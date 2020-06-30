const router = require('express').Router();
const {isAuthenticate} = require('../../middleware/authMiddleware')

const {
    commentPostController,
    replyCommentController
} = require('../controllers/commentsController')

const {
    likesGetController,
    dislikesGetController
} = require('../controllers/likeDislikeController')

const {
    bookmarksGetController
} = require('../controllers/bookmarkscontroller');


router.post('/comments/:postId',isAuthenticate,commentPostController)
router.post('/comments/replices/:commentId',isAuthenticate,replyCommentController)


router.get('/likes/:postId',isAuthenticate,likesGetController)
router.get('/dislikes/:postId',isAuthenticate,dislikesGetController)


router.get('/bookmarks/:postId',isAuthenticate,bookmarksGetController)

module.exports = router