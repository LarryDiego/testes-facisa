/**
 * Rotas de Disponibilidade
 */

const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reservaController');
const reservaValidations = require('../middlewares/reservaValidations');

/**
 * @swagger
 * tags:
 *   name: Disponibilidade
 *   description: Consulta de disponibilidade de salas
 */

/**
 * @swagger
 * /salas/disponiveis:
 *   get:
 *     summary: Buscar salas disponíveis em um período
 *     tags: [Disponibilidade]
 *     parameters:
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-12-15"
 *         description: Data da consulta (YYYY-MM-DD)
 *       - in: query
 *         name: hora_inicio
 *         required: true
 *         schema:
 *           type: string
 *         example: "14:00"
 *         description: Hora de início (HH:MM)
 *       - in: query
 *         name: hora_fim
 *         required: true
 *         schema:
 *           type: string
 *         example: "16:00"
 *         description: Hora de término (HH:MM)
 *     responses:
 *       200:
 *         description: Lista de salas disponíveis
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/', reservaValidations.buscarDisponiveis, ReservaController.buscarSalasDisponiveis);

module.exports = router;
