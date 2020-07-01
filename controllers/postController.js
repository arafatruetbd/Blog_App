const { validationResult } = require('express-validator');
const readingTime = require('reading-time');
const Flash = require('../utils/Flash');
const errorFormter = require('../utils/validationErrorFormator');

const Post = require('../models/Post');
const Profile = require('../models/Profile');
exports.createPostGetController = (req, res, next) => {
  res.render('pages/dashboard/post/createPost', {
    tittle: 'Create Post',
    flashMessage: Flash.getMessage(req),
    error: {},
    value: {},
  });
};

exports.createPostPostController = async (req, res, next) => {
  let { tittle, body, tags } = req.body;

  let errors = validationResult(req).formatWith(errorFormter);
  if (!errors.isEmpty()) {
    res.render('pages/dashboard/post/createPost', {
      tittle: 'Create Post',
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
      value: {
        tittle,
        body,
        tags,
      },
    });
  }
  if (tags) {
    tags = tags.split(',');
    tags = tags.map((t) => t.trim());
  }

  let readTime = readingTime(body).text;

  let post = new Post({
    tittle,
    body,
    tags,
    author: req.user._id,
    thumbnail: '',
    readTime,
    likes: [],
    dislikes: [],
    comments: [],
  });

  if (req.file) {
    post.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    let createdPost = await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { posts: createdPost._id } }
    );
    req.flash('success', 'Post Created Successfully');
    return res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// edit post get controller

exports.editPostGetController = async (req, res, next) => {
  let postId = req.params.postId;
  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error('404 Edit Page Not Found');
      error.status = 404;
      throw error;
    }
    res.render('pages/dashboard/post/editPost', {
      tittle: 'Edit Your Post',
      error: {},
      flashMessage: Flash.getMessage(req),
      post,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.editPostPostController = async (req, res, next) => {
  let { tittle, body, tags } = req.body;
  let errors = validationResult(req).formatWith(errorFormter);
  let postId = req.params.postId;
  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });
    if (!post) {
      let error = new Error('404 Page Not Found');
      error.status = 404;
      throw error;
    }
    if (!errors.isEmpty()) {
      res.render('pages/dashboard/post/createPost', {
        tittle: 'Create Post',
        error: errors.mapped(),
        flashMessage: Flash.getMessage(req),
        post,
      });
    }
    if (tags) {
      tags = tags.split(',');
      tags = tags.map((t) => t.trim());
    }
    let thumbnail = post.thumbnail;
    if (req.file) {
      thumbnail = req.file.filename;
    }

    await Post.findOneAndUpdate(
      { _id: post._id },
      { $set: { tittle, body, tags, thumbnail } },
      { new: true }
    );
    req.flash('success', 'Post Updated Successfully');
    res.redirect('/posts/edit/'+post._id);
  } catch (error) {
    next(error);
  }
};

//delete single post
exports.DeleteGetController = async (req, res, next) => {
  let { postId } = req.params;
  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });
    if (!post) {
      let error = new Error('404 Page Not Found');
      error.status = 404;
      throw error;
    }
    await Post.findOneAndDelete({ _id: postId });
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { posts: postId } }
    );
    req.flash('success', 'Post Deleted Successfully');
    res.redirect('/posts');
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// get all post
exports.AllPostGetController = async (req, res, next) => {
  try {
    let posts = await Post.find({ author: req.user._id });

    res.render('pages/dashboard/post/posts', {
      tittle: 'My All Post',
      posts,
      flashMessage: Flash.getMessage(req),
    });
  } catch (error) {
    next(error);
  }
};
