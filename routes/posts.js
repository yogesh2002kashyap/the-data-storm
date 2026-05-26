const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getTopPosts
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/top', getTopPosts);
router.get('/:id', getPostById);
router.post('/', upload.single('thumbnail'), createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;