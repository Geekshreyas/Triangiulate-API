const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, authorize('superadmin'), getAuditLogs);

module.exports = router;