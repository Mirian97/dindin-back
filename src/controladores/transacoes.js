const db = require("../conexaoBanco");

const listarTransacoesUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { filtro } = req.query;

    if (filtro && !Array.isArray(filtro)) {
        return res.status(400).json({ mensagem: "O filtro precisa ser um array." });
    }
    try {
        let queryFiltro = ""
        let arrayFiltro;
        if (filtro) {
            arrayFiltro = filtro.map(item => `${item}`);
            queryFiltro += "AND c.descricao ILIKE ANY($2)";
        }
        const queryTransacao = `
            SELECT t.*, c.descricao as categoria_nome 
            FROM transacoes t LEFT JOIN categorias c
            ON t.categoria_id = c.id
            WHERE t.usuario_id = $1
            ${queryFiltro}
        `
        const parametros = filtro ? [id, arrayFiltro] : [id];

        const { rows: transacoes } = await db.query(queryTransacao, parametros);

        return res.status(200).json(transacoes);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const atualizarTransacaoUsuario = async (req, res) => {
    const { idTransacao } = req.params;
    const { id } = req.usuario;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {
        const transacao = await db.query(
            `SELECT * FROM transacoes 
            WHERE id = $1 AND usuario_id = $2`,
            [idTransacao, id]
        )
        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        await db.query(
            `UPDATE transacoes SET 
            descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5
            WHERE id = $6 AND usuario_id = $7`,
            [descricao, valor, data, categoria_id, tipo, idTransacao, id]
        )
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const excluirTransacaoUsuario = async (req, res) => {
    const { idTransacao } = req.params;
    const { id } = req.usuario;

    try {
        const transacao = await db.query(
            `SELECT * FROM transacoes 
            WHERE id = $1 AND usuario_id = $2`,
            [idTransacao, id]
        )
        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        await db.query(
            `DELETE FROM transacoes 
            WHERE id = $1 AND usuario_id = $2`,
            [idTransacao, id]
        )
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharTransacaoUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { idTransacao } = req.params;

    try {
        const { rowCount } = await db.query(
            `SELECT * FROM transacoes 
            WHERE id = $1 AND usuario_id = $2`,
            [idTransacao, id]
        )
        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        const { rows } = await db.query(
            `SELECT t.id, t.tipo, t.descricao, t.valor, t.data, 
            t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            FROM transacoes t LEFT JOIN categorias c
            ON t.categoria_id = c.id
            WHERE t.id = $1 AND t.usuario_id = $2`,
            [idTransacao, id]
        )
        return res.status(200).json(rows[0]);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const cadastrarTransacaoUsuario = async (req, res) => {
    const { id } = req.usuario;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ mensagem: "O campo tipo só recebe valores igual a 'entrada' ou 'saida'." })
    }
    try {
        const { rowCount } = await db.query(
            "SELECT * FROM categorias WHERE id = $1",
            [categoria_id]
        )
        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: "O id da categoria não encontrado." })
        }
        const { rows } = await db.query(
            `INSERT INTO transacoes 
            (tipo, descricao, valor, data, usuario_id, categoria_id)
            VALUES
            ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [tipo, descricao, valor, data, id, categoria_id]
        )
        return res.status(200).json(rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const obterExtratoUsuario = async (req, res) => {
    const { id } = req.usuario;

    try {
        const { rows: resultado } = await db.query(
            `SELECT tipo, SUM (valor) FROM transacoes
            WHERE usuario_id = $1 GROUP BY tipo`,
            [id]
        )
        let entrada = 0;
        let saida = 0;
        for (let item of resultado) {
            if (item.tipo === "entrada") {
                entrada = item.sum;
            }
            if (item.tipo === "saida") {
                saida = item.sum;
            }
        }
        const extrato = { entrada, saida };
        return res.status(200).json(extrato);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    listarTransacoesUsuario,
    atualizarTransacaoUsuario,
    excluirTransacaoUsuario,
    detalharTransacaoUsuario,
    cadastrarTransacaoUsuario,
    obterExtratoUsuario
}