const Profile = require('../../models/Profile');

exports.bookmarksGetController = async (req, res, next) => {
  let { postId } = req.params;
  if (!req.user) {
    return res.status(403).json({
      error: 'You Are Not An Authenticate User',
    });
  }
  let userId = req.user._id;
  let bookmarks = null;

  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile.bookmarks.includes(postId)) {
      await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { bookmarks: postId } }
      );
      bookmarks = false;
    } else {
      await Profile.findOneAndUpdate(
        { user: userId },
        { $push: { bookmarks: postId } }
      );
      bookmarks = true;
    }

    res.status(200).json({
      bookmarks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Server Error',
    });
  }
};
