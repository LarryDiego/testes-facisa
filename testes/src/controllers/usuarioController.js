const UsuarioModel = require('../models/Usuario');
const { validationResult } = require('express-validator');

const UsuarioController = {
  criar: (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nome, email } = req.body;
      const novoUsuario = UsuarioModel.criar(nome, email);

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        usuario: novoUsuario,
      });
    } catch (error) {
      if (error.message === 'Já existe um usuário com esse email') {
        return res.status(409).json({ erro: error.message });
      }
      if (error.message === 'Email inválido') {
        return res.status(400).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  listarTodos: (req, res) => {
    try {
      const usuarios = UsuarioModel.listarTodos();
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  buscarPorId: (req, res) => {
    try {
      const { id } = req.params;
      const usuario = UsuarioModel.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      return res.status(200).json(usuario);
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
      const usuarioAtualizado = UsuarioModel.atualizar(id, req.body);

      return res.status(200).json({
        mensagem: 'Usuário atualizado com sucesso',
        usuario: usuarioAtualizado,
      });
    } catch (error) {
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Já existe um usuário com esse email') {
        return res.status(409).json({ erro: error.message });
      }
      if (error.message === 'Email inválido') {
        return res.status(400).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },

  deletar: (req, res) => {
    try {
      const { id } = req.params;
      const usuarioDeletado = UsuarioModel.deletar(id);

      return res.status(200).json({
        mensagem: 'Usuário removido com sucesso',
        usuario: usuarioDeletado,
      });
    } catch (error) {
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  },
};

module.exports = UsuarioController;
