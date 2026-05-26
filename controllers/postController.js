const Post = require('../models/Post');
const { uploadToCloudinary } = require('../services/cloudinaryService');

// GET /api/posts - return all posts
const getAllPosts = async (req, res) => {
  try{
    const posts = await Post.find().populate('authorId', 'name email');

    res.status(200).json({
      status: 'success',
      count: posts.length,
      data: posts
    });
  }
  catch(err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// GET /api/posts/:id - return single post by id
const getPostById = async (req, res) => {
  try{
    const post = await Post.findById(req.params.id).populate('authorId', 'name email');

    if(!post) {
      return res.status(404).json({
        status: 'error',
        message: `Post with id ${req.params.id} not found`
      });
    }

    res.status(200).json({
      status: 'success', 
      data: post,
    });
  }
  catch(err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};  

// POST /api/posts - create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    if( !title || !content || !authorId ) {
      return res.status(400).json({
        status: 'error',
        message: 'title, content and authorId are required feilds',
      });
    }

    // Upload image to Cloudinary if a file was attached
    let thumbnailUrl = null;
    if(req.file) {
      thumbnailUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newPost = await Post.create({
      title,
      content,
      authorId,
      thumbnailUrl 
    });

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: newPost,
    });
  }
  catch(err) {
    // Mongoose ValidationError — missing required fields
    if(err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    };
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// PUT /api/posts/:id - update a post by id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return updated doc, not original
        runValidators: true, // run schema validators on update
      }
    );

    if(!post) {
      return res.status(404).json({
        status: 'error',
        message: `Post with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: post,
    })
  }
  catch(err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// DELETE /api/posts/:id - delete a post by id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if(!post) {
      return res.status(404).json({
        status: 'error',
        message: `Post with id ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Post with id ${req.params.id} deleted successfully`,
    });
  }
  catch(err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// GET /api/posts/top - return top 3 most recent posts
const getTopPosts = async (req, res) => {
  try {
    const topPost = await Post.find()
    .sort({ createdAt: -1 }) // new first 
    .limit(3)                // Only 3 results
    .populate('authorId', 'name email');

    res.status(200).json({
      status: 'success',
      count: topPost.length,
      data: topPost,
    });
  }
  catch(err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}


module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getTopPosts,
};