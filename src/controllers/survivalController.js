const db = require('../db/connection')

const getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sc.*, e.title as exam_title
       FROM survival_checklist sc
       JOIN exams e ON e.id = sc.exam_id
       WHERE sc.user_id = $1
       ORDER BY sc.created_at ASC`,
      [req.userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar checklist.' })
  }
}

const create = async (req, res) => {
  const { exam_id, item } = req.body
  if (!exam_id || !item?.trim())
    return res.status(400).json({ error: 'exam_id e item são obrigatórios.' })

  try {
    // Garante que a prova pertence ao usuário logado
    const examCheck = await db.query(
      'SELECT id FROM exams WHERE id = $1 AND user_id = $2',
      [exam_id, req.userId]
    )
    if (examCheck.rows.length === 0)
      return res.status(403).json({ error: 'Acesso negado.' })

    const result = await db.query(
      `INSERT INTO survival_checklist (user_id, exam_id, item)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.userId, exam_id, item.trim()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar item.' })
  }
}

const update = async (req, res) => {
  const { done } = req.body
  if (typeof done !== 'boolean')
    return res.status(400).json({ error: 'Campo done é obrigatório.' })

  try {
    // Garante que o item pertence ao usuário logado
    const check = await db.query(
      'SELECT id FROM survival_checklist WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    )
    if (check.rows.length === 0)
      return res.status(403).json({ error: 'Acesso negado.' })

    const result = await db.query(
      `UPDATE survival_checklist SET done = $1 WHERE id = $2 RETURNING *`,
      [done, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar item.' })
  }
}

const remove = async (req, res) => {
  try {
    // Garante que o item pertence ao usuário logado
    const check = await db.query(
      'SELECT id FROM survival_checklist WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    )
    if (check.rows.length === 0)
      return res.status(403).json({ error: 'Acesso negado.' })

    await db.query('DELETE FROM survival_checklist WHERE id = $1', [req.params.id])
    res.json({ message: 'Item removido.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao remover item.' })
  }
}

module.exports = { getAll, create, update, remove }