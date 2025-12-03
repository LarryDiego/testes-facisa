const { body, query } = require('express-validator');

const reservaValidations = {
  criar: [
    body('usuario_id')
      .notEmpty()
      .withMessage('ID do usuário é obrigatório')
      .isInt({ min: 1 })
      .withMessage('ID do usuário deve ser um número inteiro válido'),
    body('sala_id')
      .notEmpty()
      .withMessage('ID da sala é obrigatório')
      .isInt({ min: 1 })
      .withMessage('ID da sala deve ser um número inteiro válido'),
    body('data')
      .notEmpty()
      .withMessage('Data é obrigatória')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Data deve estar no formato YYYY-MM-DD'),
    body('hora_inicio')
      .notEmpty()
      .withMessage('Hora de início é obrigatória')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora de início deve estar no formato HH:MM'),
    body('hora_fim')
      .notEmpty()
      .withMessage('Hora de término é obrigatória')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora de término deve estar no formato HH:MM'),
    body('motivo')
      .notEmpty()
      .withMessage('Motivo é obrigatório')
      .isString()
      .withMessage('Motivo deve ser uma string')
      .trim(),
  ],

  atualizar: [
    body('data')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Data deve estar no formato YYYY-MM-DD'),
    body('hora_inicio')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora de início deve estar no formato HH:MM'),
    body('hora_fim')
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora de término deve estar no formato HH:MM'),
    body('motivo').optional().isString().withMessage('Motivo deve ser uma string').trim(),
  ],

  buscarDisponiveis: [
    query('data')
      .notEmpty()
      .withMessage('Data é obrigatória')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Data deve estar no formato YYYY-MM-DD'),
    query('hora_inicio')
      .notEmpty()
      .withMessage('Hora de início é obrigatória')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora de início deve estar no formato HH:MM'),
    query('hora_fim')
      .notEmpty()
      .withMessage('Hora de término é obrigatória')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Hora de término deve estar no formato HH:MM'),
  ],
};

module.exports = reservaValidations;
