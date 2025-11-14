const express = require('express');
const productController = require('../controllers/productController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/products
// @desc    Listar todos os produtos (com filtros e paginação)
// @access  Public
router.get('/', optionalAuth, productController.getAllProducts);

// @route   GET /api/products/categories
// @desc    Obter categorias disponíveis
// @access  Public
router.get('/categories', productController.getCategories);

// @route   GET /api/products/category/:category
// @desc    Obter produtos por categoria
// @access  Public
router.get('/category/:category', productController.getProductsByCategory);

// @route   GET /api/products/:id
// @desc    Obter produto por ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Criar novo produto (Admin)
// @access  Private/Admin
router.post('/', authenticateToken, productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Atualizar produto (Admin)
// @access  Private/Admin
router.put('/:id', authenticateToken, productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Deletar produto (Admin)
// @access  Private/Admin
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;