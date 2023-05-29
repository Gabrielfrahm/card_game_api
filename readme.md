<h1 align="center">Elden Card API</h1>

<h1 align="center">
    <a href="https://nestjs.com">💻 Nest js</a>
    <a href="https://nodejs.org">🔗 node</a>
</h1>

<p align="center">🚀um projeto de estudo, aplicando as melhores praticas!</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Gabrielfrahm/card_game_client"/>
  <img src="https://img.shields.io/github/stars/Gabrielfrahm/card_game_client"/>
  <img src="https://img.shields.io/github/forks/Gabrielfrahm/card_game_client"/>
  <img src="https://img.shields.io/github/issues/Gabrielfrahm/card_game_client"/>
</p>

<h4 align="center">
	🚧 Projeto  em construção...  🚧
</h4>

<p align="center">
  <img src="https://user-images.githubusercontent.com/49403676/241785043-f5e8f1ec-5e2f-41da-b8db-eb15c04c9d5b.gif"/>
</p>

<p align="center">
 <a href="#features">Features</a> •
 <a href="#pre">Pre-requisitos</a> •
 <a href="#tec">Tecnologias</a> •
 <a href="#libs">Bibliotecas</a>
 <a href="#licenc-a">Licença</a> •
 <a href="#autor">Autor</a>
</p>

### Features

- [x] TDD.
- [x] ✔ Login .
- [x] ✔ Criação de usuário.
- [ ] Edição de usuário.
- [ ] Exclusão de usuário.
- [x] ✔ Listagem de Cartas.
- [x] ✔ Criação de Deck.
- [x] ✔ Atualização de Deck.
- [x] ✔ Listagem de Deck.
- [ ] exclusão do Deck.
- [ ] Rank de Jogadores.
- [ ] buscar partida.

<hr>
<p id="pre">
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
-[Git](https://git-scm.com),  -[Node.js](https://nodejs.org/en/).
 -[docker](https://www.docker.com)
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

## lembrete : Você precisa ter o projeto da web em sua maquina.

### 🚀 Rodando o api end (nest js)

```bash
# Clone este repositório
$ git clone <https://github.com/Gabrielfrahm/card_game_api>

# Acesse a pasta do projeto no terminal/cmd
$ cd card_game_client

#rode o docker
$ docker compose start

# acesse o container responsavel pela apliacação
$ docker exec -it api_app bash


# Execute a aplicação em modo de desenvolvimento
$ npm run start:dev

# inciará na porta:3333 - acesse <http://localhost:3333>
```

</p>
<hr>
<p id="tec">

🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [NEST JS](https://nestjs.com)
- [TypeScript](https://www.typescriptlang.org/)
- [Vs code](https://code.visualstudio.com)
- [REDIS](https://redis.io)
</p>
<hr>
<p id="libs">
📚Bibliotecas

Algumas bibliotecas usadas para o desenvolver do projeto.

core:

- [Prisma orm](https://www.prisma.io) usado para controlar as requisições do banco de dados.
- [bcrypt](https://www.npmjs.com/package/bcrypt) usado para realizar o encrypter da aplicação.
- [class-validator](https://www.npmjs.com/package/class-validator) usado para realizar uma classe de validação.
- [dotenv](https://www.npmjs.com/package/dotenv) usado para controlar as variáveis de ambiente.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) usado para gerar token de autenticação.
- [sqlite3](https://www.npmjs.com/package/sqlite3) usado para usar o sqlite no sistema.
- [uuid](https://www.npmjs.com/package/uuid) usado para gerar ids únicos no sistema.
- [jest](https://jestjs.io/pt-BR/) usado para fazer o TDD.

nest:

- [class-transformer](https://www.npmjs.com/package/class-transformer) usado para controlar uma classe de validação.
- [Redis](https://www.npmjs.com/package/ioredis) usado para realizar o driver de acesso com o redis.
- [joi](https://www.npmjs.com/package/joi) usado para realizar uma validação em objetos.
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) usando para habilitar Decorators.
</p>

<hr id="licenc-a">
📝 Licença
Este projeto esta sobe a licença MIT.

Feito por Gabriel Marques 👋🏽 Entre em contato!
