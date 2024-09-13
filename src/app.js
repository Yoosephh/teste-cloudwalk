import express from "express";
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res)=> {
  res.send('Hello, Quake Player!')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});