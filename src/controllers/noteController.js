const db = require('../db/connection')

const getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC`,
      [req.userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar anotações.' })
  }
}

const getOne = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Anotação não encontrada.' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar anotação.' })
  }
}

const create = async (req, res) => {
  let { title, content } = req.body

  if (!title || !title.trim()) {
    const rand = Math.floor(100 + Math.random() * 900)
    title = `#anotação${rand}`
  }

  try {
    const result = await db.query(
      `INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`,
      [req.userId, title.trim(), content || '']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar anotação.' })
  }
}

const update = async (req, res) => {
  let { title, content } = req.body

  if (!title || !title.trim()) {
    const rand = Math.floor(100 + Math.random() * 900)
    title = `#anotação${rand}`
  }

  try {
    const existing = await db.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    )
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Anotação não encontrada.' })

    const result = await db.query(
      `UPDATE notes SET title = $1, content = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [title.trim(), content || '', req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar anotação.' })
  }
}

const remove = async (req, res) => {
  try {
    const existing = await db.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    )
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Anotação não encontrada.' })

    await db.query('DELETE FROM notes WHERE id = $1', [req.params.id])
    res.json({ message: 'Anotação removida.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao remover anotação.' })
  }
}

module.exports = { getAll, getOne, create, update, remove }