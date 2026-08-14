const express = require('express');
const router = express.Router();
const {
  login,
  register,
  me,
  logout,
  changePassword,
  listUsers,
  updateUser,
} = require('../controllers/authController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.put('/password', protect, changePassword);

// Public sign-up. First account becomes the super admin; the rest wait for
// approval (handled in the controller).
router.post('/register', register);

// Super admin manages accounts and approves/rejects pending sign-ups.
router.get('/users', protect, superAdminOnly, listUsers);
router.patch('/users/:id', protect, superAdminOnly, updateUser);

module.exports = router;
