const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const { validateMeasurements } = require('../middleware/validations');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - usuario
 *         - produto
 *         - medidas
 *       properties:
 *         numero:
 *           type: number
 *           description: Número sequencial do pedido (gerado automaticamente)
 *         usuario:
 *           type: string
 *           description: ID do usuário que fez o pedido
 *         produto:
 *           type: string
 *           description: ID do produto pedido
 *         medidas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               valor:
 *                 type: number
 *               unidade:
 *                 type: string
 *                 default: cm
 *           description: Lista de medidas do pedido
 *         status:
 *           type: string
 *           enum: [pendente, confirmado, em_producao, enviado, entregue, cancelado]
 *           default: pendente
 *           description: Status atual do pedido
 *         precoTotal:
 *           type: number
 *           description: Preço total do pedido
 *         observacoes:
 *           type: string
 *           description: Observações adicionais do pedido
 *         dataEntregaPrevista:
 *           type: string
 *           format: date
 *           description: Data prevista para entrega
 */

// Todas as rotas de pedidos requerem autenticação
router.use(authController.protect);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produto
 *               - medidas
 *             properties:
 *               produto:
 *                 type: string
 *                 description: ID do produto
 *               medidas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                     valor:
 *                       type: number
 *                     unidade:
 *                       type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', validateMeasurements, orderController.createOrder);

/**
 * @swagger
 * /api/orders/meus-pedidos:
 *   get:
 *     summary: Lista todos os pedidos do usuário logado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autorizado
 */
router.get('/meus-pedidos', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtém detalhes de um pedido específico
 *     tags: [Pedidos]
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
 *         description: Detalhes do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', orderController.getOrderById);

// Rotas apenas para admin
router.use(authController.restrictTo('admin'));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lista todos os pedidos (apenas admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido (apenas admin)
 *     tags: [Pedidos]
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
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, confirmado, em_producao, enviado, entregue, cancelado]
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router; 