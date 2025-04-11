const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

// Todas as rotas de pedidos requerem autenticação
router.use(authController.protect);

// Rotas para clientes
router.post('/', orderController.createOrder);
router.get('/meus-pedidos', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Rotas apenas para admin
router.use(authController.restrictTo('admin'));
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router; 