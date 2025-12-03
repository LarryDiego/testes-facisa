# Sistema de Gerenciamento de Reservas de Salas - UNIFACISA

## 📋 Sobre o Projeto

API REST para gerenciamento de reservas de salas da UNIFACISA, desenvolvida em Node.js com Express. O sistema permite o cadastro de salas e usuários, criação e gerenciamento de reservas, além de consulta de disponibilidade.

---

## 🔧 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 14 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (geralmente vem com o Node.js)
- **Git** - [Download aqui](https://git-scm.com/)

Para verificar se já possui instalado:

```bash
node --version
npm --version
git --version
```

### Passos de Instalação

1. **Clone o repositório:**

```bash
git clone <URL_DO_REPOSITORIO>
```

2. **Navegue até a pasta do projeto:**

```bash
cd testes
```

3. **Instale as dependências do projeto:**

```bash
npm install
```

Este comando irá instalar todas as dependências listadas no `package.json`:

- Express (framework web)
- Swagger UI Express (documentação da API)
- Express Validator (validação de dados)
- CORS (controle de acesso)
- Jest e Supertest (testes - instalados como devDependencies)

---

## ⚙️ Configuração

### Configuração Padrão

O projeto vem pré-configurado e funciona imediatamente após a instalação. As configurações padrão são:

- **Porta do servidor**: 3000
- **URL da API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs
- **Armazenamento**: Em memória (os dados são perdidos ao reiniciar o servidor)

### Personalizando Configurações (Opcional)

Se desejar alterar a porta do servidor, edite o arquivo `src/server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

---

## 🚀 Execução

### Iniciando o Servidor

**Modo produção:**

```bash
npm start
```

**Modo desenvolvimento (com auto-reload):**

```bash
npm run dev
```

### Verificando se está funcionando

Após iniciar o servidor, você deverá ver a mensagem:

```
🚀 Servidor rodando na porta 3000
📚 Documentação disponível em http://localhost:3000/api-docs
```

Acesse no navegador:

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs

### Parando o Servidor

Para parar o servidor, pressione `Ctrl + C` no terminal.

---

## 🧪 Executando os Testes

O projeto inclui 37 testes automatizados que verificam todas as funcionalidades.

**Executar todos os testes:**

```bash
npm test
```

**Executar em modo watch (reexecuta automaticamente ao modificar arquivos):**

```bash
npm run test:watch
```

**Ver relatório de cobertura:**

Após executar `npm test`, abra o arquivo:

```
coverage/lcov-report/index.html
```

---

## 📚 Usando a API

### Documentação Interativa (Swagger)

A forma mais fácil de testar a API é através da interface Swagger:

1. Inicie o servidor (`npm start`)
2. Acesse http://localhost:3000/api-docs
3. Explore os endpoints disponíveis
4. Execute requisições diretamente pelo navegador

### Endpoints Principais

| Recurso             | Método | Endpoint             | Descrição                   |
| ------------------- | ------ | -------------------- | --------------------------- |
| **Salas**           | POST   | `/salas`             | Criar nova sala             |
|                     | GET    | `/salas`             | Listar todas as salas       |
|                     | GET    | `/salas/{id}`        | Buscar sala específica      |
|                     | PUT    | `/salas/{id}`        | Atualizar sala              |
|                     | DELETE | `/salas/{id}`        | Remover sala                |
| **Usuários**        | POST   | `/usuarios`          | Criar novo usuário          |
|                     | GET    | `/usuarios`          | Listar todos os usuários    |
|                     | GET    | `/usuarios/{id}`     | Buscar usuário específico   |
|                     | PUT    | `/usuarios/{id}`     | Atualizar usuário           |
|                     | DELETE | `/usuarios/{id}`     | Remover usuário             |
| **Reservas**        | POST   | `/reservas`          | Criar nova reserva          |
|                     | GET    | `/reservas`          | Listar todas as reservas    |
|                     | GET    | `/reservas/{id}`     | Buscar reserva específica   |
|                     | PUT    | `/reservas/{id}`     | Atualizar reserva           |
|                     | DELETE | `/reservas/{id}`     | Cancelar reserva            |
| **Disponibilidade** | GET    | `/salas/disponiveis` | Consultar salas disponíveis |

### Exemplos de Requisições

**1. Criar uma sala:**

```bash
curl -X POST http://localhost:3000/salas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Lab 01",
    "tipo": "Laboratório de Informática",
    "capacidade": 40,
    "status": "ativa"
  }'
