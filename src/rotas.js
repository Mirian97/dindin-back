const express = require("express");
const listarCategorias = require("./controladores/categorias");
const verificarUsuarioLogado = require("./intermediarios/autenticacao");
const {
    validarBodyUsuario,
    validarBodyTransacao,
    validarIdTransacao
} = require("./intermediarios/validacoes");

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

const rotas = express();

rotas.post("/usuario", validarBodyUsuario, cadastrarUsuario);
rotas.post("/login", realizarLogin);
rotas.use(verificarUsuarioLogado);
rotas.get("/usuario", detalharPerfilUsuario);
rotas.put("/usuario", validarBodyUsuario, atualizarPerfilUsuario);
rotas.get("/categoria", listarCategorias);
rotas.get("/transacao", listarTransacoesUsuario);
rotas.get("/transacao/extrato", obterExtratoUsuario);
rotas.get("/transacao/:idTransacao", validarIdTransacao, detalharTransacaoUsuario);
rotas.post("/transacao", validarBodyTransacao, cadastrarTransacaoUsuario);
rotas.put("/transacao/:idTransacao", validarIdTransacao, validarBodyTransacao, atualizarTransacaoUsuario);
rotas.delete("/transacao/:idTransacao", validarIdTransacao, excluirTransacaoUsuario);

module.exports = rotas;