const db = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*,
        COUNT(a.id)::int AS absence_count,
        (s.max_absences - COUNT(a.id)::int) AS remaining_absences
       FROM subjects s
       LEFT JOIN absences a ON a.subject_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id
       ORDER BY s.name`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar disciplinas.' });
  }
};

const getOne = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Disciplina não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar disciplina.' });
  }
};

const create = async (req, res) => {
  const { name, professor, max_absences, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });
  try {
    const result = await db.query(
      `INSERT INTO subjects (user_id, name, professor, max_absences, color)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.userId, name, professor || null, max_absences || 0, color || '#6366f1']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar disciplina.' });
  }
};

const update = async (req, res) => {
  const { name, professor, max_absences, color } = req.body;
  try {
    const existing = await db.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Disciplina não encontrada.' });

    const result = await db.query(
      `UPDATE subjects SET name = $1, professor = $2, max_absences = $3, color = $4
       WHERE id = $5 RETURNING *`,
      [name, professor || null, max_absences || 0, color || '#6366f1', req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar disciplina.' });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await db.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Disciplina não encontrada.' });

    await db.query('DELETE FROM subjects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Disciplina removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover disciplina.' });
  }
};

module.exports = { getAll, getOne, create, update, remove };