```

**2. Criar um usuário:**

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@unifacisa.edu.br"
  }'
```

**3. Criar uma reserva:**

```bash
curl -X POST http://localhost:3000/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "sala_id": 1,
    "data": "2024-12-15",
    "hora_inicio": "14:00",
    "hora_fim": "16:00",
    "motivo": "Aula de Programação"
  }'
```

**4. Consultar salas disponíveis:**

```bash
curl "http://localhost:3000/salas/disponiveis?data=2024-12-15&hora_inicio=14:00&hora_fim=16:00"
```

---

## 🗂️ Estrutura do Projeto

```
testes/
├── src/
│   ├── config/
│   │   └── swagger.js              # Configuração do Swagger
│   ├── controllers/
│   │   ├── salaController.js       # Lógica de salas
│   │   ├── usuarioController.js    # Lógica de usuários
│   │   └── reservaController.js    # Lógica de reservas
│   ├── middlewares/
│   │   ├── salaValidations.js      # Validações de sala
│   │   ├── usuarioValidations.js   # Validações de usuário
│   │   └── reservaValidations.js   # Validações de reserva
│   ├── models/
│   │   ├── Sala.js                 # Modelo de Sala
│   │   ├── Usuario.js              # Modelo de Usuário
│   │   └── Reserva.js              # Modelo de Reserva
│   ├── routes/
│   │   ├── salaRoutes.js           # Rotas de salas
│   │   ├── usuarioRoutes.js        # Rotas de usuários
│   │   ├── reservaRoutes.js        # Rotas de reservas
│   │   └── disponibilidadeRoutes.js # Rotas de disponibilidade
│   └── server.js                   # Servidor principal
├── tests/                          # Testes automatizados
│   ├── salas/
│   ├── usuarios/
│   ├── reservas/
│   └── disponibilidade/
├── package.json                    # Dependências e scripts
└── README.md                       # Este arquivo
```

---

## 🚀 Tecnologias Utilizadas

- **Node.js** - Plataforma JavaScript
- **Express** - Framework web
- **Swagger/OpenAPI** - Documentação da API
- **Express Validator** - Validação de dados
- **CORS** - Controle de acesso
- **Jest** - Framework de testes
- **Supertest** - Testes de API HTTP

---

## ⚙️ Regras de Negócio Implementadas

### Salas

- ✅ Nomes de salas devem ser únicos
- ✅ Capacidade deve ser maior que zero
- ✅ Salas inativas não podem ser reservadas

### Usuários

- ✅ E-mails devem ser únicos e válidos
- ✅ Nome é obrigatório

### Reservas

- ✅ Não é permitido criar reservas sobrepostas na mesma sala
- ✅ `hora_fim` deve ser maior que `hora_inicio`
- ✅ Reservas no passado não podem ser criadas
- ✅ Apenas usuários e salas cadastrados podem fazer reservas
- ✅ Cancelamentos só podem ocorrer antes do horário de início

---

## 🔧 Solução de Problemas

### Erro: "Port 3000 is already in use"

A porta 3000 já está sendo usada por outro processo.

**Solução 1**: Pare o processo que está usando a porta ou reinicie o computador.

**Solução 2**: Altere a porta no arquivo `src/server.js`:

```javascript
const PORT = process.env.PORT || 3001; // Use outra porta
```

### Erro: "Cannot find module"

As dependências não foram instaladas corretamente.

**Solução**: Execute novamente:

```bash
npm install
```

### Dados foram perdidos após reiniciar

Isso é esperado! Os dados são armazenados **em memória**. Quando o servidor é reiniciado, todos os dados são perdidos. Para manter os dados, seria necessário integrar um banco de dados real (MongoDB, PostgreSQL, etc.).

---

## 📖 Documentação Adicional

- **Swagger UI**: http://localhost:3000/api-docs - Documentação interativa da API

---

## 👨‍💻 Autor

Desenvolvido para UNIFACISA - Centro Universitário
