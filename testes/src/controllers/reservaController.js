const ReservaModel = require('../models/Reserva');
const { validationResult } = require('express-validator');

const ReservaController = {
  criar: (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { usuario_id, sala_id, data, hora_inicio, hora_fim, motivo } = req.body;
      const novaReserva = ReservaModel.criar(usuario_id, sala_id, data, hora_inicio, hora_fim, motivo);

      return res.status(201).json({
        mensagem: 'Reserva criada com sucesso',
        reserva: novaReserva,
      });
    } catch (error) {
      if (error.message === 'Usuário não encontrado' || error.message === 'Sala não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Já existe uma reserva neste horário para esta sala') {
        return res.status(409).json({ erro: error.message });
      }
      if (
        error.message === 'Sala inativa não pode ser reservada' ||
        error.message === 'Hora de término deve ser maior que hora de início' ||
        error.message === 'Não é possível criar reservas no passado'
      ) {
        return res.status(400).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  listarTodas: (req, res) => {
    try {
      const { sala_id, data, usuario_id } = req.query;

      if (sala_id && data) {
        const reservas = ReservaModel.buscarPorSalaEData(sala_id, data);
        return res.status(200).json(reservas);
      }

      if (usuario_id) {
        const reservas = ReservaModel.buscarPorUsuario(usuario_id);
        return res.status(200).json(reservas);
      }

      const reservas = ReservaModel.listarTodas();
      return res.status(200).json(reservas);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  buscarPorId: (req, res) => {
    try {
      const { id } = req.params;
      const reserva = ReservaModel.buscarPorId(id);

      if (!reserva) {
        return res.status(404).json({ erro: 'Reserva não encontrada' });
      }

      return res.status(200).json(reserva);
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
      const reservaAtualizada = ReservaModel.atualizar(id, req.body);

      return res.status(200).json({
        mensagem: 'Reserva atualizada com sucesso',
        reserva: reservaAtualizada,
      });
    } catch (error) {
      if (error.message === 'Reserva não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Já existe uma reserva neste horário para esta sala') {
        return res.status(409).json({ erro: error.message });
      }
      if (error.message === 'Hora de término deve ser maior que hora de início') {
        return res.status(400).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  deletar: (req, res) => {
    try {
      const { id } = req.params;
      const reservaCancelada = ReservaModel.deletar(id);

      return res.status(200).json({
        mensagem: 'Reserva cancelada com sucesso',
        reserva: reservaCancelada,
      });
    } catch (error) {
      if (error.message === 'Reserva não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Não é possível cancelar reserva após o horário de início') {
        return res.status(400).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  buscarSalasDisponiveis: (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { data, hora_inicio, hora_fim } = req.query;

      if (hora_fim <= hora_inicio) {
        return res.status(400).json({ erro: 'Hora de término deve ser maior que hora de início' });
      }

      const salasDisponiveis = ReservaModel.buscarSalasDisponiveis(data, hora_inicio, hora_fim);

      return res.status(200).json({
        data,
        hora_inicio,
        hora_fim,
        salas_disponiveis: salasDisponiveis,
      });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },
};

module.exports = ReservaController;
