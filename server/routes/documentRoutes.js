const express = require('express');
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  createSampleDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('document'), uploadDocument);
router.post('/demo-sample', createSampleDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);

module.exports = router;
