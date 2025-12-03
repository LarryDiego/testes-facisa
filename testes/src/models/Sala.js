class Sala {
  constructor(id, nome, tipo, capacidade, status = 'ativa') {
    this.id = id;
    this.nome = nome;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.status = status;
  }
}

let salas = [];
let nextId = 1;

const SalaModel = {
  criar(nome, tipo, capacidade, status = 'ativa') {
    const novaSala = new Sala(nextId++, nome, tipo, capacidade, status);
    salas.push(novaSala);
    return novaSala;
  },

  listarTodas() {
    return salas;
  },

  buscarPorId(id) {
    return salas.find((s) => s.id === parseInt(id));
  },

  atualizar(id, dados) {
    const sala = this.buscarPorId(id);
    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    if (dados.nome && dados.nome !== sala.nome) {
      const salaExistente = salas.find(
        (s) => s.nome.toLowerCase() === dados.nome.toLowerCase() && s.id !== parseInt(id)
      );
      if (salaExistente) {
        throw new Error('Já existe uma sala com esse nome');
      }
    }

    if (dados.nome) sala.nome = dados.nome;
    if (dados.tipo) sala.tipo = dados.tipo;
    if (dados.capacidade) sala.capacidade = dados.capacidade;
    if (dados.status) sala.status = dados.status;

    return sala;
  },

  deletar(id) {
    const index = salas.findIndex((s) => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Sala não encontrada');
    }

    const sala = salas[index];
    salas.splice(index, 1);
    return sala;
  },

  estaAtiva(id) {
    const sala = this.buscarPorId(id);
    return sala && sala.status === 'ativa';
  },

  resetar() {
    salas = [];
    nextId = 1;
  },
};

module.exports = SalaModel;
