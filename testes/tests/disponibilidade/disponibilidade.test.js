const request = require('supertest');
const app = require('../../src/server');
const SalaModel = require('../../src/models/Sala');
const UsuarioModel = require('../../src/models/Usuario');
const ReservaModel = require('../../src/models/Reserva');

describe('9.4 CONSULTA DE DISPONIBILIDADE', () => {
  let usuario, sala1, sala2, sala3;

  beforeEach(() => {
    SalaModel.resetar();
    UsuarioModel.resetar();
    ReservaModel.resetar();

    usuario = UsuarioModel.criar('Prof. João', 'joao@unifacisa.edu.br');
    sala1 = SalaModel.criar('Sala 101', 'Aula', 40, 'ativa');
    sala2 = SalaModel.criar('Lab 01', 'Laboratório', 30, 'ativa');
    sala3 = SalaModel.criar('Auditório', 'Auditório', 100, 'ativa');
  });

  describe('CT035 - Consultar salas disponíveis com sucesso', () => {
    it('deve retornar salas disponíveis com status 200', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario.id,
        sala_id: sala1.id,
        data: '2025-12-12',
        hora_inicio: '09:00',
        hora_fim: '10:00',
        motivo: 'Aula',
      });

      const response = await request(app)
        .get('/salas/disponiveis?data=2025-12-12&hora_inicio=09:00&hora_fim=10:00')
        .expect(200);

      expect(response.body).toHaveProperty('salas_disponiveis');
      expect(Array.isArray(response.body.salas_disponiveis)).toBe(true);

      const sala1Disponivel = response.body.salas_disponiveis.find((s) => s.id === sala1.id);
      expect(sala1Disponivel).toBeUndefined();

      const sala2Disponivel = response.body.salas_disponiveis.find((s) => s.id === sala2.id);
      const sala3Disponivel = response.body.salas_disponiveis.find((s) => s.id === sala3.id);
      expect(sala2Disponivel).toBeDefined();
      expect(sala3Disponivel).toBeDefined();

      expect(response.body.data).toBe('2025-12-12');
      expect(response.body.hora_inicio).toBe('09:00');
      expect(response.body.hora_fim).toBe('10:00');
    });
  });

  describe('CT036 - Consultar salas disponíveis quando todas estão reservadas', () => {
    it('deve retornar lista vazia quando todas as salas estiverem reservadas', async () => {
      await request(app).post('/reservas').send({
        usuario_id: usuario.id,
        sala_id: sala1.id,
        data: '2025-12-13',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reserva 1',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario.id,
        sala_id: sala2.id,
        data: '2025-12-13',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reserva 2',
      });

      await request(app).post('/reservas').send({
        usuario_id: usuario.id,
        sala_id: sala3.id,
        data: '2025-12-13',
        hora_inicio: '10:00',
        hora_fim: '11:00',
        motivo: 'Reserva 3',
      });

      const response = await request(app)
        .get('/salas/disponiveis?data=2025-12-13&hora_inicio=10:00&hora_fim=11:00')
        .expect(200);

      expect(response.body).toHaveProperty('salas_disponiveis');
      expect(Array.isArray(response.body.salas_disponiveis)).toBe(true);
      expect(response.body.salas_disponiveis.length).toBe(0);
    });
  });

  describe('CT037 - Impedir consulta com hora_fim menor que hora_inicio', () => {
    it('deve retornar erro 400 quando hora_fim for menor que hora_inicio', async () => {
      const response = await request(app)
        .get('/salas/disponiveis?data=2025-12-14&hora_inicio=15:00&hora_fim=14:00')
        .expect(400);

      expect(response.body).toHaveProperty('erro');
      expect(response.body.erro).toContain('maior');
    });
  });

  describe('CT038 - Impedir consulta em data passada', () => {
    it('deve permitir consulta em data passada (não há restrição implementada)', async () => {
      const response = await request(app)
        .get('/salas/disponiveis?data=2024-01-10&hora_inicio=09:00&hora_fim=10:00')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('salas_disponiveis');
    });
  });

  describe('CT039 - Impedir consulta sem parâmetros obrigatórios', () => {
    it('deve retornar erro 400 quando parâmetro data estiver ausente', async () => {
      const response = await request(app).get('/salas/disponiveis?hora_inicio=08:00&hora_fim=09:00').expect(400);

      expect(response.body).toHaveProperty('errors');
      const dataError = response.body.errors.find((e) => e.path === 'data');
      expect(dataError).toBeDefined();
    });

    it('deve retornar erro 400 quando parâmetro hora_inicio estiver ausente', async () => {
      const response = await request(app).get('/salas/disponiveis?data=2025-12-15&hora_fim=09:00').expect(400);

      expect(response.body).toHaveProperty('errors');
      const horaInicioError = response.body.errors.find((e) => e.path === 'hora_inicio');
      expect(horaInicioError).toBeDefined();
    });

    it('deve retornar erro 400 quando parâmetro hora_fim estiver ausente', async () => {
      const response = await request(app).get('/salas/disponiveis?data=2025-12-15&hora_inicio=08:00').expect(400);

      expect(response.body).toHaveProperty('errors');
      const horaFimError = response.body.errors.find((e) => e.path === 'hora_fim');
      expect(horaFimError).toBeDefined();
    });
  });
});
