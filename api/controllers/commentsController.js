const Post = require('../../models/Post');
const Comments = require('../../models/Comments');

exports.commentPostController = async (req, res, next) => {
  let { postId } = req.params;

  let { body } = req.body;

  if (!req.user) {
    return res.status(403).json({
      error: 'You Are Not An Authenticate User',
    });
  }

  let comment = new Comments({
    post: postId,
    user: req.user._id,
    body,
    replies: [],
  });

  try {
    let createdComment = await comment.save();
    await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: createdComment._id } }
    );

    let commentjson = await Comments.findById(createdComment._id).populate({
      path: 'user',
      select: 'profilePic username',
    });
    res.status(201).json(commentjson);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: 'Server Error',
    });
  }
};

exports.replyCommentController = async (req, res, next) => {
  let { commentId } = req.params;
  let { body } = req.body;

  if (!req.user) {
    return res.status(403).json({
      error: 'You Are Not An Authenticate User',
    });
  }

  let reply = {
    body,
    user: req.user._id,
  };
  try {
    await Comments.findOneAndUpdate(
      { _id: commentId },
      { $push: { replies: reply } },
      { new: true }
    );

    res.status(201).json({
      ...reply,
      profilePic: req.user.profilePic,
      username: req.user.username,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Server Error',
    });
  }
};
