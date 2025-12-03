const request = require('supertest');
const app = require('../../src/server');
const SalaModel = require('../../src/models/Sala');
const UsuarioModel = require('../../src/models/Usuario');
const ReservaModel = require('../../src/models/Reserva');

describe('9.3 GERENCIAMENTO DE RESERVAS', () => {
  let usuario1, usuario2, sala1, sala2;

  beforeEach(() => {
    SalaModel.resetar();
    UsuarioModel.resetar();
    ReservaModel.resetar();

    usuario1 = UsuarioModel.criar('João Silva', 'joao@unifacisa.edu.br');
    usuario2 = UsuarioModel.criar('Maria Souza', 'maria@unifacisa.edu.br');
    sala1 = SalaModel.criar('Sala 101', 'Aula', 40, 'ativa');
    sala2 = SalaModel.criar('Lab 01', 'Laboratório', 30, 'ativa');
  });

  describe('CT023 - Criar reserva com sucesso', () => {
    it('deve criar uma reserva e retornar status 201', async () => {
      const novaReserva = {
        usuario_id: usuario1.id,
        sala_id: sala2.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Reunião de planejamento',
      };

      const response = await request(app).post('/reservas').send(novaReserva).expect(201);

      expect(response.body).toHaveProperty('reserva');
      expect(response.body.reserva).toHaveProperty('id');
      expect(response.body.reserva.usuario_id).toBe(usuario1.id);
      expect(response.body.reserva.sala_id).toBe(sala2.id);
      expect(response.body.reserva.data).toBe('2025-12-10');
      expect(response.body.reserva.hora_inicio).toBe('09:00');
      expect(response.body.reserva.hora_fim).toBe('10:00');
      expect(response.body.reserva.motivo).toBe('Reunião de planejamento');
    });
  });

  describe('CT024 - Impedir criação de reserva com horários sobrepostos', () => {
    it('deve retornar erro 409 ao tentar criar reserva sobreposta', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala2.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Primeira reunião',
      });

      const response = await request(app)
        .post('/reservas')
        .send({
          usuario_id: usuario2.id,
          sala_id: sala2.id,
          data: '2025-12-10',
          hora_inicio: '09:30',
          hora_fim: '10:30',
          motivo: 'Treinamento',
        })
        .expect(409);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('Já existe');
    });
  });

  describe('CT025 - Impedir criação de reserva com hora_fim menor que hora_inicio', () => {
    it('deve retornar erro 400 quando hora_fim for menor que hora_inicio', async () => {
      const response = await request(app)
        .post('/reservas')
        .send({
          usuario_id: usuario2.id,
          sala_id: sala1.id,
          data: '2025-12-11',
          hora_inicio: '15:00',
          hora_fim: '14:00',
          motivo: 'Teste inválido',
        })
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('maior');
    });
  });

  describe('CT026 - Impedir criação de reserva em data passada', () => {
    it('deve retornar erro 400 ao tentar criar reserva no passado', async () => {
      const response = await request(app)
        .post('/reservas')
        .send({
          usuario_id: usuario1.id,
          sala_id: sala2.id,
          data: '2024-01-10',
          hora_inicio: '09:00',
          hora_fim: '10:00',
          motivo: 'Teste de data antiga',
        })
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('passado');
    });
  });

  describe('CT027 - Listar todas as reservas cadastradas', () => {
    it('deve retornar lista de reservas com status 200', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Reunião 1',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario2.id,
        sala_id: sala2.id,
        data: '2025-12-11',
        hora_inicio: '14:00',
        hora_fim: '15:00',
        motivo: 'Reunião 2',
      });

      const response = await request(app).get('/reservas').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('usuario_id');
      expect(response.body[0]).toHaveProperty('sala_id');
      expect(response.body[0]).toHaveProperty('data');
      expect(response.body[0]).toHaveProperty('hora_inicio');
      expect(response.body[0]).toHaveProperty('hora_fim');
      expect(response.body[0]).toHaveProperty('motivo');
    });
  });

  describe('CT028 - Consultar reserva por ID existente', () => {
    it('deve retornar os dados da reserva com status 200', async () => {
      const createResponse = await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Reunião',
      });

      const reservaId = createResponse.body.reserva.id;

      const response = await request(app).get(`/reservas/${reservaId}`).expect(200);

      expect(response.body).toHaveProperty('id', reservaId);
      expect(response.body).toHaveProperty('usuario_id', usuario1.id);
      expect(response.body).toHaveProperty('sala_id', sala1.id);
    });
  });

  describe('CT029 - Consultar reservas de uma sala em uma data específica', () => {
    it('deve retornar reservas filtradas por sala e data com status 200', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala2.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Reunião 1',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario2.id,
        sala_id: sala2.id,
        data: '2025-12-10',
        hora_inicio: '14:00',
        hora_fim: '15:00',
        motivo: 'Reunião 2',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reunião 3',
      });

      const response = await request(app).get(`/reservas?sala_id=${sala2.id}&data=2025-12-10`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].sala_id).toBe(sala2.id);
      expect(response.body[0].data).toBe('2025-12-10');
    });
  });

  describe('CT030 - Consultar reservas de um usuário específico', () => {
    it('deve retornar reservas filtradas por usuário com status 200', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Reunião 1',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala2.id,
        data: '2025-12-11',
        hora_inicio: '14:00',
        hora_fim: '15:00',
        motivo: 'Reunião 2',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario2.id,
        sala_id: sala1.id,
        data: '2025-12-12',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reunião 3',
      });

      const response = await request(app).get(`/reservas?usuario_id=${usuario1.id}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].usuario_id).toBe(usuario1.id);
      expect(response.body[1].usuario_id).toBe(usuario1.id);
    });
  });

  describe('CT031 - Atualizar informações de uma reserva existente', () => {
    it('deve atualizar a reserva e retornar status 200', async () => {
      const createResponse = await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Reunião original',
      });

      const reservaId = createResponse.body.reserva.id;

      const response = await request(app)
        .put(`/reservas/${reservaId}`)
        .send({
          hora_inicio: '14:00',
          hora_fim: '15:30',
          motivo: 'Ajuste de horário',
        })
        .expect(200);

      expect(response.body.reserva).toHaveProperty('id', reservaId);
      expect(response.body.reserva).toHaveProperty('hora_inicio', '14:00');
      expect(response.body.reserva).toHaveProperty('hora_fim', '15:30');
      expect(response.body.reserva).toHaveProperty('motivo', 'Ajuste de horário');
    });
  });

  describe('CT032 - Impedir atualização que gere sobreposição de horário', () => {
    it('deve retornar erro 409 ao atualizar e causar sobreposição', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '14:00',
        hora_fim: '15:00',
        motivo: 'Reunião 1',
      });

      const createResponse = await request(app).post('/reservas').send({
        usuario_id: usuario2.id,
        sala_id: sala1.id,
        data: '2025-12-10',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reunião 2',
      });

      const reserva2Id = createResponse.body.reserva.id;

      const response = await request(app)
        .put(`/reservas/${reserva2Id}`)
        .send({
          hora_inicio: '14:00',
          hora_fim: '15:00',
        })
        .expect(409);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('Já existe');
    });
  });

  describe('CT033 - Cancelar reserva antes do horário de início', () => {
    it('deve cancelar a reserva e retornar status 200', async () => {
      const createResponse = await request(app).post('/reservas').send({
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: '2025-12-25',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reunião futura',
      });

      const reservaId = createResponse.body.reserva.id;

      await request(app).delete(`/reservas/${reservaId}`).expect(200);

      await request(app).get(`/reservas/${reservaId}`).expect(404);
    });
  });

  describe('CT034 - Impedir cancelamento de reserva após horário de início', () => {
    it('deve retornar erro 400 ao tentar cancelar reserva passada', async () => {
      const hoje = new Date();
      const dataOntem = new Date(hoje);
      dataOntem.setDate(dataOntem.getDate() - 1);
      const dataFormatada = dataOntem.toISOString().split('T')[0];

      const reservaPassada = {
        id: 999,
        usuario_id: usuario1.id,
        sala_id: sala1.id,
        data: dataFormatada,
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reserva passada',
      };

      ReservaModel.listarTodas().push(reservaPassada);

      const response = await request(app).delete(`/reservas/${reservaPassada.id}`).expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('após');
    });
  });
});
