const mongoose = require('mongoose');

// Contador para número sequencial do pedido
let orderCounter = 1;

const orderSchema = new mongoose.Schema({
  numero: {
    type: Number,
    unique: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  medidas: [{
    nome: {
      type: String,
      required: true
    },
    valor: {
      type: Number,
      required: true
    },
    unidade: {
      type: String,
      default: 'cm'
    }
  }],
  status: {
    type: String,
    required: true,
    enum: ['pendente', 'confirmado', 'em_producao', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  precoTotal: {
    type: Number,
    required: true
  },
  observacoes: {
    type: String
  },
  dataEntregaPrevista: {
    type: Date
  },
  historicoStatus: [{
    status: {
      type: String,
      required: true
    },
    data: {
      type: Date,
      default: Date.now
    },
    comentario: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para atualizar histórico de status
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.historicoStatus.push({
      status: this.status,
      data: Date.now()
    });
  }
  next();
});

// Middleware pre-save para gerar número sequencial
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'numero': -1 } });
    this.numero = lastOrder ? lastOrder.numero + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 