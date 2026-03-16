require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes       = require('./routes/authRoutes');
const subjectRoutes    = require('./routes/subjectRoutes');
const absenceRoutes    = require('./routes/absenceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const examRoutes       = require('./routes/examRoutes');
const passwordRoutes   = require('./routes/passwordRoutes');
const noteRoutes       = require('./routes/noteRoutes');
const survivalRoutes   = require('./routes/survivalRoutes')

const app = express();

// rota para manter o servidor ativo
app.get("/health", (req, res) => {
  res.status(200).send("OK")
});

const rawOrigins = [
  ...(process.env.FRONTEND_URL || '').split(','),
  ...(process.env.TEST_FRONTEND_URL || '').split(','),
].filter(Boolean); // remove strings vazias

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || rawOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/subjects',    subjectRoutes);
app.use('/api/absences',    absenceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams',       examRoutes);
app.use('/api/password',    passwordRoutes);
app.use('/api/notes',       noteRoutes);
app.use('/api/survival',    survivalRoutes);

app.use(express.json({ limit: '5mb' }));

app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🎓 Estuz API rodando!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});