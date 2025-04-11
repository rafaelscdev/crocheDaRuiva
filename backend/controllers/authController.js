const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco } = req.body;

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este email já está cadastrado' });
    }

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      senha,
      telefone,
      endereco
    });

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao cadastrar usuário',
      error: error.message
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe e incluir a senha na busca
    const user = await User.findOne({ email }).select('+senha');
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isMatch = await user.matchPassword(senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        codigo: user.codigo
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao realizar login',
      error: error.message
    });
  }
};

// Middleware de proteção de rotas
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Acesso não autorizado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o usuário ainda existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Acesso não autorizado' });
  }
};

// Middleware de restrição de acesso por role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Você não tem permissão para realizar esta ação' 
      });
    }
    next();
  };
};

// Listar todos os clientes (apenas admin)
exports.getAllClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'cliente' }).select('-senha');
    res.json({
      count: clients.length,
      clients
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar clientes',
      error: error.message
    });
  }
}; 