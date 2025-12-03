const request = require('supertest');
const app = require('../../src/server');
const SalaModel = require('../../src/models/Sala');

describe('9.1 CADASTRO DE SALAS', () => {
  beforeEach(() => {
    SalaModel.resetar();
  });

  describe('CT001 - Cadastrar sala com sucesso', () => {
    it('deve criar uma sala e retornar status 201', async () => {
      const novaSala = {
        nome: 'Sala 101',
        tipo: 'Aula',
        capacidade: 40,
        status: 'ativa',
      };

      const response = await request(app).post('/salas').send(novaSala).expect(201);

      expect(response.body).toHaveProperty('sala');
      expect(response.body.sala).toHaveProperty('id');
      expect(response.body.sala.nome).toBe('Sala 101');
      expect(response.body.sala.tipo).toBe('Aula');
      expect(response.body.sala.capacidade).toBe(40);
      expect(response.body.sala.status).toBe('ativa');
    });
  });

  describe('CT002 - Impedir criação de sala com nome duplicado', () => {
    it('deve retornar erro 409 ao tentar criar sala com nome duplicado', async () => {
      await request(app).post('/salas').send({
        nome: 'Sala 101',
        tipo: 'Aula',
        capacidade: 40,
        status: 'ativa',
      });

      const response = await request(app)
        .post('/salas')
        .send({
          nome: 'Sala 101',
          tipo: 'Laboratório',
          capacidade: 25,
          status: 'ativa',
        })
        .expect(409);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('Já existe');
    });
  });

  describe('CT003 - Listar todas as salas cadastradas', () => {
    it('deve retornar lista de salas com status 200', async () => {
      await request(app).post('/salas').send({
        nome: 'Sala 101',
        tipo: 'Aula',
        capacidade: 40,
        status: 'ativa',
      });

      await request(app).post('/salas').send({
        nome: 'Sala 102',
        tipo: 'Laboratório',
        capacidade: 30,
        status: 'ativa',
      });

      const response = await request(app).get('/salas').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('nome');
      expect(response.body[0]).toHaveProperty('tipo');
      expect(response.body[0]).toHaveProperty('capacidade');
      expect(response.body[0]).toHaveProperty('status');
    });
  });

  describe('CT004 - Consultar sala por ID existente', () => {
    it('deve retornar os dados da sala com status 200', async () => {
      const createResponse = await request(app).post('/salas').send({
        nome: 'Sala 101',
        tipo: 'Aula',
        capacidade: 40,
        status: 'ativa',
      });

      const salaId = createResponse.body.sala.id;

      const response = await request(app).get(`/salas/${salaId}`).expect(200);

      expect(response.body).toHaveProperty('id', salaId);
      expect(response.body).toHaveProperty('nome', 'Sala 101');
      expect(response.body).toHaveProperty('tipo', 'Aula');
      expect(response.body).toHaveProperty('capacidade', 40);
      expect(response.body).toHaveProperty('status', 'ativa');
    });
  });

  describe('CT005 - Consultar sala por ID inexistente', () => {
    it('deve retornar erro 404 para ID inexistente', async () => {
      const response = await request(app).get('/salas/999').expect(404);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('não encontrada');
    });
  });

  describe('CT006 - Atualizar informações de uma sala existente', () => {
    it('deve atualizar a sala e retornar status 200', async () => {
      const createResponse = await request(app).post('/salas').send({
        nome: 'Sala 101',
        tipo: 'Aula',
        capacidade: 40,
        status: 'ativa',
      });

      const salaId = createResponse.body.sala.id;

      const response = await request(app)
        .put(`/salas/${salaId}`)
        .send({
          tipo: 'Laboratório',
          capacidade: 35,
        })
        .expect(200);

      expect(response.body.sala).toHaveProperty('id', salaId);
      expect(response.body.sala).toHaveProperty('nome', 'Sala 101');
      expect(response.body.sala).toHaveProperty('tipo', 'Laboratório');
      expect(response.body.sala).toHaveProperty('capacidade', 35);
      expect(response.body.sala).toHaveProperty('status', 'ativa');
    });
  });

  describe('CT007 - Impedir atualização de sala com nome duplicado', () => {
    it('deve retornar erro 409 ao atualizar com nome já existente', async () => {
      await request(app).post('/salas').send({
        nome: 'Sala 101',
        tipo: 'Aula',
        capacidade: 40,
        status: 'ativa',
      });

      const createResponse = await request(app).post('/salas').send({
        nome: 'Sala 102',
        tipo: 'Laboratório',
        capacidade: 30,
        status: 'ativa',
      });

      const sala2Id = createResponse.body.sala.id;

      const response = await request(app).put(`/salas/${sala2Id}`).send({ nome: 'Sala 101' }).expect(409);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('Já existe');
    });
  });

  describe('CT008 - Remover sala existente', () => {
    it('deve remover a sala e retornar status 200', async () => {
      const createResponse = await request(app).post('/salas').send({
        nome: 'Sala 103',
        tipo: 'Aula',
        capacidade: 30,
        status: 'ativa',
      });

      const salaId = createResponse.body.sala.id;

      await request(app).delete(`/salas/${salaId}`).expect(200);

      await request(app).get(`/salas/${salaId}`).expect(404);
    });
  });

  describe('CT009 - Remover sala inexistente', () => {
    it('deve retornar erro 404 ao tentar remover sala inexistente', async () => {
      const response = await request(app).delete('/salas/999').expect(404);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('não encontrada');
    });
  });

  describe('CT010 - Criar sala com status inativa', () => {
    it('deve criar sala inativa com status 201', async () => {
      const response = await request(app)
        .post('/salas')
        .send({
          nome: 'Sala Reunião 01',
          tipo: 'Reunião',
          capacidade: 10,
          status: 'inativa',
        })
        .expect(201);

      expect(response.body.sala).toHaveProperty('status', 'inativa');
      expect(response.body.sala).toHaveProperty('nome', 'Sala Reunião 01');
    });
  });

  describe('CT011 - Verificar que sala inativa não pode ser reservada', () => {
    it('deve retornar erro 400 ao tentar reservar sala inativa', async () => {
      const UsuarioModel = require('../../src/models/Usuario');
      const ReservaModel = require('../../src/models/Reserva');

      UsuarioModel.resetar();
      ReservaModel.resetar();

      const usuario = UsuarioModel.criar('Prof. João', 'joao@unifacisa.edu.br');

      const createSalaResponse = await request(app).post('/salas').send({
        nome: 'Sala Reunião 01',
        tipo: 'Reunião',
        capacidade: 10,
        status: 'inativa',
      });

      const salaId = createSalaResponse.body.sala.id;

      const response = await request(app)
        .post('/reservas')
        .send({
          usuario_id: usuario.id,
          sala_id: salaId,
          data: '2025-12-15',
          hora_inicio: '10:00',
          hora_fim: '11:00',
          motivo: 'Teste',
        })
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('inativa');
    });
  });

  describe('CT012 - Criar sala com campo obrigatório ausente', () => {
    it('deve retornar erro 400 quando nome estiver ausente', async () => {
      const response = await request(app)
        .post('/salas')
        .send({
          tipo: 'Laboratório',
          capacidade: 25,
          status: 'ativa',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      const nomeError = response.body.errors.find((e) => e.path === 'nome');
      expect(nomeError).toBeDefined();
    });
  });

  describe('CT013 - Criar sala com capacidade inválida', () => {
    it('deve retornar erro 400 quando capacidade for zero', async () => {
      const response = await request(app)
        .post('/salas')
        .send({
          nome: 'Sala Teste',
          tipo: 'Aula',
          capacidade: 0,
          status: 'ativa',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      const capacidadeError = response.body.errors.find((e) => e.path === 'capacidade');
      expect(capacidadeError).toBeDefined();
      expect(capacidadeError.msg).toContain('maior');
    });
  });
});
