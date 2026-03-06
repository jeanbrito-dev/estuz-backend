const db = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, s.name AS subject_name, s.color AS subject_color
       FROM assignments a
       JOIN subjects s ON s.id = a.subject_id
       WHERE a.user_id = $1
       ORDER BY a.deadline ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar trabalhos.' });
  }
};

const create = async (req, res) => {
  const { subject_id, title, description, deadline, status } = req.body;
  if (!subject_id || !title || !deadline)
    return res.status(400).json({ error: 'Disciplina, título e prazo são obrigatórios.' });

  try {
    const subjectRes = await db.query(
      'SELECT id FROM subjects WHERE id = $1 AND user_id = $2',
      [subject_id, req.userId]
    );
    if (subjectRes.rows.length === 0)
      return res.status(404).json({ error: 'Disciplina não encontrada.' });

    const result = await db.query(
      `INSERT INTO assignments (user_id, subject_id, title, description, deadline, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.userId, subject_id, title, description || null, deadline, status || 'pending']
    );

    const full = await db.query(
      `SELECT a.*, s.name AS subject_name, s.color AS subject_color
       FROM assignments a JOIN subjects s ON s.id = a.subject_id
       WHERE a.id = $1`,
      [result.rows[0].id]
    );
    res.status(201).json(full.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar trabalho.' });
  }
};

const update = async (req, res) => {
  const { title, description, deadline, status, subject_id } = req.body;
  try {
    const existing = await db.query(
      'SELECT id FROM assignments WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Trabalho não encontrado.' });

    const result = await db.query(
      `UPDATE assignments SET title=$1, description=$2, deadline=$3, status=$4, subject_id=$5
       WHERE id=$6 RETURNING id`,
      [title, description || null, deadline, status, subject_id, req.params.id]
    );

    const full = await db.query(
      `SELECT a.*, s.name AS subject_name, s.color AS subject_color
       FROM assignments a JOIN subjects s ON s.id = a.subject_id
       WHERE a.id = $1`,
      [result.rows[0].id]
    );
    res.json(full.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar trabalho.' });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await db.query(
      'SELECT id FROM assignments WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Trabalho não encontrado.' });

    await db.query('DELETE FROM assignments WHERE id = $1', [req.params.id]);
    res.json({ message: 'Trabalho removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover trabalho.' });
  }
};

module.exports = { getAll, create, update, remove };