const express = require('express');
const router = express.Router();
const { submitClaim, getClaims, getClaimById, updateClaimStatus, getMyClaims, deleteClaim, updateClaim } = require('../controllers/claimController');
const { protect, authorize } = require("../middlewares/authMiddleware");
const { validateClaimInput } = require('../middlewares/validateClaim');
const upload = require('../middlewares/uploadMiddleware');

router.post('/submit', protect, authorize('hospital'), upload.single('document'), validateClaimInput, submitClaim);
router.get('/my-claims', protect, authorize('hospital'), getMyClaims);

router.get('/', protect, authorize('hospital', 'adjudicator', 'superadmin'), getClaims);
router.get('/:id', protect, authorize('hospital', 'adjudicator', 'superadmin'), getClaimById);
router.put('/:id/status', protect, authorize('adjudicator', 'superadmin'), updateClaimStatus);

router.delete('/:id', protect, authorize('hospital', 'superadmin'), deleteClaim);
router.put('/:id/edit', protect, authorize('hospital'), upload.single('document'), validateClaimInput, updateClaim);

module.exports = router;