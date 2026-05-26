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
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required'],
        },
        thumbnailUrl: {
            type: String,
            default: null, 
        },
    },
    {
        timestamps: true, // auto-adds createdAt and updatedAt
    },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
