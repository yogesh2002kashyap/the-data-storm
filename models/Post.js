const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
        }, 
        author:  {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
    },
    {
        timestamps: true, // auto-adds createdAt and updatedA
    },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
