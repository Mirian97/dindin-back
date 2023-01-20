const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const emailExistente = await knex("usuarios").where({ email }).first();

    if (emailExistente) {
      return res.status(400).json({ mensagem: "E-mail já está cadastrado." });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioCadastrado = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: senhaCriptografada
      })
      .returning("*");

    if (usuarioCadastrado.length === 0) {
      return res.status(400).json({ mensagem: "O usuário não foi cadastrado." });
    }
    const { senha: _, ...dadosUsuario } = usuarioCadastrado[0];

    return res.status(201).json(dadosUsuario);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

const realizarLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {

    const usuario = await knex("usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
    const token = jwt.sign({ id: usuario.id }, process.env.TOKEN_PASSWORD, { expiresIn: "8h" });

    const { senha: _, ...usuarioLogado } = usuario;

    return res.status(200).json({ usuario: usuarioLogado, token })

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

const detalharPerfilUsuario = (req, res) => {
  return res.status(200).json(req.usuario)
}

const atualizarPerfilUsuario = async (req, res) => {
  const { id } = req.usuario;
  const { nome, email, senha } = req.body;

  try {
    const usuario = await knex("usuarios").where({ id }).first();

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    if (usuario.email && usuario.id !== id) {
      return res.status(401).json({
        mensagem: "O e-mail informado já está sendo utilizado por outro usuário."
      })
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioAtualizado = await knex("usuarios")
      .where({ id })
      .update({
        nome,
        email,
        senha: senhaCriptografada
      }).debug()

    if (!usuarioAtualizado) {
      return res.status(400).json("O usuario não foi atualizado");
    }
    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

module.exports = {
  cadastrarUsuario,
  realizarLogin,
  detalharPerfilUsuario,
  atualizarPerfilUsuario
};