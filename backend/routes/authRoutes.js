const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário (usado para login)
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *         role:
 *           type: string
 *           enum: [cliente, admin]
 *           default: cliente
 *           description: Papel do usuário no sistema
 */

// Rotas públicas
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos ou email já registrado
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', authController.login);

// Rotas protegidas (apenas admin)
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.get('/clientes', authController.getAllClients);

// Rota temporária para atualizar role para admin
router.post('/make-admin', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            message: 'Usuário atualizado para admin com sucesso',
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao atualizar usuário',
            error: error.message
        });
    }
});

// Rota temporária para limpar todos os dados
router.delete('/limpar-dados', async (req, res) => {
    try {
        await User.deleteMany({ role: 'cliente' }); // Mantém o admin
        await Order.deleteMany({});
        await Product.deleteMany({});
        res.json({ message: 'Todos os dados foram limpos com sucesso' });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao limpar dados',
            error: error.message
        });
    }
});

module.exports = router; 