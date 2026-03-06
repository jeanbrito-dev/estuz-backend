const db = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, s.name AS subject_name, s.color AS subject_color, s.max_absences,
        (SELECT COUNT(*)::int FROM absences WHERE subject_id = a.subject_id AND user_id = a.user_id) AS total_absences
       FROM absences a
       JOIN subjects s ON s.id = a.subject_id
       WHERE a.user_id = $1
       ORDER BY a.date DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar faltas.' });
  }
};

const getBySubject = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, s.name AS subject_name, s.max_absences
       FROM absences a
       JOIN subjects s ON s.id = a.subject_id
       WHERE a.subject_id = $1 AND a.user_id = $2
       ORDER BY a.date DESC`,
      [req.params.subjectId, req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar faltas.' });
  }
};

const register = async (req, res) => {
  const { subject_id, date, note } = req.body;
  if (!subject_id || !date)
    return res.status(400).json({ error: 'Disciplina e data são obrigatórios.' });

  try {
    const subjectRes = await db.query(
      'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
      [subject_id, req.userId]
    );
    if (subjectRes.rows.length === 0)
      return res.status(404).json({ error: 'Disciplina não encontrada.' });

    const subject = subjectRes.rows[0];

    const insertRes = await db.query(
      'INSERT INTO absences (subject_id, user_id, date, note) VALUES ($1, $2, $3, $4) RETURNING id',
      [subject_id, req.userId, date, note || null]
    );

    const countRes = await db.query(
      'SELECT COUNT(*)::int AS total FROM absences WHERE subject_id = $1 AND user_id = $2',
      [subject_id, req.userId]
    );
    const totalAbsences = countRes.rows[0].total;
    const remaining = subject.max_absences - totalAbsences;

    res.status(201).json({
      id: insertRes.rows[0].id,
      subject_id, date, note,
      total_absences: totalAbsences,
      remaining_absences: remaining,
      warning: remaining <= 2 ? `⚠️ Apenas ${remaining} falta(s) restante(s)!` : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar falta.' });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await db.query(
      'SELECT id FROM absences WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Falta não encontrada.' });

    await db.query('DELETE FROM absences WHERE id = $1', [req.params.id]);
    res.json({ message: 'Falta removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover falta.' });
  }
};

module.exports = { getAll, getBySubject, register, remove };