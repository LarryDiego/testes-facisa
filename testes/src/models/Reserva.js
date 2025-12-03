const SalaModel = require('./Sala');
const UsuarioModel = require('./Usuario');

class Reserva {
  constructor(id, usuario_id, sala_id, data, hora_inicio, hora_fim, motivo) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.sala_id = sala_id;
    this.data = data;
    this.hora_inicio = hora_inicio;
    this.hora_fim = hora_fim;
    this.motivo = motivo;
  }
}

let reservas = [];
let nextId = 1;

const ReservaModel = {
  criar(usuario_id, sala_id, data, hora_inicio, hora_fim, motivo) {
    const usuario = UsuarioModel.buscarPorId(usuario_id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const sala = SalaModel.buscarPorId(sala_id);
    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    if (!SalaModel.estaAtiva(sala_id)) {
      throw new Error('Sala inativa não pode ser reservada');
    }

    if (hora_fim <= hora_inicio) {
      throw new Error('Hora de término deve ser maior que hora de início');
    }

    const dataReserva = new Date(`${data}T${hora_inicio}:00`);
    const agora = new Date();
    if (dataReserva < agora) {
      throw new Error('Não é possível criar reservas no passado');
    }

    const reservasSobreposta = reservas.find(
      (r) =>
        r.sala_id === sala_id &&
        r.data === data &&
        ((hora_inicio >= r.hora_inicio && hora_inicio < r.hora_fim) ||
          (hora_fim > r.hora_inicio && hora_fim <= r.hora_fim) ||
          (hora_inicio <= r.hora_inicio && hora_fim >= r.hora_fim))
    );

    if (reservasSobreposta) {
      throw new Error('Já existe uma reserva neste horário para esta sala');
    }

    const novaReserva = new Reserva(nextId++, usuario_id, sala_id, data, hora_inicio, hora_fim, motivo);
    reservas.push(novaReserva);
    return novaReserva;
  },

  listarTodas() {
    return reservas;
  },

  buscarPorId(id) {
    return reservas.find((r) => r.id === parseInt(id));
  },

  buscarPorSalaEData(sala_id, data) {
    return reservas.filter((r) => r.sala_id === parseInt(sala_id) && r.data === data);
  },

  buscarPorUsuario(usuario_id) {
    return reservas.filter((r) => r.usuario_id === parseInt(usuario_id));
  },

  atualizar(id, dados) {
    const reserva = this.buscarPorId(id);
    if (!reserva) {
      throw new Error('Reserva não encontrada');
    }

    const novaHoraInicio = dados.hora_inicio || reserva.hora_inicio;
    const novaHoraFim = dados.hora_fim || reserva.hora_fim;
    const novaData = dados.data || reserva.data;

    if (novaHoraFim <= novaHoraInicio) {
      throw new Error('Hora de término deve ser maior que hora de início');
    }

    const reservasSobreposta = reservas.find(
      (r) =>
        r.id !== parseInt(id) &&
        r.sala_id === reserva.sala_id &&
        r.data === novaData &&
        ((novaHoraInicio >= r.hora_inicio && novaHoraInicio < r.hora_fim) ||
          (novaHoraFim > r.hora_inicio && novaHoraFim <= r.hora_fim) ||
          (novaHoraInicio <= r.hora_inicio && novaHoraFim >= r.hora_fim))
    );

    if (reservasSobreposta) {
      throw new Error('Já existe uma reserva neste horário para esta sala');
    }

    if (dados.data) reserva.data = dados.data;
    if (dados.hora_inicio) reserva.hora_inicio = dados.hora_inicio;
    if (dados.hora_fim) reserva.hora_fim = dados.hora_fim;
    if (dados.motivo) reserva.motivo = dados.motivo;

    return reserva;
  },

  deletar(id) {
    const reserva = this.buscarPorId(id);
    if (!reserva) {
      throw new Error('Reserva não encontrada');
    }
    const dataHoraInicio = new Date(`${reserva.data}T${reserva.hora_inicio}:00`);
    const agora = new Date();

    if (agora >= dataHoraInicio) {
      throw new Error('Não é possível cancelar reserva após o horário de início');
    }

    const index = reservas.findIndex((r) => r.id === parseInt(id));
    reservas.splice(index, 1);
    return reserva;
  },

  buscarSalasDisponiveis(data, hora_inicio, hora_fim) {
    const todasSalas = SalaModel.listarTodas();
    const salasAtivas = todasSalas.filter((s) => s.status === 'ativa');

    const salasDisponiveis = salasAtivas.filter((sala) => {
      const conflito = reservas.find(
        (r) =>
          r.sala_id === sala.id &&
          r.data === data &&
          ((hora_inicio >= r.hora_inicio && hora_inicio < r.hora_fim) ||
            (hora_fim > r.hora_inicio && hora_fim <= r.hora_fim) ||
            (hora_inicio <= r.hora_inicio && hora_fim >= r.hora_fim))
      );

      return !conflito;
    });

    return salasDisponiveis;
  },

  resetar() {
    reservas = [];
    nextId = 1;
  },
};

module.exports = ReservaModel;
