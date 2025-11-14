const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/orders
// @desc    Criar novo pedido
// @access  Private
router.post('/', authenticateToken, orderController.createOrder);

// @route   GET /api/orders
// @desc    Obter todos os pedidos do usuário
// @access  Private
router.get('/', authenticateToken, orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Obter pedido específico do usuário
// @access  Private
router.get('/:id', authenticateToken, orderController.getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Atualizar status do pedido (Admin)
// @access  Private/Admin
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;