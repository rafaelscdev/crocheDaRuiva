const Product = require('../models/Product');

// Listar todos os produtos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ disponivel: true });
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
};

// Buscar produto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar produto',
      error: error.message
    });
  }
};

// Criar novo produto (apenas admin)
exports.createProduct = async (req, res) => {
  try {
    // Verifica se é um array de produtos
    if (Array.isArray(req.body)) {
      const products = await Product.insertMany(req.body);
      return res.status(201).json({
        message: 'Produtos criados com sucesso',
        count: products.length,
        products
      });
    }

    // Se não for array, cria um único produto
    const {
      nome,
      descricao,
      categoria,
      precoBase,
      imagens,
      medidasNecessarias,
      tempoEstimadoProducao
    } = req.body;

    const product = await Product.create({
      nome,
      descricao,
      categoria,
      precoBase,
      imagens,
      medidasNecessarias,
      tempoEstimadoProducao
    });

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao criar produto',
      error: error.message
    });
  }
};

// Atualizar produto (apenas admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({
      message: 'Produto atualizado com sucesso',
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao atualizar produto',
      error: error.message
    });
  }
};

// Deletar produto (apenas admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao deletar produto',
      error: error.message
    });
  }
};

// Alterar disponibilidade do produto (apenas admin)
exports.toggleAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    product.disponivel = !product.disponivel;
    await product.save();

    res.json({
      message: `Produto ${product.disponivel ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao alterar disponibilidade do produto',
      error: error.message
    });
  }
};

// Listar produtos por categoria
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoria } = req.params;
    const products = await Product.find({ 
      categoria, 
      disponivel: true 
    });

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar produtos por categoria',
      error: error.message
    });
  }
};

// Alternar disponibilidade do produto (apenas admin)
exports.toggleProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    product.disponivel = !product.disponivel;
    await product.save();

    res.json({
      message: `Produto ${product.disponivel ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao alterar disponibilidade do produto',
      error: error.message
    });
  }
}; 