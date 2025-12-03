const SalaModel = require('../models/Sala');
const { validationResult } = require('express-validator');

const SalaController = {
  criar: (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nome, tipo, capacidade, status } = req.body;
      const novaSala = SalaModel.criar(nome, tipo, capacidade, status);

      return res.status(201).json({
        mensagem: 'Sala criada com sucesso',
        sala: novaSala,
      });
    } catch (error) {
      if (error.message === 'Já existe uma sala com esse nome') {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  listarTodas: (req, res) => {
    try {
      const salas = SalaModel.listarTodas();
      return res.status(200).json(salas);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  buscarPorId: (req, res) => {
    try {
      const { id } = req.params;
      const sala = SalaModel.buscarPorId(id);

      if (!sala) {
        return res.status(404).json({ erro: 'Sala não encontrada' });
      }

      return res.status(200).json(sala);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  atualizar: (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const salaAtualizada = SalaModel.atualizar(id, req.body);

      return res.status(200).json({
        mensagem: 'Sala atualizada com sucesso',
        sala: salaAtualizada,
      });
    } catch (error) {
      if (error.message === 'Sala não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Já existe uma sala com esse nome') {
        return res.status(409).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  deletar: (req, res) => {
    try {
      const { id } = req.params;
      const salaDeletada = SalaModel.deletar(id);

      return res.status(200).json({
        mensagem: 'Sala removida com sucesso',
        sala: salaDeletada,
      });
    } catch (error) {
      if (error.message === 'Sala não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },
};

module.exports = SalaController;
