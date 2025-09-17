const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/auth-controller');
const { authMiddleware } = require('../middleware/auth-middleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées (nécessitent une authentification)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
