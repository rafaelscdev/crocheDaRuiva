const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar email de confirmação
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    await transporter.sendMail({
      from: `"Crochê da Ruiva" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Pedido #${order._id} Recebido`,
      html: `
        <h1>Obrigado pelo seu pedido!</h1>
        <p>Olá ${user.nome},</p>
        <p>Seu pedido foi recebido e está sendo processado.</p>
        <p>Número do pedido: #${order._id}</p>
        <p>Status: ${order.status}</p>
        <p>Valor total: R$ ${order.precoTotal.toFixed(2)}</p>
        <p>Em breve entraremos em contato para confirmar os detalhes.</p>
        <p>Atenciosamente,<br>Equipe Crochê da Ruiva</p>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

// Criar novo pedido
exports.createOrder = async (req, res) => {
  try {
    const { produto: produtoId, medidas, observacoes } = req.body;
    const usuario = req.user._id;

    // Verificar se o produto existe e está disponível
    const produto = await Product.findById(produtoId);
    if (!produto || !produto.disponivel) {
      return res.status(400).json({ 
        message: 'Produto não encontrado ou indisponível' 
      });
    }

    // Calcular preço total (por enquanto, usando apenas o preço base)
    const precoTotal = produto.precoBase;

    // Criar pedido
    const order = await Order.create({
      usuario,
      produto: produtoId,
      medidas,
      precoTotal,
      observacoes
    });

    // Enviar email de confirmação
    await sendOrderConfirmationEmail(order, req.user);

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao criar pedido',
      error: error.message
    });
  }
};

// Listar pedidos do usuário
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ usuario: req.user.id })
      .populate('produto')
      .sort('-createdAt');

    res.json({
      count: orders.length,
      orders: orders.map(order => ({
        numero: order.numero,
        ...order.toObject()
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar pedidos',
      error: error.message
    });
  }
};

// Listar todos os pedidos (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('usuario', 'nome email telefone')
      .populate('produto')
      .sort('-createdAt');

    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar pedidos',
      error: error.message
    });
  }
};

// Atualizar status do pedido (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, comentario } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    order.status = status;
    if (status === 'confirmado') {
      // Calcular data de entrega prevista baseado no tempo estimado do produto
      const produto = await Product.findById(order.produto);
      const dataEntregaPrevista = new Date();
      dataEntregaPrevista.setDate(dataEntregaPrevista.getDate() + produto.tempoEstimadoProducao);
      order.dataEntregaPrevista = dataEntregaPrevista;
    }

    // Adicionar ao histórico
    order.historicoStatus.push({
      status,
      comentario,
      data: Date.now()
    });

    await order.save();

    res.json({
      message: 'Status do pedido atualizado com sucesso',
      order
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao atualizar status do pedido',
      error: error.message
    });
  }
};

// Buscar pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('usuario', 'nome email telefone')
      .populate('produto');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Verificar se o usuário tem permissão para ver este pedido
    if (req.user.role !== 'admin' && order.usuario._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Você não tem permissão para ver este pedido' 
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar pedido',
      error: error.message
    });
  }
}; 