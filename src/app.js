import express, { Router } from "express";
import cors from "cors";
import { parseLogFile } from "./parser.js";
import { askLLM } from "./ai.config.js";
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();


const fileRouter = Router();

fileRouter.get('/health', (req, res)=> {
  res.send('Hello, Quake Player!')
})
  .get('/default', parseLogFile)
  .post('/query', async (req, res) => {
    const {question} = req.body;
    const matchData =await parseLogFile();
    console.log(matchData)
    const answer = await askLLM(question, matchData);
    console.log(answer)

    res.sendStatus(200)
  })

app.use(cors());
app.use(express.json());
app.use(fileRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



