const express = require('express');
const {
  checkEligibility,
  getEligibilityHistory,
  getEligibilityById
} = require('../controllers/eligibilityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/check', checkEligibility);
router.get('/history', getEligibilityHistory);
router.get('/:id', getEligibilityById);

module.exports = router;
