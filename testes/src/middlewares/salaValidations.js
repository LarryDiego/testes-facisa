/**
 * Validações para Salas
 */

const { body } = require('express-validator');

const salaValidations = {
  criar: [
    body('nome').notEmpty().withMessage('Nome é obrigatório').isString().withMessage('Nome deve ser uma string').trim(),
    body('tipo').notEmpty().withMessage('Tipo é obrigatório').isString().withMessage('Tipo deve ser uma string').trim(),
    body('capacidade')
      .notEmpty()
      .withMessage('Capacidade é obrigatória')
      .isInt({ min: 1 })
      .withMessage('Capacidade deve ser um número inteiro maior que 0'),
    body('status').optional().isIn(['ativa', 'inativa']).withMessage('Status deve ser "ativa" ou "inativa"'),
  ],

  atualizar: [
    body('nome').optional().isString().withMessage('Nome deve ser uma string').trim(),
    body('tipo').optional().isString().withMessage('Tipo deve ser uma string').trim(),
    body('capacidade').optional().isInt({ min: 1 }).withMessage('Capacidade deve ser um número inteiro maior que 0'),
    body('status').optional().isIn(['ativa', 'inativa']).withMessage('Status deve ser "ativa" ou "inativa"'),
  ],
};

module.exports = salaValidations;
