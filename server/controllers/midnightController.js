const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const EligibilityCheck = require('../models/EligibilityCheck');
const {
  generateMidnightZkProof,
  verifyMidnightProof,
  getCompactContractSpec
} = require('../services/privacy/midnightZkService');

// @desc    Generate Midnight ZK Proof Certificate for an Eligibility Check
// @route   POST /api/midnight/generate-proof
// @access  Private
const generateProof = async (req, res, next) => {
  try {
    const { documentId, checkId } = req.body;

    let targetDocId = documentId;
    let checkRecord = null;

    if (checkId) {
      checkRecord = await EligibilityCheck.findOne({
        _id: checkId,
        userId: req.user._id
      });
      if (checkRecord) {
        targetDocId = checkRecord.documentId;
      }
    }

    if (!targetDocId) {
      return res.status(400).json({ success: false, message: 'Please provide documentId or checkId.' });
    }

    const document = await Document.findOne({
      _id: targetDocId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    const analysis = await Analysis.findOne({ documentId: document._id });
    if (!analysis) {
      return res.status(400).json({ success: false, message: 'Document must be analyzed before generating ZK proof.' });
    }

    // Generate Midnight ZK Proof Certificate
    const zkCertificate = await generateMidnightZkProof(analysis.extractedFields, document.fileHash);

    // Update or sync with EligibilityCheck record
    if (checkRecord) {
      checkRecord.privacyProofHash = zkCertificate.proofHash;
      await checkRecord.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Midnight Zero-Knowledge Proof certificate generated successfully.',
      zkCertificate,
      document: {
        id: document._id,
        originalName: document.originalName,
        fileHash: document.fileHash
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Midnight ZK Proof Certificate on-chain ledger mock
// @route   POST /api/midnight/verify-proof
// @access  Public / Private
const verifyProof = async (req, res, next) => {
  try {
    const { proofHash } = req.body;

    if (!proofHash) {
      return res.status(400).json({ success: false, message: 'Please provide proofHash.' });
    }

    const verificationResult = verifyMidnightProof(proofHash);
    return res.json({
      success: true,
      verification: verificationResult
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Midnight Compact Smart Contract source spec
// @route   GET /api/midnight/contract-spec
// @access  Public
const getContractSpec = async (req, res, next) => {
  try {
    const spec = getCompactContractSpec();
    return res.json({
      success: true,
      contractName: 'PrivAIEligibilityContract',
      language: 'Midnight Compact v0.20.0',
      spec
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateProof,
  verifyProof,
  getContractSpec
};
