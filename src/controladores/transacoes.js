const knex = require("../conexao");

const listarTransacoesUsuario = async (req, res) => {
    const { id } = req.usuario;
    let { filtro } = req.query;

    try {
        const transacoes = await knex
            .select("t.*", "c.descricao as categoria_nome")
            .from("transacoes as t")
            .leftJoin("categorias as c", function () {
                this
                    .on("t.categoria_id", "=", "c.id")
            })
            .where({ "t.usuario_id": id });

        if (filtro) {
            const transacoesFiltradas = transacoes.filter(
                (transacao) => filtro.includes(transacao.categoria_nome)
            )
            return res.status(200).json(transacoesFiltradas);
        }
        return res.status(200).json(transacoes);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const atualizarTransacaoUsuario = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { idTransacao } = req.params;

    try {
        const transacaoAtualizada = await knex("transacoes")
            .where({ id: idTransacao })
            .update({
                descricao,
                valor,
                data,
                categoria_id,
                tipo
            });

        if (!transacaoAtualizada) {
            return res.status(400).json({ mensagem: "A transação não foi atualizada." });
        }
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const excluirTransacaoUsuario = async (req, res) => {
    const { idTransacao } = req.params;

    try {
        const transacaoExcluida = await knex("transacoes").where({ id: idTransacao }).del();

        if (!transacaoExcluida) {
            return res.status(400).json({ mensagem: "A transação não foi excluída." });
        }
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharTransacaoUsuario = async (req, res) => {
    const { idTransacao } = req.params;

    try {
        const transacaoDetalhada = await knex
            .select("t.*", "c.descricao as categoria_nome")
            .from("transacoes as t")
            .leftJoin("categorias as c", function () {
                this
                    .on("t.categoria_id", "=", "c.id")
            })
            .where({ "t.id": idTransacao })
            .first();

        return res.status(200).json(transacaoDetalhada);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const cadastrarTransacaoUsuario = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const { id } = req.usuario;

    try {
        const categoria = await knex("categorias").where({ id: categoria_id }).first();

        if (!categoria) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." })
        }

        const [transacaoCadastrada] = await knex("transacoes")
            .insert({
                tipo,
                descricao,
                valor,
                data,
                usuario_id: id,
                categoria_id
            })
            .returning("*");

        if (transacaoCadastrada.length === 0) {
            return res.status(400).json({ mensagem: "A transação não foi cadastrada." });
        }
        transacaoCadastrada.categoria_nome = categoria.descricao;

        return res.status(200).json(transacaoCadastrada);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const obterExtratoUsuario = async (req, res) => {
    const { id } = req.usuario;

    try {
        const extrato = await knex
            .select("tipo")
            .from("transacoes")
            .sum("valor")
            .where({ usuario_id: id })
            .groupBy("tipo");

        let entrada = 0;
        let saida = 0;
        for (let item of extrato) {
            item.tipo === "entrada" ? entrada += item.sum : saida += item.sum;
        }
        return res.status(200).json({ entrada, saida });

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