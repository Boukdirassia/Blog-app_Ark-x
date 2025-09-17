const express = require('express');
const router = express.Router();
const { 
  getCommentsByPostId, 
  addComment, 
  updateComment, 
  deleteComment 
} = require('../controllers/comment-controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth-middleware');

// Routes publiques (lecture)
router.get('/post/:postId', optionalAuth, getCommentsByPostId);

// Routes protégées (écriture)
router.post('/post/:postId', authMiddleware, addComment);
router.put('/:commentId', authMiddleware, updateComment);
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router;
