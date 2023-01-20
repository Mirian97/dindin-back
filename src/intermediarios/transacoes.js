const validarExistenciaTransacao = async (req, res, next) => {
    const { id } = req.usuario;
    const { idTransacao } = req.params;

    try {
        const transacao = await knex("transacoes")
            .where({
                id: idTransacao,
                usuario_id: id
            })
            .first();

        if (!transacao) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        next();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const validarTipoTransacao = (req, res, next) => {
    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ mensagem: "O campo tipo só recebe valores igual a 'entrada' ou 'saida'." })
    }
    next();
}

const validarArrayFiltroTransacao = (req, res, next) => {
    if (filtro && !Array.isArray(filtro)) {
        return res.status(400).json({ mensagem: "O filtro precisa ser um array." });
    }
    next();
}

module.exports = {
    validarExistenciaTransacao,
    validarTipoTransacao,
    validarArrayFiltroTransacao
}