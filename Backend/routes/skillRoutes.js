const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/skillController');

router.get('/', ctrl.listPublicSkills);

router.get('/admin/all', protect, adminOnly, ctrl.listAllSkills);
router.post('/', protect, adminOnly, ctrl.createSkill);
router.put('/reorder', protect, adminOnly, ctrl.reorderSkills);
router.put('/:id', protect, adminOnly, ctrl.updateSkill);
router.delete('/:id', protect, adminOnly, ctrl.deleteSkill);

module.exports = router;
