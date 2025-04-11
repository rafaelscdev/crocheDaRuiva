# Crochê da Ruiva - API

API para a loja online de peças em crochê personalizadas.

## 🚀 Tecnologias

- Node.js
- Express
- MongoDB Atlas
- JWT para autenticação
- Nodemailer para notificações

## 📋 Funcionalidades

### Usuários
- Registro e autenticação de clientes
- Área administrativa protegida
- Gerenciamento de perfil

### Produtos
- Catálogo de produtos por categoria
- Medidas personalizadas por produto
- Controle de disponibilidade

### Pedidos
- Criação de pedidos com medidas personalizadas
- Acompanhamento de status
- Histórico de alterações
- Numeração sequencial automática

## 🛠 Instalação

1. Clone o repositório
```bash
git clone https://github.com/rafaelscdev/crocheDaRuiva.git
cd crocheDaRuiva
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor
```bash
npm run dev
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```env
PORT=3000
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=seu_host_smtp
EMAIL_PORT=587
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha
```

## 📝 Documentação da API

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário

### Produtos
- `GET /api/products` - Lista todos os produtos
- `GET /api/products/categoria/:categoria` - Lista produtos por categoria
- `POST /api/products` - Cria novo produto (admin)
- `PUT /api/products/:id` - Atualiza produto (admin)
- `DELETE /api/products/:id` - Remove produto (admin)

### Pedidos
- `POST /api/orders` - Cria novo pedido
- `GET /api/orders/meus-pedidos` - Lista pedidos do cliente
- `GET /api/orders` - Lista todos os pedidos (admin)
- `PATCH /api/orders/:id/status` - Atualiza status do pedido (admin)

## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 