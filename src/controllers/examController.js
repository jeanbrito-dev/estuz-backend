const db = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT e.*, s.name AS subject_name, s.color AS subject_color
       FROM exams e
       JOIN subjects s ON s.id = e.subject_id
       WHERE e.user_id = $1
       ORDER BY e.exam_date ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar provas.' });
  }
};

const create = async (req, res) => {
  const { subject_id, title, description, exam_date } = req.body;
  if (!subject_id || !title || !exam_date)
    return res.status(400).json({ error: 'Disciplina, título e data são obrigatórios.' });

  try {
    const subjectRes = await db.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [subject_id, req.userId]
    );
    if (subjectRes.rows.length === 0)
      return res.status(404).json({ error: 'Disciplina não encontrada.' });

    const result = await db.query(
      `INSERT INTO exams (user_id, subject_id, title, description, exam_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.userId, subject_id, title, description || null, exam_date]
    );

    const full = await db.query(
      `SELECT e.*, s.name AS subject_name, s.color AS subject_color
       FROM exams e JOIN subjects s ON s.id = e.subject_id
       WHERE e.id = $1`,
      [result.rows[0].id]
    );
    res.status(201).json(full.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar prova.' });
  }
};

const update = async (req, res) => {
  const { title, description, exam_date, subject_id } = req.body;
  try {
    const existing = await db.query(
      'SELECT id FROM exams WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Prova não encontrada.' });

    const result = await db.query(
      `UPDATE exams SET title=$1, description=$2, exam_date=$3, subject_id=$4
       WHERE id=$5 RETURNING id`,
      [title, description || null, exam_date, subject_id, req.params.id]
    );

    const full = await db.query(
      `SELECT e.*, s.name AS subject_name, s.color AS subject_color
       FROM exams e JOIN subjects s ON s.id = e.subject_id
       WHERE e.id = $1`,
      [result.rows[0].id]
    );
    res.json(full.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar prova.' });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await db.query(
      'SELECT id FROM exams WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Prova não encontrada.' });

    await db.query('DELETE FROM exams WHERE id = $1', [req.params.id]);
    res.json({ message: 'Prova removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover prova.' });
  }
};

module.exports = { getAll, create, update, remove };