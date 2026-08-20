const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/skillController');

router.get('/', ctrl.listPublicSkills);

router.get('/admin/all', protect, staffOnly, ctrl.listAllSkills);
router.post('/', protect, staffOnly, ctrl.createSkill);
router.put('/reorder', protect, staffOnly, ctrl.reorderSkills);
router.put('/:id', protect, staffOnly, ctrl.updateSkill);
router.delete('/:id', protect, staffOnly, ctrl.deleteSkill);

module.exports = router;
