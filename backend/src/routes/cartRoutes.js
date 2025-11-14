const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/cart
// @desc    Obter carrinho do usuário
// @access  Private
router.get('/', authenticateToken, cartController.getCart);

// @route   POST /api/cart
// @desc    Adicionar item ao carrinho
// @access  Private
router.post('/', authenticateToken, cartController.addToCart);

// @route   PUT /api/cart/items/:item_id
// @desc    Atualizar quantidade no carrinho
// @access  Private
router.put('/items/:item_id', authenticateToken, cartController.updateCartItem);

// @route   DELETE /api/cart/items/:item_id
// @desc    Remover item do carrinho
// @access  Private
router.delete('/items/:item_id', authenticateToken, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Limpar carrinho completo
// @access  Private
router.delete('/', authenticateToken, cartController.clearCart);

module.exports = router;