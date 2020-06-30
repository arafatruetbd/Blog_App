const { validationResult } = require('express-validator');
const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Comment = require('../models/Comments');
const errorFormater = require('../utils/validationErrorFormator');

exports.dashboardController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.render('pages/dashboard/dashboard', {
        tittle: 'Dashboard',
        flashMessage: Flash.getMessage(req),
        profile,
      });
    }
    res.redirect('/dashboard/create-profile');
  } catch (error) {
    next(error);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.redirect('/dashboard/edit-profile');
    }
    res.render('pages/dashboard/create-profile', {
      tittle: 'Create Your Profile',
      flashMessage: Flash.getMessage(req),
      error: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormater);
  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
      tittle: 'Create Your Profile',
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
    });
  }
  let { name, tittle, bio, website, facebook, twitter, github } = req.body;

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      tittle,
      bio,
      profilePic: req.user.profilePic,
      links: {
        website: website || '',
        facebook: facebook || '',
        twitter: twitter || '',
        github: github || '',
      },
      posts: [],
      bookmarks: [],
    });
    let createProfile = await profile.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createProfile._id } }
    );
    req.flash('success', 'Profile Created Successfully');
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    next(error);
  }

  res.render('pages/dashboard/create-profile', {
    tittle: 'Create Your Profile',
    flashMessage: Flash.getMessage(req),
    error: {},
  });
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile == null) {
      return res.render('pages/dashboard/create-profile', {
        tittle: 'Edit Your Profile',
        flashMessage: Flash.getMessage(req),
        error: {},
      });
    }
    res.render('pages/dashboard/edit-profile', {
      tittle: 'Edit Your Profile',
      error: {},
      flashMessage: Flash.getMessage(req),
      profile,
    });
  } catch (error) {
    next(error);
  }
};

exports.editProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormater);
  let { name, tittle, bio, website, facebook, twitter, github } = req.body;
  if (!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
      tittle: 'Create Your Profile',
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
      profile: {
        name,
        tittle,
        bio,
        links: {
          website,
          facebook,
          twitter,
          github,
        },
      },
    });
  }
  try {
    let profile = {
      name,
      tittle,
      bio,
      links: {
        website: website || '',
        facebook: facebook || '',
        twitter: twitter || '',
        github: github || '',
      },
    };
    let updateProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    );
    req.flash('success', 'Profile Updated Successfully');
    res.render('pages/dashboard/edit-profile', {
      tittle: 'Edit Your Profile',
      error: {},
      flashMessage: Flash.getMessage(req),
      profile: updateProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.bookMarksGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate({
      path: 'bookmarks',
      model: 'Post',
      select: 'tittle thumbnail',
    });
    if (profile === null) {
      let posts = '';
      return res.render('pages/dashboard/bookmarks', {
        tittle: 'My Bookmarks',
        flashMessage: Flash.getMessage(req),
        posts,
      });
    }
    res.render('pages/dashboard/bookmarks', {
      tittle: 'My Bookmarks',
      flashMessage: Flash.getMessage(req),
      posts: profile.bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

exports.commentsGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile === null) {
      let comments = '';
      return res.render('pages/dashboard/comments', {
        tittle: 'My Recent Comments',
        flashMessage: Flash.getMessage(req),
        comments,
      });
    }

    let comments = await Comment.find({ post: { $in: profile.posts } })
      .populate({
        path: 'post',
        select: 'tittle',
      })
      .populate({
        path: 'user',
        select: 'username profilePic',
      })
      .populate({
        path: 'replies.user',
        select: 'username profilePic',
      });

    res.render('pages/dashboard/comments', {
      tittle: 'My Recent Comments',
      flashMessage: Flash.getMessage(req),
      comments: comments || '',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
