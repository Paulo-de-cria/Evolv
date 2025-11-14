const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Obter perfil do usuário
// @access  Private
router.get('/profile', authenticateToken, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', authenticateToken, userController.updateUserProfile);

// @route   PUT /api/users/password
// @desc    Alterar senha do usuário
// @access  Private
router.put('/password', authenticateToken, userController.changePassword);

module.exports = router;