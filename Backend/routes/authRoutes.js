const express = require('express');
const router = express.Router();
const { login, register, me, logout, changePassword } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.put('/password', protect, changePassword);

// Creating accounts is an admin action only — there is no public sign-up.
router.post('/register', protect, adminOnly, register);

module.exports = router;
