const User = require('../models/User');
const Comment = require('../models/Comments');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Flash = require('../utils/Flash');
const errorFormator = require('../utils/validationErrorFormator');
const fs = require('fs');

// signup get controller
exports.signupGetController = (req, res, next) => {
  res.render('pages/auth/signup', {
    tittle: 'Create A New Account',
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

//signup post controller
exports.signupPostController = async (req, res, next) => {
  const { username, email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormator);

  if (!errors.isEmpty()) {
    req.flash('fail', 'Please Check Your Form');
    return res.render('pages/auth/signup', {
      tittle: 'Create A New Account',
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let hashedpassword = await bcrypt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hashedpassword,
    });
    await user.save();
    req.flash('success', 'User created Successfully');
    res.redirect('/auth/login');
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// login get controller
exports.loginGetController = (req, res, next) => {
  res.render('pages/auth/login', {
    tittle: 'Login to Your Account',
    error: {},
    flashMessage: Flash.getMessage(req),
  });
};

// logout post controller

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;
  let errors = validationResult(req).formatWith(errorFormator);

  if (!errors.isEmpty()) {
    req.flash('fail', 'Please Check Your Form');
    return res.render('pages/auth/login', {
      tittle: 'Login Your Account',
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
    });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash('fail', 'User Not Found');
      return res.render('pages/auth/login', {
        tittle: 'Login Your Account',
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }
    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('fail', 'Password Not Match');
      return res.render('pages/auth/login', {
        tittle: 'Login Your Account',
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }

    req.session.isLogedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
    req.flash('success', 'Successfully Logged In');
    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

//logou controller

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    return res.redirect('/auth/login');
  });
};

exports.changePssswordGetController = async (req, res, next) => {
  res.render('pages/auth/changePassword', {
    tittle: 'Change Your Password',
    flashMessage: Flash.getMessage(req),
  });
};

exports.changePssswordPostController = async (req, res, next) => {
  let { oldpasword, newpassword, connewpassword } = req.body;

  if (newpassword !== connewpassword) {
    req.flash('fail', 'Password does not match');
    return res.redirect('/auth/change-Password');
  }

  try {
    let match = await bcrypt.compare(oldpasword, req.user.password);
    if (!match) {
      req.flash('fail', 'Invalid Old Password');
      return res.redirect('/auth/change-Password');
    }

    let hash = await bcrypt.hash(newpassword, 11);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { password: hash } }
    );
    req.flash('success', 'Password Changed Successfully');
    return res.redirect('/auth/login');
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteGetController = async (req, res, next) => {
  res.render('pages/auth/delete', {
    tittle: 'Delete Your Account',
    flashMessage: Flash.getMessage(req),
  });
};

exports.deletePostController = async (req, res, next) => {
  let { password, conpassword } = req.body;
  let user = req.user._id;
  if (password !== conpassword) {
    req.flash('fail', 'Password Does Not Match');
    return res.redirect('/auth/delete');
  }

  try {
    let deletematch = await bcrypt.compare(conpassword, req.user.password);
    if (!deletematch) {
      req.flash('fail', 'Invalid  Password');
      return res.redirect('/auth/delete');
    }

    await Comment.deleteMany({ user: req.user._id });
    let posts = await Post.find({ author: req.user._id });

    if (posts) {
      posts.map((post) => {
        if (post.thumbnail) {
          let pic = post.thumbnail;
          return fs.unlink(`public${pic}`, async (err) => {
            await Post.deleteMany({ author: req.user._id });
          });
        }
      });

      await Post.deleteMany({ author: req.user._id });
    }

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      let pic = profile.profilePic;

      if (pic !== '/uploads/default.jpg') {
        return fs.unlink(`public${pic}`, async (err) => {
          await Profile.findOneAndDelete({ user });
        });
      }
      await Profile.findOneAndDelete({ user });
    }

    let userPic = req.user.profilePic;
    let email = req.user.email;
    if (userPic !== '/uploads/default.jpg') {
      fs.unlink(`public${userPic}`, async (err) => {
        await User.findOneAndDelete({ email });
      });
    }

    await User.findOneAndDelete({ email });
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      return res.redirect('/auth/signup');
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
