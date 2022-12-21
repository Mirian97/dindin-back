const jwt = require("jsonwebtoken");
const db = require("../conexaoBanco");
const { TOKEN_PASSWORD } = require("../../credenciais");

const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
    const token = authorization.split(" ")[1];

    try {
        const { id } = jwt.verify(token, TOKEN_PASSWORD);

        const { rows, rowCount } = await db.query(
            "SELECT * FROM usuarios WHERE id = $1",
            [id]
        )
        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." })
        }
        const { senha: _, ...usuario } = rows[0];

        req.usuario = usuario;
        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "Não autorizado." })
    }
}

module.exports = verificarUsuarioLogado