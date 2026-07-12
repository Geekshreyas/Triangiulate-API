const express = require('express');
const router = express.Router();
const { getDashboardInsights } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, authorize('adjudicator', 'superadmin'), getDashboardInsights);

module.exports = router;