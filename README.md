

<h1 align="center">Quake Log Parser</h1>
<h3>Uma API para análise e extração de dados de partidas do Quake III Arena, com integração ao OpenAI para responder perguntas sobre os dados das partidas.</h3>

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/Yoosephh/teste-cloudwalk
    cd quake-log-parser
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

Antes de executar a aplicação, você precisará configurar as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```bash
PORT=5000               # Ou qualquer porta que você prefira
OPENAI_API_KEY=sua_chave_api_openai
```

## Execução
Após a instalação das dependências e configuração das variáveis de ambiente, você pode executar a aplicação com os seguintes comandos:

```bash
# Iniciar a aplicação
npm run start

# Modo de desenvolvimento com nodemon
npm run dev
```

## Rotas e Endpoints

### Verificação de saúde (Health Check)
- **GET** `/health`: Verifica se o servidor está funcionando corretamente.

  **Resposta**:
  ```json
  "Hello, Quake Player!"
  ```

### Análise de Log
- **GET** `/default`: Faz a leitura do arquivo de log do Quake (`Log teste.log`) e retorna os dados estruturados da partida.

  **Resposta**:
  ```json
  {
    "game_1": {
      "totalKills": 10,
      "players": ["Jogador1", "Jogador2"],
      "kills": {
        "Jogador1": 5,
        "Jogador2": 3
      },
      "worldKills": 2,
      "killsByMeans": {
        "MOD_ROCKET": 4,
        "MOD_SHOTGUN": 3
      }
    }, ...
  }
  ```

### Consultar Dados da Partida via LLM
- **POST** `/query`: Consulta os dados da partida através de linguagem natural usando o modelo GPT da OpenAI. Este endpoint aceita uma pergunta no corpo da requisição, que será respondida com base nos dados analisados da partida.

  **Headers**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```

  **Body**:
  ```json
  {
    "question": "Quem fez mais kills no jogo 1?"
  }
  ```

  **Resposta** (exemplo):
  ```json
  "Jogador1 fez mais kills no jogo 1 com 5 kills."
  ```

## Tecnologias Utilizadas
- **Node.js**: Ambiente JavaScript para desenvolvimento no lado do servidor.
- **Express**: Framework web para criação de APIs REST.
- **API OpenAI**: Para consultas ao modelo de linguagem (LLM) e responder perguntas sobre os dados das partidas.
- **Jest**: Framework de testes para unit tests.
- **Nodemon**: Ferramenta para reiniciar automaticamente o servidor em modo de desenvolvimento.

## Testes
Você pode executar os testes com o seguinte comando:

```bash
# Para executar todos os testes
npm test 

# Para gerar o relatório de cobertura
npm run coverage
```

## Variáveis de Ambiente
- `PORT`: Especifica a porta onde o servidor vai rodar (padrão 5000).
- `OPENAI_API_KEY`: Sua chave de API do OpenAI para interação com o modelo LLM.
