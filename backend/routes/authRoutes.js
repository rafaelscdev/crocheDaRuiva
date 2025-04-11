const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Rotas públicas
router.post('/register', authController.register);
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