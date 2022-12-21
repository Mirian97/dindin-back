const db = require("../conexaoBanco");

const listarCategorias = async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM categorias");

        return res.status(200).json(rows);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = listarCategorias;