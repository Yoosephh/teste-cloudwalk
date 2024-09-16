import request from 'supertest';
import app from '../src/app.js'

let server;

beforeAll((done) => {
  server = app.listen(done);
});

afterAll((done) => {
  server.close(done);
});

describe('App Routes', () => {
  it('should respond to /health with a greeting message', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello, Quake Player!');
  });

  it('should return match data on GET /default', async () => {
    const res = await request(app).get('/default');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('game_1'); 
  });

  it('should return an answer to a query on POST /query', async () => {
    const res = await request(app)
      .post('/query')
      .send({ question: 'Who had the most kills?' });
      
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('');
  });
});
