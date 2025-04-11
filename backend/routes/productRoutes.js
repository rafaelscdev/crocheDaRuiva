const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const Product = require('../models/Product');

// Rotas públicas
router.get('/', productController.getAllProducts);
router.get('/categoria/:categoria', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Rotas protegidas (apenas admin)
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Rota temporária para limpar produtos (deve vir antes das rotas com :id)
router.delete('/limpar-todos', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: 'Todos os produtos foram removidos com sucesso' });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao remover produtos',
            error: error.message
        });
    }
});

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/disponibilidade', productController.toggleProductAvailability);

module.exports = router; 