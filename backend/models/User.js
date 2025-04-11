const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true
  },
  nome: {
    type: String,
    required: [true, 'Por favor, informe seu nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe seu email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, informe um email válido']
  },
  senha: {
    type: String,
    required: [true, 'Por favor, informe uma senha'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  },
  telefone: {
    type: String,
    required: [true, 'Por favor, informe seu telefone']
  },
  endereco: {
    rua: {
      type: String,
      required: [true, 'Por favor, informe sua rua']
    },
    numero: {
      type: String,
      required: [true, 'Por favor, informe o número']
    },
    complemento: String,
    bairro: {
      type: String,
      required: [true, 'Por favor, informe seu bairro']
    },
    cidade: {
      type: String,
      required: [true, 'Por favor, informe sua cidade']
    },
    estado: {
      type: String,
      required: [true, 'Por favor, informe seu estado']
    },
    cep: {
      type: String,
      required: [true, 'Por favor, informe seu CEP']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pre-save para gerar código sequencial
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastUser = await this.constructor.findOne({}, {}, { sort: { 'codigo': -1 } });
    this.codigo = lastUser ? lastUser.codigo + 1 : 1;
  }

  if (!this.isModified('senha')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.senha);
};

module.exports = mongoose.model('User', userSchema); 