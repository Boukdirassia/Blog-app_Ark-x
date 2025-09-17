const express = require('express');
const router = express.Router();
const { 
  getLikesByPostId, 
  toggleLike, 
  getLikedPostsByUser 
} = require('../controllers/like-controller');
const { authMiddleware, optionalAuth } = require('../middleware/auth-middleware');

// Routes publiques (lecture)
router.get('/post/:postId', optionalAuth, getLikesByPostId);

// Routes protégées (écriture)
router.post('/post/:postId/toggle', authMiddleware, toggleLike);
router.get('/user/liked', authMiddleware, getLikedPostsByUser);

module.exports = router;
