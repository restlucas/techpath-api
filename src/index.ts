import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "API funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
