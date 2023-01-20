CREATE DATABASE dindin;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE, 
  senha VARCHAR NOT NULL
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR NOT NULL UNIQUE
);

create table transacoes (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR NOT NULL,
  valor NUMERIC CHECK (valor > 0) NOT NULL,
  data DATE DEFAULT NOW(),
  categoria_id INTEGER NOT NULL REFERENCES categorias(id),
  usuario_id INTEGER NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  tipo VARCHAR CHECK(tipo = 'entrada' OR tipo='saida') NOT NULL
);