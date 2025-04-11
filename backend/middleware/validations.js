const validateMeasurements = async (req, res, next) => {
  try {
    const { produto, medidas } = req.body;
    const Product = require('../models/Product');

    // Buscar o produto
    const productDetails = await Product.findById(produto);
    if (!productDetails) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Verificar se todas as medidas necessárias foram fornecidas
    const medidasNecessarias = new Set(productDetails.medidasNecessarias.map(m => m.nome.toLowerCase()));
    const medidasFornecidas = new Set(medidas.map(m => m.nome.toLowerCase()));

    // Verificar medidas faltantes
    const medidasFaltantes = [...medidasNecessarias].filter(m => !medidasFornecidas.has(m));
    if (medidasFaltantes.length > 0) {
      return res.status(400).json({
        message: 'Medidas obrigatórias faltando',
        medidasFaltantes
      });
    }

    // Verificar medidas extras não necessárias
    const medidasExtras = [...medidasFornecidas].filter(m => !medidasNecessarias.has(m));
    if (medidasExtras.length > 0) {
      return res.status(400).json({
        message: 'Medidas fornecidas não são necessárias para este produto',
        medidasExtras
      });
    }

    // Validar valores das medidas
    for (const medida of medidas) {
      if (typeof medida.valor !== 'number' || medida.valor <= 0) {
        return res.status(400).json({
          message: 'Valor de medida inválido',
          medida: medida.nome,
          valor: medida.valor
        });
      }

      // Validações específicas por tipo de medida
      switch (medida.nome.toLowerCase()) {
        case 'cintura':
        case 'quadril':
        case 'busto':
          if (medida.valor < 40 || medida.valor > 200) {
            return res.status(400).json({
              message: `Medida de ${medida.nome} fora dos limites aceitáveis (40-200 cm)`,
              medida: medida.nome,
              valor: medida.valor
            });
          }
          break;
        case 'comprimento':
          if (medida.valor < 20 || medida.valor > 150) {
            return res.status(400).json({
              message: `Medida de comprimento fora dos limites aceitáveis (20-150 cm)`,
              medida: medida.nome,
              valor: medida.valor
            });
          }
          break;
      }
    }

    next();
  } catch (error) {
    console.error('Erro na validação de medidas:', error);
    res.status(500).json({ message: 'Erro interno na validação de medidas' });
  }
};

const validateProduct = (req, res, next) => {
  try {
    const { nome, descricao, precoBase, medidasNecessarias, categoria } = req.body;

    // Validar nome
    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({
        message: 'Nome do produto deve ter pelo menos 3 caracteres'
      });
    }

    // Validar descrição
    if (!descricao || descricao.trim().length < 10) {
      return res.status(400).json({
        message: 'Descrição deve ter pelo menos 10 caracteres'
      });
    }

    // Validar preço base
    if (typeof precoBase !== 'number' || precoBase <= 0) {
      return res.status(400).json({
        message: 'Preço base deve ser um número positivo'
      });
    }

    // Validar categoria
    const categoriasValidas = ['blusas', 'saias', 'shorts', 'biquinis'];
    if (!categoria || !categoriasValidas.includes(categoria.toLowerCase())) {
      return res.status(400).json({
        message: 'Categoria inválida',
        categoriasValidas
      });
    }

    // Validar medidas necessárias
    if (!Array.isArray(medidasNecessarias) || medidasNecessarias.length === 0) {
      return res.status(400).json({
        message: 'Deve especificar pelo menos uma medida necessária'
      });
    }

    for (const medida of medidasNecessarias) {
      if (!medida.nome || !medida.descricao) {
        return res.status(400).json({
          message: 'Cada medida deve ter nome e descrição'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Erro na validação do produto:', error);
    res.status(500).json({ message: 'Erro interno na validação do produto' });
  }
};

module.exports = {
  validateMeasurements,
  validateProduct
}; 