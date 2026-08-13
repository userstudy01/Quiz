const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.get('/', getProfile);
router.put('/', protect, adminOnly, updateProfile);

module.exports = router;
