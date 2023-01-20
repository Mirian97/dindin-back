const express = require("express");
const listarCategorias = require("./controladores/categorias");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");
const validarCorpoRequisicao = require("./intermediarios/validarCorpoRequisicao");
const schemaUsuario = require("./validacoes/schemaUsuario");
const schemaTransacao = require("./validacoes/schemaTransacao");
const schemaIdTransacao = require("./validacoes/schemaIdTransacao");
const {
    cadastrarUsuario,
    realizarLogin,
    detalharPerfilUsuario,
    atualizarPerfilUsuario
} = require("./controladores/usuario");
const {
    listarTransacoesUsuario,
    obterExtratoUsuario,
    detalharTransacaoUsuario,
    cadastrarTransacaoUsuario,
    atualizarTransacaoUsuario,
    excluirTransacaoUsuario,
} = require("./controladores/transacoes");
const { validarExistenciaTransacao, validarTipoTransacao, validarArrayFiltroTransacao } = require("./intermediarios/transacoes");

const rotas = express();

rotas.post(
    "/usuario",
    validarCorpoRequisicao(schemaUsuario),
    cadastrarUsuario
);

rotas.post("/login", realizarLogin);

rotas.use(verificarUsuarioLogado);

rotas.get("/usuario", detalharPerfilUsuario);

rotas.put(
    "/usuario",
    validarCorpoRequisicao(schemaUsuario),
    atualizarPerfilUsuario
);

rotas.get("/categoria", listarCategorias);

rotas.get(
    "/transacao",
    validarArrayFiltroTransacao,
    listarTransacoesUsuario
);

rotas.get("/transacao/extrato", obterExtratoUsuario);

rotas.get(
    "/transacao/:idTransacao",
    validarId(schemaIdTransacao),
    validarExistenciaTransacao,
    detalharTransacaoUsuario
);

rotas.post(
    "/transacao",
    validarCorpoRequisicao(schemaTransacao),
    validarTipoTransacao,
    cadastrarTransacaoUsuario
);

rotas.put(
    "/transacao/:idTransacao",
    validarId(schemaIdTransacao),
    validarCorpoRequisicao(schemaTransacao),
    validarTipoTransacao,
    validarExistenciaTransacao,
    atualizarTransacaoUsuario
);

rotas.delete(
    "/transacao/:idTransacao",
    validarId(schemaIdTransacao),
    validarExistenciaTransacao,
    excluirTransacaoUsuario
);

module.exports = rotas;