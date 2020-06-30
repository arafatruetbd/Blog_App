const User = require('../models/User');
exports.bindUserWithRequest = () => {
  return async (req, res, next) => {
    if (!req.session.isLogedIn) {
      return next();
    }
    try {
      let user = await User.findById(req.session.user._id);
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

exports.isAuthenticate = (req, res, next) => {
  if (!req.session.isLogedIn) {
    return res.redirect('/auth/login');
  }
  next();
};

exports.isUnAuthenticate = (req, res, next) => {
  if (req.session.isLogedIn) {
    return res.redirect('/dashboard');
  }
  next();
};
