const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Reservas de Salas - UNIFACISA',
      version: '1.0.0',
      description: `Sistema de Gerenciamento de Reservas de Salas da UNIFACISA via API REST.
      
      Esta API permite:
      - Cadastro e gerenciamento de salas
      - Cadastro e gerenciamento de usuários
      - Criação e gerenciamento de reservas
      - Consulta de disponibilidade de salas
      
      ## Regras de Negócio
      
      ### Salas
      - Nomes de salas devem ser únicos
      - Salas inativas não podem ser reservadas
      
      ### Usuários
      - E-mails devem ser únicos e válidos
      - Apenas usuários cadastrados podem criar reservas
      
      ### Reservas
      - Não é permitido criar reservas sobrepostas na mesma sala
      - Reservas devem ter hora_fim > hora_inicio
      - Reservas no passado não podem ser criadas
      - Cancelamentos só podem ocorrer antes do horário de início
      `,
      contact: {
        name: 'UNIFACISA',
        email: 'contato@unifacisa.edu.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Salas',
        description: 'Operações relacionadas a salas',
      },
      {
        name: 'Usuários',
        description: 'Operações relacionadas a usuários',
      },
      {
        name: 'Reservas',
        description: 'Operações relacionadas a reservas',
      },
      {
        name: 'Disponibilidade',
        description: 'Consulta de disponibilidade de salas',
      },
    ],
    components: {
      schemas: {
        Sala: {
          type: 'object',
          required: ['nome', 'tipo', 'capacidade'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da sala',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome da sala (deve ser único)',
              example: 'Lab 01',
            },
            tipo: {
              type: 'string',
              description: 'Tipo da sala',
              example: 'Laboratório de Informática',
            },
            capacidade: {
              type: 'integer',
              minimum: 1,
              description: 'Capacidade da sala',
              example: 40,
            },
            status: {
              type: 'string',
              enum: ['ativa', 'inativa'],
              description: 'Status da sala',
              example: 'ativa',
            },
          },
        },
        Usuario: {
          type: 'object',
          required: ['nome', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário',
              example: 1,
            },
            nome: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário (deve ser único)',
              example: 'joao.silva@unifacisa.edu.br',
            },
          },
        },
        Reserva: {
          type: 'object',
          required: ['usuario_id', 'sala_id', 'data', 'hora_inicio', 'hora_fim', 'motivo'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da reserva',
              example: 1,
            },
            usuario_id: {
              type: 'integer',
              description: 'ID do usuário que fez a reserva',
              example: 1,
            },
            sala_id: {
              type: 'integer',
              description: 'ID da sala reservada',
              example: 1,
            },
            data: {
              type: 'string',
              format: 'date',
              description: 'Data da reserva (YYYY-MM-DD)',
              example: '2024-12-15',
            },
            hora_inicio: {
              type: 'string',
              pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
              description: 'Hora de início (HH:MM)',
              example: '14:00',
            },
            hora_fim: {
              type: 'string',
              pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
              description: 'Hora de término (HH:MM)',
              example: '16:00',
            },
            motivo: {
              type: 'string',
              description: 'Motivo da reserva',
              example: 'Aula de Programação',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Recurso não encontrado',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string',
                    example: 'Campo obrigatório',
                  },
                  param: {
                    type: 'string',
                    example: 'nome',
                  },
                  location: {
                    type: 'string',
                    example: 'body',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Requisição inválida',
          content: {
            'application/json': {
              schema: {
                oneOf: [{ $ref: '#/components/schemas/Error' }, { $ref: '#/components/schemas/ValidationError' }],
              },
            },
          },
        },
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Conflict: {
          description: 'Conflito - recurso já existe ou regra de negócio violada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerOptions;
