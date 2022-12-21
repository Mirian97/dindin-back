const db = require("../conexaoBanco");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_PASSWORD } = require("../../credenciais");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuario = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    )

    if (usuario.rowCount > 0) {
      return res.status(400).json({ mensagem: "E-mail já está cadastrado." });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuarioCadastrado = await db.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3) RETURNING *`,
      [nome, email, senhaCriptografada]
    )

    if (usuarioCadastrado.rowCount <= 0) {
      return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
    const { senha: _, ...cadastro } = usuarioCadastrado.rows[0];

    return res.status(201).json(cadastro);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

const realizarLogin = async (req, res) => {
  const { email, senha } = req.body;

  if (!email.trim() || !senha.trim()) {
    return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
  }

  try {
    const { rows, rowCount } = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    )
    if (rowCount <= 0) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
    const token = jwt.sign({ id: usuario.id }, TOKEN_PASSWORD, { expiresIn: "8h" });
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
    const { rows, rowCount } = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    )
    if (rowCount > 0 && rows[0].id !== id) {
      return res.status(401).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await db.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4",
      [nome, email, senhaCriptografada, id]
    )
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