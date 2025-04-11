const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const { validateProduct } = require('../middleware/validations');
const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - nome
 *         - descricao
 *         - categoria
 *         - precoBase
 *         - medidasNecessarias
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do produto
 *         categoria:
 *           type: string
 *           enum: [blusas, saias, shorts, biquinis]
 *           description: Categoria do produto
 *         precoBase:
 *           type: number
 *           description: Preço base do produto
 *         imagens:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs das imagens do produto
 *         disponivel:
 *           type: boolean
 *           default: true
 *           description: Indica se o produto está disponível
 *         medidasNecessarias:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               unidade:
 *                 type: string
 *                 default: cm
 *           description: Lista de medidas necessárias para o produto
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/categoria/{categoria}:
 *   get:
 *     summary: Lista produtos por categoria
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *           enum: [blusas, saias, shorts, biquinis]
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/categoria/:categoria', productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
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

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.post('/', validateProduct, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', validateProduct, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/disponibilidade:
 *   patch:
 *     summary: Altera a disponibilidade de um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilidade alterada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto não encontrado
 */
router.patch('/:id/disponibilidade', productController.toggleProductAvailability);

module.exports = router; 