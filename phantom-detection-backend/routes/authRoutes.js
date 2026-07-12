const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.all('/register', (req, res) => {
    res.status(405).json({ message: 'Method not allowed. Use POST /api/auth/register to register a new user.' });
});

router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;