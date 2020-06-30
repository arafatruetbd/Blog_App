const router = require('express').Router();
const registerValidator = require('../validator/authValidator/signupvalidator');
const loginValidator = require('../validator/authValidator/loginValidator');
const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
  changePssswordGetController,
  changePssswordPostController,
  deleteGetController,
  deletePostController,
} = require('../controllers/authController');

const { isUnAuthenticate } = require('../middleware/authMiddleware');
const { isAuthenticate } = require('../middleware/authMiddleware');

router.get('/signup', isUnAuthenticate, signupGetController);
router.post(
  '/signup',
  isUnAuthenticate,
  registerValidator,
  signupPostController
);

router.get('/login', isUnAuthenticate, loginGetController);
router.post('/login', isUnAuthenticate, loginValidator, loginPostController);

router.get('/change-Password', isAuthenticate, changePssswordGetController);
router.post('/change-Password', isAuthenticate, changePssswordPostController);

router.get('/delete', isAuthenticate, deleteGetController);
router.post('/delete', isAuthenticate, deletePostController);

router.get('/logout', logoutController);

module.exports = router;
