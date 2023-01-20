require("dotenv").config();
const express = require("express");
const cors = require('cors');
const rotas = require("./rotas");
const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(cors());
app.use(express.json());
app.use(rotas);

app.listen(PORTA, () => console.log(`API rodando na PORTA ${PORTA}`));