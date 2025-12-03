class Usuario {
  constructor(id, nome, email) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}

let usuarios = [];
let nextId = 1;

const UsuarioModel = {
  criar(nome, email) {
    const usuarioExistente = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (usuarioExistente) {
      throw new Error('Já existe um usuário com esse email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    const novoUsuario = new Usuario(nextId++, nome, email);
    usuarios.push(novoUsuario);
    return novoUsuario;
  },

  listarTodos() {
    return usuarios;
  },

  buscarPorId(id) {
    return usuarios.find((u) => u.id === parseInt(id));
  },

  atualizar(id, dados) {
    const usuario = this.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (dados.email && dados.email !== usuario.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dados.email)) {
        throw new Error('Email inválido');
      }

      const usuarioExistente = usuarios.find(
        (u) => u.email.toLowerCase() === dados.email.toLowerCase() && u.id !== parseInt(id)
      );
      if (usuarioExistente) {
        throw new Error('Já existe um usuário com esse email');
      }
    }

    if (dados.nome) usuario.nome = dados.nome;
    if (dados.email) usuario.email = dados.email;

    return usuario;
  },

  deletar(id) {
    const index = usuarios.findIndex((u) => u.id === parseInt(id));
    if (index === -1) {
      throw new Error('Usuário não encontrado');
    }

    const usuario = usuarios[index];
    usuarios.splice(index, 1);
    return usuario;
  },

  resetar() {
    usuarios = [];
    nextId = 1;
  },
};

module.exports = UsuarioModel;
