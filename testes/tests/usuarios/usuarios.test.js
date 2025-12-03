/**
 * Testes de Cadastro de Usuários
 * CT014 - CT022
 */

const request = require('supertest');
const app = require('../../src/server');
const UsuarioModel = require('../../src/models/Usuario');

describe('9.2 CADASTRO DE USUÁRIOS', () => {
  beforeEach(() => {
    UsuarioModel.resetar();
  });

  describe('CT014 - Cadastrar usuário com sucesso', () => {
    it('deve criar um usuário e retornar status 201', async () => {
      const novoUsuario = {
        nome: 'João Silva',
        email: 'joao.silva@unifacisa.edu.br',
      };

      const response = await request(app).post('/usuarios').send(novoUsuario).expect(201);

      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).toHaveProperty('id');
      expect(response.body.usuario.nome).toBe('João Silva');
      expect(response.body.usuario.email).toBe('joao.silva@unifacisa.edu.br');
    });
  });

  describe('CT015 - Impedir cadastro com e-mail duplicado', () => {
    it('deve retornar erro 409 ao tentar criar usuário com email duplicado', async () => {
      await request(app).post('/usuarios').send({
        nome: 'João Silva',
        email: 'joao.silva@unifacisa.edu.br',
      });

      const response = await request(app)
        .post('/usuarios')
        .send({
          nome: 'João Silva',
          email: 'joao.silva@unifacisa.edu.br',
        })
        .expect(409);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('Já existe');
    });
  });

  describe('CT016 - Impedir cadastro com e-mail inválido', () => {
    it('deve retornar erro 400 para email inválido', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send({
          nome: 'Maria Souza',
          email: 'maria.souza@unifacisa',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      const emailError = response.body.errors.find((e) => e.path === 'email');
      expect(emailError).toBeDefined();
    });
  });

  describe('CT017 - Listar todos os usuários cadastrados', () => {
    it('deve retornar lista de usuários com status 200', async () => {
      await request(app).post('/usuarios').send({
        nome: 'João Silva',
        email: 'joao.silva@unifacisa.edu.br',
      });

      await request(app).post('/usuarios').send({
        nome: 'Maria Souza',
        email: 'maria.souza@unifacisa.edu.br',
      });

      const response = await request(app).get('/usuarios').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('nome');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  describe('CT018 - Consultar usuário por ID existente', () => {
    it('deve retornar os dados do usuário com status 200', async () => {
      const createResponse = await request(app).post('/usuarios').send({
        nome: 'João Silva',
        email: 'joao.silva@unifacisa.edu.br',
      });

      const usuarioId = createResponse.body.usuario.id;

      const response = await request(app).get(`/usuarios/${usuarioId}`).expect(200);

      expect(response.body).toHaveProperty('id', usuarioId);
      expect(response.body).toHaveProperty('nome', 'João Silva');
      expect(response.body).toHaveProperty('email', 'joao.silva@unifacisa.edu.br');
    });
  });

  describe('CT019 - Consultar usuário por ID inexistente', () => {
    it('deve retornar erro 404 para ID inexistente', async () => {
      const response = await request(app).get('/usuarios/999').expect(404);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('não encontrado');
    });
  });

  describe('CT020 - Atualizar informações de um usuário existente', () => {
    it('deve atualizar o usuário e retornar status 200', async () => {
      const createResponse = await request(app).post('/usuarios').send({
        nome: 'João Silva',
        email: 'joao.silva@unifacisa.edu.br',
      });

      const usuarioId = createResponse.body.usuario.id;

      const response = await request(app)
        .put(`/usuarios/${usuarioId}`)
        .send({
          nome: 'João Pedro',
          email: 'joao.pedro@unifacisa.edu.br',
        })
        .expect(200);

      expect(response.body.usuario).toHaveProperty('id', usuarioId);
      expect(response.body.usuario).toHaveProperty('nome', 'João Pedro');
      expect(response.body.usuario).toHaveProperty('email', 'joao.pedro@unifacisa.edu.br');
    });
  });

  describe('CT021 - Impedir atualização com e-mail duplicado', () => {
    it('deve retornar erro 409 ao atualizar com email já existente', async () => {
      await request(app).post('/usuarios').send({
        nome: 'João Silva',
        email: 'joao@unifacisa.edu.br',
      });

      const createResponse = await request(app).post('/usuarios').send({
        nome: 'Maria Souza',
        email: 'maria@unifacisa.edu.br',
      });

      const usuario2Id = createResponse.body.usuario.id;

      const response = await request(app)
        .put(`/usuarios/${usuario2Id}`)
        .send({ email: 'joao@unifacisa.edu.br' })
        .expect(409);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('Já existe');
    });
  });

  describe('CT022 - Remover usuário existente', () => {
    it('deve remover o usuário e retornar status 200', async () => {
      const createResponse = await request(app).post('/usuarios').send({
        nome: 'João Silva',
        email: 'joao.silva@unifacisa.edu.br',
      });

      const usuarioId = createResponse.body.usuario.id;

      await request(app).delete(`/usuarios/${usuarioId}`).expect(200);

      await request(app).get(`/usuarios/${usuarioId}`).expect(404);
    });
  });
});
