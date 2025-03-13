import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "OZmap API",
    version: "1.0.0",
    description: "API de Geolocalização do OZmap",
    license: {
      name: "ISC",
    },
    contact: {
      name: "Equipe OZmap",
    },
  },
  servers: [
    {
      url:
        process.env.NODE_ENV === "production"
          ? "https://api.seudominio.com"
          : `http://localhost:${process.env.PORT || 3000}`,
      description:
        process.env.NODE_ENV === "production"
          ? "Servidor de produção"
          : "Servidor de desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          _id: {
            type: "string",
            description: "ID do usuário",
          },
          name: {
            type: "string",
            description: "Nome do usuário",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
          },
          address: {
            type: "string",
            description: "Endereço do usuário",
          },
          coordinates: {
            type: "array",
            items: {
              type: "number",
            },
            description: "Coordenadas do usuário [longitude, latitude]",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data de atualização",
          },
        },
      },
      UserInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            description: "Nome do usuário",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
          },
          password: {
            type: "string",
            description: "Senha do usuário",
          },
          address: {
            type: "string",
            description:
              "Endereço do usuário (forneça address ou coordinates, não ambos)",
          },
          coordinates: {
            type: "array",
            items: {
              type: "number",
            },
            description:
              "Coordenadas do usuário [longitude, latitude] (forneça address ou coordinates, não ambos)",
          },
        },
      },
      Region: {
        type: "object",
        required: ["name", "geometry"],
        properties: {
          _id: {
            type: "string",
            description: "ID da região",
          },
          name: {
            type: "string",
            description: "Nome da região",
          },
          geometry: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["Polygon"],
                description: "Tipo de geometria",
              },
              coordinates: {
                type: "array",
                description: "Coordenadas do polígono",
                items: {
                  type: "array",
                  items: {
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
          user: {
            type: "string",
            description: "ID do usuário proprietário",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data de atualização",
          },
        },
      },
      RegionInput: {
        type: "object",
        required: ["name", "geometry"],
        properties: {
          name: {
            type: "string",
            description: "Nome da região",
          },
          geometry: {
            type: "object",
            required: ["type", "coordinates"],
            properties: {
              type: {
                type: "string",
                enum: ["Polygon"],
                description: "Tipo de geometria",
              },
              coordinates: {
                type: "array",
                description: "Coordenadas do polígono",
                items: {
                  type: "array",
                  items: {
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
        },
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "Email do usuário",
          },
          password: {
            type: "string",
            description: "Senha do usuário",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "Token JWT de autenticação",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Mensagem de erro",
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Verifica o status do servidor",
        description: "Retorna um status 200 se o servidor estiver operacional",
        tags: ["Saúde"],
        responses: {
          200: {
            description: "Servidor operacional",
            content: {
              "text/plain": {
                schema: {
                  type: "string",
                  example: "OK",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Autenticação de usuário",
        description: "Faz login de um usuário e retorna um token JWT",
        tags: ["Autenticação"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login bem-sucedido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          401: {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          422: {
            description: "Dados de entrada inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/users": {
      post: {
        summary: "Criar um novo usuário",
        description: "Cria um novo usuário com os dados fornecidos",
        tags: ["Usuários"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          409: {
            description: "Usuário já existe",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          422: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      get: {
        summary: "Listar todos os usuários",
        description: "Retorna uma lista paginada de usuários",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
            description: "Página a ser exibida",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 10,
            },
            description: "Número de itens por página",
          },
        ],
        responses: {
          200: {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rows: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                    page: {
                      type: "string",
                      example: "1",
                    },
                    limit: {
                      type: "string",
                      example: "10",
                    },
                    total: {
                      type: "integer",
                      example: 50,
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          404: {
            description: "Nenhum usuário encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/users/me": {
      get: {
        summary: "Obter perfil do usuário autenticado",
        description: "Retorna os dados do usuário autenticado",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Perfil do usuário",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Atualizar usuário autenticado",
        description: "Atualiza os dados do usuário autenticado",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                  },
                  address: {
                    type: "string",
                  },
                  coordinates: {
                    type: "array",
                    items: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          422: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Excluir usuário autenticado",
        description: "Exclui o usuário autenticado",
        tags: ["Usuários"],
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: "Usuário excluído com sucesso",
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/regions": {
      get: {
        summary: "Listar todas as regiões",
        description: "Retorna uma lista paginada de regiões",
        tags: ["Regiões"],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              default: 1,
            },
            description: "Página a ser exibida",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              default: 10,
            },
            description: "Número de itens por página",
          },
        ],
        responses: {
          200: {
            description: "Lista de regiões",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rows: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Region",
                      },
                    },
                    page: {
                      type: "string",
                      example: "1",
                    },
                    limit: {
                      type: "string",
                      example: "10",
                    },
                    total: {
                      type: "integer",
                      example: 50,
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Nenhuma região encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Criar uma nova região",
        description: "Cria uma nova região com os dados fornecidos",
        tags: ["Regiões"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegionInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Região criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Region",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          409: {
            description: "Região já existe",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          422: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/regions/by-point": {
      get: {
        summary: "Encontrar regiões por ponto",
        description: "Retorna regiões que contêm um ponto específico",
        tags: ["Regiões"],
        parameters: [
          {
            in: "query",
            name: "point",
            required: true,
            schema: {
              type: "string",
            },
            description: 'Coordenadas no formato "longitude,latitude"',
            example: "-46.6388,-23.5504",
          },
        ],
        responses: {
          200: {
            description: "Lista de regiões que contêm o ponto",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Region",
                  },
                },
              },
            },
          },
          400: {
            description: "Coordenadas não fornecidas",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          404: {
            description: "Nenhuma região encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/regions/by-distance": {
      get: {
        summary: "Encontrar regiões por distância",
        description: "Retorna regiões a uma distância específica de um ponto",
        tags: ["Regiões"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "point",
            required: true,
            schema: {
              type: "string",
            },
            description: 'Coordenadas no formato "longitude,latitude"',
            example: "-46.6388,-23.5504",
          },
          {
            in: "query",
            name: "maxDistance",
            required: true,
            schema: {
              type: "number",
            },
            description: "Distância máxima em metros",
            example: 1000,
          },
          {
            in: "query",
            name: "filterRegions",
            schema: {
              type: "boolean",
            },
            description: "Se true, filtra regiões do usuário autenticado",
          },
        ],
        responses: {
          200: {
            description: "Lista de regiões dentro da distância especificada",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Region",
                  },
                },
              },
            },
          },
          400: {
            description: "Parâmetros inválidos ou ausentes",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          404: {
            description: "Nenhuma região encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/regions/{id}": {
      get: {
        summary: "Obter região por ID",
        description: "Retorna uma região específica pelo ID",
        tags: ["Regiões"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID da região",
          },
        ],
        responses: {
          200: {
            description: "Dados da região",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Region",
                },
              },
            },
          },
          404: {
            description: "Região não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      patch: {
        summary: "Atualizar região",
        description: "Atualiza uma região existente",
        tags: ["Regiões"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID da região",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  geometry: {
                    $ref: "#/components/schemas/RegionInput/properties/geometry",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Região atualizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Region",
                },
              },
            },
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          404: {
            description: "Região não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          422: {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Excluir região",
        description: "Exclui uma região específica pelo ID",
        tags: ["Regiões"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "ID da região",
          },
        ],
        responses: {
          204: {
            description: "Região excluída com sucesso",
          },
          401: {
            description: "Não autorizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          404: {
            description: "Região não encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
