const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/analyticsController');

// Public: the portfolio records an anonymous page-view.
router.post('/track', ctrl.track);

// Admin only: aggregated analytics for the dashboard.
router.get('/summary', protect, adminOnly, ctrl.summary);

module.exports = router;
