const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/experienceController');

router.get('/', ctrl.listPublicExperience);

router.get('/admin/all', protect, staffOnly, ctrl.listAllExperience);
router.post('/', protect, staffOnly, ctrl.createExperience);
router.put('/reorder', protect, staffOnly, ctrl.reorderExperience);
router.put('/:id', protect, staffOnly, ctrl.updateExperience);
router.delete('/:id', protect, staffOnly, ctrl.deleteExperience);

module.exports = router;
