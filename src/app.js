import express, { Router } from "express";
import cors from "cors";
import readLogFile, { parseLogFile } from "./parser.js";

const port = process.env.PORT || 5000;
const app = express();


const fileRouter = Router();

fileRouter.get('/health', (req, res)=> {
  res.send('Hello, Quake Player!')
})
  .get('/default', parseLogFile)

app.use(cors());
app.use(express.json());
app.use(fileRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



