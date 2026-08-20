const express = require('express');
const router = express.Router();
const { protect, staffOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/projectController');

// Public
router.get('/', ctrl.listPublicProjects);
router.get('/meta', ctrl.getProjectFilters);
router.get('/featured', ctrl.getFeaturedProjects);

// Admin (declared before /:slug so they are not swallowed by the slug route)
router.get('/admin/all', protect, staffOnly, ctrl.listAllProjects);
router.get('/admin/:id', protect, staffOnly, ctrl.getProjectById);
router.post('/', protect, staffOnly, ctrl.createProject);
router.put('/:id', protect, staffOnly, ctrl.updateProject);
router.patch('/:id/flags', protect, staffOnly, ctrl.updateProjectFlags);
router.delete('/:id', protect, staffOnly, ctrl.deleteProject);

// Public detail page
router.get('/:slug', ctrl.getProjectBySlug);

module.exports = router;
