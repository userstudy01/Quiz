const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.get('/', getProfile);
router.put('/', protect, staffOnly, updateProfile);

module.exports = router;
