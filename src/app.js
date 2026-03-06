require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes       = require('./routes/authRoutes');
const subjectRoutes    = require('./routes/subjectRoutes');
const absenceRoutes    = require('./routes/absenceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const examRoutes       = require('./routes/examRoutes');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
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