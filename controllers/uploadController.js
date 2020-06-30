const fs = require('fs');
const User = require('../models/User');
const Profile = require('../models/Profile');

exports.uploadProfilePic = async (req, res, next) => {
  if (req.file) {
    try {
      let oldProfilePic = req.user.profilePic;
      let profile = await Profile.findOne({ user: req.user._id });
      let profilePic = `/uploads/${req.file.filename}`;
      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePic } }
        );
      }
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePic } }
      );

      if (oldProfilePic !== '/uploads/default.jpg') {
        fs.unlink(`public${oldProfilePic}`, (er) => {
          console.log(er);
        });
      }

      res.status(200).json({
        profilePic,
      });
    } catch (error) {
      res.status(500).json({
        profilepic: req.user.profilePic,
      });
    }
  } else {
    res.status(500).json({
      profilepic: req.user.profilePic,
    });
  }
};

exports.removeProfilePic = (req, res, next) => {
  try {
    let defaultProfilePic = '/uploads/default.jpg';
    let currentProfilePic = req.user.profilePic;

    fs.unlink(`public${currentProfilePic}`, async (err) => {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePic: defaultProfilePic } }
        );
      }
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePic: defaultProfilePic } }
      );
    });

    res.status(200).json({
      profilePic: defaultProfilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Cannot Remove Profile Picture',
    });
  }
};

exports.postImageUploadController = (req, res, next) => {
  if (req.file) {
    return res.status(200).json({
      imgUrl: `/uploads/${req.file.filename}`,
    });
  }
  return res.status(500).json({
    message: 'serverError',
  });
};
