import { askLLM } from '../src/ai.config.js';
import { parseLogFile } from '../src/parser.js';


jest.mock('openai', () => ({
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../src/parser.js');

describe('askLLM', () => {
  it('should return a valid response from OpenAI', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Player1 had the most kills' } }],
    };

    openai.chat.completions.create.mockResolvedValue(mockResponse);
    const result = await askLLM('Who had the most kills?', { game_1: { players: ['Player1'] } });

    expect(result).toEqual('Player1 had the most kills');
  });

  it('should handle errors from OpenAI', async () => {
    openai.chat.completions.create.mockRejectedValue(new Error('API Error'));
    const result = await askLLM('Who had the most kills?', { game_1: { players: ['Player1'] } });

    expect(result).toEqual('Error processing the query.');
  });
});

describe('queryLLM', () => {
  it('should return an LLM-based answer in the response', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Player1 had the most kills' } }],
    };
    openai.chat.completions.create.mockResolvedValue(mockResponse);
    parseLogFile.mockResolvedValue({ game_1: { players: ['Player1'] } });

    const req = { body: { question: 'Who had the most kills?' } };
    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    await queryLLM(req, res);

    expect(res.send).toHaveBeenCalledWith('Player1 had the most kills');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});