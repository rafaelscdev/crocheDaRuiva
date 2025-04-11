# Guia de Testes - API Crochê da Ruiva

## Preparação
1. Baixe e instale o Postman: https://www.postman.com/downloads/
2. Abra o Postman
3. O servidor deve estar rodando na porta 3000

## Sequência de Testes

### 1. Criar uma conta de administrador
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "nome": "Admin Ruiva",
    "email": "crochedaruiva@gmail.com",
    "senha": "147289",
    "telefone": "11999999999",
    "role": "admin",
    "endereco": {
        "rua": "Rua do Crochê",
        "numero": "123",
        "bairro": "Centro",
        "cidade": "São Paulo",
        "estado": "SP",
        "cep": "01001-000"
    }
}
```

### 2. Fazer login como administrador
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "crochedaruiva@gmail.com",
    "senha": "147289"
}
```
⚠️ Guarde o token recebido na resposta!

### 3. Cadastrar um produto (precisa do token)
```
POST http://localhost:3000/api/products
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
    "nome": "Saia Midi Floral",
    "descricao": "Saia midi em crochê com detalhes florais, perfeita para o verão",
    "categoria": "saias",
    "precoBase": 180.00,
    "imagens": ["saia1.jpg"],
    "medidasNecessarias": [
        {
            "nome": "Cintura",
            "descricao": "Medida ao redor da cintura"
        },
        {
            "nome": "Quadril",
            "descricao": "Medida ao redor do quadril"
        },
        {
            "nome": "Comprimento",
            "descricao": "Da cintura até o comprimento desejado"
        }
    ],
    "tempoEstimadoProducao": 20
}
```

### 4. Listar produtos (não precisa de token)
```
GET http://localhost:3000/api/products
```

### 5. Criar uma conta de cliente
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "nome": "Maria Cliente",
    "email": "maria@email.com",
    "senha": "senha123",
    "telefone": "11988888888",
    "endereco": {
        "rua": "Rua das Flores",
        "numero": "456",
        "bairro": "Jardim",
        "cidade": "São Paulo",
        "estado": "SP",
        "cep": "02002-000"
    }
}
```

### 6. Fazer login como cliente
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "maria@email.com",
    "senha": "senha123"
}
```
⚠️ Guarde o token recebido na resposta!

### 7. Fazer um pedido (precisa do token do cliente)
```
POST http://localhost:3000/api/orders
Authorization: Bearer TOKEN_DO_CLIENTE
Content-Type: application/json

{
    "produto": "ID_DO_PRODUTO",
    "medidas": [
        {
            "nome": "Busto",
            "valor": 90
        },
        {
            "nome": "Comprimento",
            "valor": 60
        }
    ],
    "observacoes": "Gostaria da cor rosa"
}
```

### 8. Ver pedidos como cliente
```
GET http://localhost:3000/api/orders/meus-pedidos
Authorization: Bearer TOKEN_DO_CLIENTE
```

### 9. Ver todos os pedidos como admin
```
GET http://localhost:3000/api/orders
Authorization: Bearer TOKEN_DO_ADMIN
```

### 10. Atualizar status de um pedido (como admin)
```
PATCH http://localhost:3000/api/orders/ID_DO_PEDIDO/status
Authorization: Bearer TOKEN_DO_ADMIN
Content-Type: application/json

{
    "status": "confirmado",
    "comentario": "Pedido confirmado, iniciando produção"
}
```

## Dicas importantes:
1. Substitua "SEU_TOKEN_AQUI" pelo token recebido após o login
2. Substitua "ID_DO_PRODUTO" pelo ID real do produto criado
3. Substitua "ID_DO_PEDIDO" pelo ID real do pedido
4. Os tokens são válidos por 7 dias
5. Guarde os IDs dos produtos e pedidos para usar nos testes
6. Se receber erro 401, provavelmente o token expirou - faça login novamente

## Status possíveis para pedidos:
- pendente (padrão)
- confirmado
- em_producao
- enviado
- entregue
- cancelado 