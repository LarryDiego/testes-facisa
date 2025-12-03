const express = require('express');
const router = express.Router();
const SalaController = require('../controllers/salaController');
const salaValidations = require('../middlewares/salaValidations');

/**
 * @swagger
 * tags:
 *   name: Salas
 *   description: Gerenciamento de salas
 */

/**
 * @swagger
 * /salas:
 *   post:
 *     summary: Criar uma nova sala
 *     tags: [Salas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - tipo
 *               - capacidade
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da sala (deve ser único)
 *               tipo:
 *                 type: string
 *                 description: Tipo da sala (ex. laboratório, auditório, sala de aula)
 *               capacidade:
 *                 type: integer
 *                 minimum: 1
 *                 description: Capacidade da sala
 *               status:
 *                 type: string
 *                 enum: [ativa, inativa]
 *                 default: ativa
 *                 description: Status da sala
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Já existe uma sala com esse nome
 */
router.post('/', salaValidations.criar, SalaController.criar);

/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Listar todas as salas
 *     tags: [Salas]
 *     responses:
 *       200:
 *         description: Lista de salas
 */
router.get('/', SalaController.listarTodas);

/**
 * @swagger
 * /salas/{id}:
 *   get:
 *     summary: Buscar sala por ID
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 */
router.get('/:id', SalaController.buscarPorId);

/**
 * @swagger
 * /salas/{id}:
 *   put:
 *     summary: Atualizar sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               tipo:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ativa, inativa]
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *       404:
 *         description: Sala não encontrada
 *       409:
 *         description: Já existe uma sala com esse nome
 */
router.put('/:id', salaValidations.atualizar, SalaController.atualizar);

/**
 * @swagger
 * /salas/{id}:
 *   delete:
 *     summary: Remover sala
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Sala removida com sucesso
 *       404:
 *         description: Sala não encontrada
 */
router.delete('/:id', SalaController.deletar);

module.exports = router;
