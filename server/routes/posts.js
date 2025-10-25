const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const Post = require('../models/Post');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Validation rules for post creation/update
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Content must be between 1 and 50000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 20) {
        throw new Error('Maximum 20 tags allowed');
      }
      tags.forEach(tag => {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Each tag must be a string with max 50 characters');
        }
      });
      return true;
    }),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters')
    .escape()
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid post ID format')
];

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', idValidation, handleValidationErrors, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', postValidation, handleValidationErrors, async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || [],
      author: req.body.author || 'Anonymous'
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Update post
router.patch('/:id', [...idValidation, ...postValidation], handleValidationErrors, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.tags) post.tags = req.body.tags;
    if (req.body.author) post.author = req.body.author;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;