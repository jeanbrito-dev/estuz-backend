const express = require('express');
const router = express.Router();
const { register, login, me, updateAvatar } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.put('/avatar', auth, updateAvatar);

module.exports = router;