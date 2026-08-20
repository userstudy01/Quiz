const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/projectController');

// Public
router.get('/', ctrl.listPublicProjects);
router.get('/meta', ctrl.getProjectFilters);
router.get('/featured', ctrl.getFeaturedProjects);

// Admin (declared before /:slug so they are not swallowed by the slug route)
router.get('/admin/all', protect, adminOnly, ctrl.listAllProjects);
router.get('/admin/:id', protect, adminOnly, ctrl.getProjectById);
router.post('/', protect, adminOnly, ctrl.createProject);
router.put('/:id', protect, adminOnly, ctrl.updateProject);
router.patch('/:id/flags', protect, adminOnly, ctrl.updateProjectFlags);
router.delete('/:id', protect, adminOnly, ctrl.deleteProject);

// Public detail page
router.get('/:slug', ctrl.getProjectBySlug);

module.exports = router;
