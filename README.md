# OZmap Challenge: API de Geolocalização

Bem-vindo ao projeto de API de Geolocalização OZmap. Este projeto implementa uma API RESTful para gerenciar usuários e regiões geográficas com funcionalidades completas de geolocalização.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Executando os Testes](#executando-os-testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Documentação da API](#documentação-da-api)

## 👀 Visão Geral

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. Esta API permite gerenciar usuários e regiões geográficas, com funcionalidades de transformação entre endereços e coordenadas, além de pesquisas espaciais avançadas.

## 🚀 Tecnologias Utilizadas

- **Node.js**: v20+
- **TypeScript**: Tipagem estática para maior segurança
- **MongoDB**: Banco de dados NoSQL com suporte a operações geoespaciais
- **Mongoose/Typegoose**: ORM para MongoDB com suporte a tipos TypeScript
- **Express**: Framework para APIs RESTful
- **JWT**: Autenticação baseada em tokens
- **Google Maps API**: Serviços de geocodificação
- **Jest/Mocha/Chai**: Ferramentas para testes unitários e de integração
- **Swagger**: Documentação automática da API
- **Docker**: Conteinerização do ambiente de desenvolvimento
- **Pino**: Sistema de logs estruturados

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js v20 ou superior
- Docker e Docker Compose
- MongoDB 7+

### Configuração das Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ozmap-tech-test?replicaSet=rs0&authSource=admin
MAPS_API_KEY=sua_chave_da_api_do_google_maps
JWT_SECRET_KEY=sua_chave_secreta_para_tokens_jwt
```

### Configuração do Banco de Dados

Execute o Docker Compose para iniciar o MongoDB:

```bash
docker-compose up -d
```

Esta configuração inicia um servidor MongoDB com suporte a operações geoespaciais e configurado com um ReplicaSet (necessário para suportar transações no MongoDB).

## 🚀 Executando a Aplicação

Instale as dependências:

```bash
yarn install
```

Execute a aplicação em modo de desenvolvimento:

```bash
yarn dev
```

A API estará disponível em `http://localhost:3000`.

## 🧪 Executando os Testes

### Executando todos os testes

```bash
yarn test
```

### Executando testes com cobertura

```bash
yarn test:coverage
```

Isso gerará relatórios de cobertura na pasta `.nyc_output` e um relatório HTML na pasta `coverage`.

### Testes Unitários

Os testes unitários se concentram em testar componentes individuais como serviços e bibliotecas:

```bash
yarn test src/tests/unit
```

### Testes de Integração

Os testes de integração testam o comportamento dos endpoints da API:

```bash
yarn test src/tests/integration
```

## 📁 Estrutura do Projeto

```
src/
├── config/         # Configurações (logger, swagger)
├── controllers/    # Controladores da API
├── errors/         # Definições de erros da aplicação
├── libs/           # Bibliotecas auxiliares (geocodificação)
├── middlewares/    # Middlewares do Express
├── models/         # Modelos de dados (Typegoose)
├── repositories/   # Camada de acesso ao banco de dados
├── routes/         # Definição de rotas
├── schemas/        # Esquemas de validação (Zod)
├── services/       # Lógica de negócios
├── tests/          # Testes unitários e de integração
├── types/          # Definições de tipos TypeScript
├── database.ts     # Configuração do banco de dados
└── index.ts        # Ponto de entrada da aplicação
```

## 📝 Funcionalidades Implementadas

### Usuários

- **CRUD completo**: Criar, ler, atualizar e deletar usuários
- **Geocodificação**: Conversão automática entre endereço e coordenadas
- Validação para garantir que apenas um dos dois (endereço ou coordenadas) seja fornecido na criação/atualização

### Regiões

- **CRUD completo**: Criar, ler, atualizar e deletar regiões
- **Busca espacial**: Encontrar regiões que contêm um ponto específico
- **Busca por distância**: Encontrar regiões a uma distância específica de um ponto
- Integração com o usuário: Cada região pertence a um usuário

### Autenticação

- Sistema de login baseado em JWT
- Proteção de rotas privadas
- Regras de autorização para modificação de recursos

## 📚 Documentação da API

A API é documentada usando Swagger e está disponível em:

```
http://localhost:3000/api-docs
```

### Endpoints Principais

- **Autenticação**: `/api/auth/login`
- **Usuários**: `/api/users`
- **Regiões**: `/api/regions`

## ✨ Diferenciais Implementados

- **Autenticação JWT**: Sistema completo de autenticação com tokens
- **Documentação Swagger**: Documentação interativa da API
- **Logs Estruturados**: Sistema de logs com níveis de severidade e formato JSON
- **Transações**: Uso de MongoDB sessions para operações atômicas
- **Validação Robusta**: Esquemas de validação com Zod
- **Cobertura de Testes**: Testes unitários e de integração com alta cobertura

Este projeto foi desenvolvido como parte de um desafio técnico da OZmap para construir uma API de geolocalização.
