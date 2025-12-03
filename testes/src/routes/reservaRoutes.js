/**
 * Rotas de Reservas
 */

const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reservaController');
const reservaValidations = require('../middlewares/reservaValidations');

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gerenciamento de reservas
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Criar uma nova reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - sala_id
 *               - data
 *               - hora_inicio
 *               - hora_fim
 *               - motivo
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário que faz a reserva
 *               sala_id:
 *                 type: integer
 *                 description: ID da sala a ser reservada
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-15"
 *                 description: Data da reserva (YYYY-MM-DD)
 *               hora_inicio:
 *                 type: string
 *                 example: "14:00"
 *                 description: Hora de início (HH:MM)
 *               hora_fim:
 *                 type: string
 *                 example: "16:00"
 *                 description: Hora de término (HH:MM)
 *               motivo:
 *                 type: string
 *                 description: Motivo da reserva
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Dados inválidos ou regra de negócio violada
 *       404:
 *         description: Usuário ou sala não encontrado
 *       409:
 *         description: Já existe uma reserva neste horário
 */
router.post('/', reservaValidations.criar, ReservaController.criar);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar reservas (com filtros opcionais)
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: sala_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da sala
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data (YYYY-MM-DD)
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do usuário
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get('/', ReservaController.listarTodas);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Buscar reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       404:
 *         description: Reserva não encontrada
 */
router.get('/:id', ReservaController.buscarPorId);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Atualizar reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *               hora_fim:
 *                 type: string
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso
 *       404:
 *         description: Reserva não encontrada
 *       409:
 *         description: Já existe uma reserva neste horário
 */
router.put('/:id', reservaValidations.atualizar, ReservaController.atualizar);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Cancelar reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso
 *       400:
 *         description: Não é possível cancelar após o horário de início
 *       404:
 *         description: Reserva não encontrada
 */
router.delete('/:id', ReservaController.deletar);

module.exports = router;
