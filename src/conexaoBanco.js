const { Pool } = require("pg");
const { BD_HOST, BD_PORT, BD_USER, BD_PASSWORD, BD_DATABASE } = require("../credenciais")

const db = new Pool({
  host: BD_HOST,
  port: BD_PORT,
  user: BD_USER,
  password: BD_PASSWORD,
  database: BD_DATABASE
});

module.exports = db;
