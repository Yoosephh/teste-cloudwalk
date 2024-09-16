import express, { Router } from "express";
import cors from "cors";
import parserControler from "./parser.js";
import queryLLM from "./ai.config.js";
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

const fileRouter = Router();

fileRouter.get('/health', (req, res)=> {
  res.send('Hello, Quake Player!')
})
  .get('/default', parserControler)
  .post('/query', queryLLM)

app.use(cors());
app.use(express.json());
app.use(fileRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;

