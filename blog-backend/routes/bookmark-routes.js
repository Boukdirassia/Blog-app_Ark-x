const express = require('express');
const router = express.Router();
const { 
  getUserBookmarks, 
  checkBookmark, 
  toggleBookmark 
} = require('../controllers/bookmark-controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth-middleware');

// Routes protégées (lecture et écriture)
router.get('/user', authMiddleware, getUserBookmarks);
router.get('/post/:postId', optionalAuth, checkBookmark);
router.post('/post/:postId/toggle', authMiddleware, toggleBookmark);

module.exports = router;
