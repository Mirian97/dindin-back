const jwt = require("jsonwebtoken");
const knex = require("../conexao");

const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
    const token = authorization.split(" ")[1];

    try {
        const { id } = jwt.verify(token, process.env.TOKEN_PASSWORD);

        const usuario = await knex("usuarios").where({ id }).first();

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." })
        }
        const { senha: _, ...dadosUsuario } = usuario;

        req.usuario = dadosUsuario;
        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "Não autorizado." })
    }
}

module.exports = verificarUsuarioLogado