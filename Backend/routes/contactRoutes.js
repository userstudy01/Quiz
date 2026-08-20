const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/contactController');

router.post('/', ctrl.createMessage);

router.get('/', protect, adminOnly, ctrl.listMessages);
router.patch('/:id', protect, adminOnly, ctrl.updateMessage);
router.delete('/:id', protect, adminOnly, ctrl.deleteMessage);

module.exports = router;
