const express = require('express');
const router = express.Router();
const { getAll, getBySubject, register, remove } = require('../controllers/absenceController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getAll);
router.get('/subject/:subjectId', getBySubject);
router.post('/', register);
router.delete('/:id', remove);

module.exports = router;