const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/contactController');

router.post('/', ctrl.createMessage);

router.get('/', protect, staffOnly, ctrl.listMessages);
router.patch('/:id', protect, staffOnly, ctrl.updateMessage);
router.delete('/:id', protect, staffOnly, ctrl.deleteMessage);

module.exports = router;
