const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/experienceController');

router.get('/', ctrl.listPublicExperience);

router.get('/admin/all', protect, adminOnly, ctrl.listAllExperience);
router.post('/', protect, adminOnly, ctrl.createExperience);
router.put('/reorder', protect, adminOnly, ctrl.reorderExperience);
router.put('/:id', protect, adminOnly, ctrl.updateExperience);
router.delete('/:id', protect, adminOnly, ctrl.deleteExperience);

module.exports = router;
