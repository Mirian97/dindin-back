const validarBodyUsuario = (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome.trim()) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." });
    }
    if (!email.trim()) {
        return res.status(400).json({ mensagem: "O campo email é obrigatório." });
    }
    if (!senha.trim()) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório." });
    }
    next();
}

const validarBodyTransacao = (req, res, next) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao.trim()) {
        return res.status(400).json({ mensagem: "O campo descrição é obrigatório." });
    }
    if (!valor) {
        return res.status(400).json({ mensagem: "O campo valor é obrigatório." });
    }
    if (!data.trim()) {
        return res.status(400).json({ mensagem: "O campo data é obrigatório." });
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: "O campo id da categoria é obrigatório." });
    }
    if (!tipo.trim()) {
        return res.status(400).json({ mensagem: "O campo tipo da transação é obrigatório." });
    }
    next();
}

const validarIdTransacao = (req, res, next) => {
    const { idTransacao } = req.params;

    if (isNaN(idTransacao)) {
        return res.status(400).json({ mensagem: "Id da transação inválido." });
    }

    next();
}

module.exports = {
    validarBodyUsuario,
    validarBodyTransacao,
    validarIdTransacao
}