const bcrypt = require('bcryptjs')
const db = require('../db/connection')

const resetPassword = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos.' })

  if (password.length < 6)
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' })

  try {
    const result = await db.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuário não encontrado.' })

    const user = result.rows[0]
    const nameMatch = user.name.toLowerCase().trim() === name.toLowerCase().trim()
    if (!nameMatch)
      return res.status(401).json({ error: 'Nome ou e-mail incorretos.' })

    const hashed = await bcrypt.hash(password, 10)
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id])

    res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao redefinir senha.' })
  }
}

module.exports = { resetPassword }