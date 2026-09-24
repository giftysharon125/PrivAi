const express = require('express');
const {
  generateProof,
  verifyProof,
  getContractSpec
} = require('../controllers/midnightController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/generate-proof', protect, generateProof);
router.post('/verify-proof', verifyProof);
router.get('/contract-spec', getContractSpec);

module.exports = router;
