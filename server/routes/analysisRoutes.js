const express = require('express');
const { analyzeDocument, getAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/:documentId', analyzeDocument);
router.get('/:documentId', getAnalysis);

module.exports = router;
