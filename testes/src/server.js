const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./config/swagger');

const salaRoutes = require('./routes/salaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const disponibilidadeRoutes = require('./routes/disponibilidadeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Gerenciamento de Reservas de Salas - UNIFACISA',
    versao: '1.0.0',
    documentacao: '/api-docs',
    endpoints: {
      salas: '/salas',
      usuarios: '/usuarios',
      reservas: '/reservas',
      disponibilidade: '/salas/disponiveis',
    },
  });
});

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API UNIFACISA - Documentação',
  })
);

app.use('/salas/disponiveis', disponibilidadeRoutes);
app.use('/salas', salaRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/reservas', reservaRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🏫 API de Gerenciamento de Reservas de Salas - UNIFACISA    ║
║                                                                ║
║   Servidor rodando na porta ${PORT}                              ║
║                                                                ║
║   📚 Documentação: http://localhost:${PORT}/api-docs              ║
║   🌐 API: http://localhost:${PORT}                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
  });
}

module.exports = app;
