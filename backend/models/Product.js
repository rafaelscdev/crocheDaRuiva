const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome do produto']
  },
  descricao: {
    type: String,
    required: [true, 'Por favor, informe a descrição do produto']
  },
  categoria: {
    type: String,
    required: [true, 'Por favor, informe a categoria do produto'],
    enum: ['blusas', 'saias', 'shorts', 'biquinis']
  },
  precoBase: {
    type: Number,
    required: [true, 'Por favor, informe o preço base do produto']
  },
  imagens: [{
    type: String,
    required: [true, 'Por favor, adicione pelo menos uma imagem']
  }],
  disponivel: {
    type: Boolean,
    default: true
  },
  medidasNecessarias: [{
    nome: {
      type: String,
      required: true
    },
    descricao: {
      type: String,
      required: true
    },
    unidade: {
      type: String,
      default: 'cm'
    }
  }],
  tempoEstimadoProducao: {
    type: Number, // em dias
    required: [true, 'Por favor, informe o tempo estimado de produção']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Atualizar o timestamp 'updatedAt' antes de salvar
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema); 