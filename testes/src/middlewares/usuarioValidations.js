/**
 * Validações para Usuários
 */

const { body } = require('express-validator');

const usuarioValidations = {
  criar: [
    body('nome').notEmpty().withMessage('Nome é obrigatório').isString().withMessage('Nome deve ser uma string').trim(),
    body('email')
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
  ],

  atualizar: [
    body('nome').optional().isString().withMessage('Nome deve ser uma string').trim(),
    body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  ],
};

module.exports = usuarioValidations;
