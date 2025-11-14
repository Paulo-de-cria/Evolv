const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login do usuário
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/profile
// @desc    Obter perfil do usuário logado
// @access  Private
router.get('/profile', authenticateToken, authController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;