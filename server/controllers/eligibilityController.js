const crypto = require('crypto');
const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const EligibilityCheck = require('../models/EligibilityCheck');
const { evaluateEligibility } = require('../services/eligibility/rulesEngine');
const { extractStudentData } = require('../services/ai/aiService');

// @desc    Evaluate internship eligibility against deterministic rules engine
// @route   POST /api/eligibility/check
// @access  Private
const checkEligibility = async (req, res, next) => {
  try {
    const { documentId, customRequirements } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, message: 'Please provide documentId.' });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id
    }).select('+extractedText');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    // Retrieve or run AI extraction
    let analysis = await Analysis.findOne({ documentId: document._id });
    if (!analysis) {
      const extractedData = await extractStudentData(document.extractedText);
      analysis = await Analysis.create({
        documentId: document._id,
        userId: req.user._id,
        extractedFields: extractedData,
        evidence: extractedData.evidence,
        confidence: extractedData.confidence,
        aiProvider: extractedData.aiProvider
      });
      document.status = 'analyzed';
      await document.save();
    }

    // Run deterministic rules engine
    const evaluation = evaluateEligibility(analysis.extractedFields, customRequirements);

    // Compute Simulated ZK Privacy Claim Proof Hash (Placeholder digest for Midnight integration)
    const claimDataString = JSON.stringify({
      userId: req.user._id.toString(),
      documentHash: document.fileHash,
      result: evaluation.result,
      timestamp: Date.now()
    });
    const privacyProofHash = '0x' + crypto.createHash('sha256').update(claimDataString).digest('hex');

    // Create EligibilityCheck record
    const eligibilityCheck = await EligibilityCheck.create({
      userId: req.user._id,
      documentId: document._id,
      analysisId: analysis._id,
      requirementsConfig: evaluation.requirementsConfig,
      requirements: evaluation.requirements,
      result: evaluation.result,
      privacyProofHash
    });

    return res.status(201).json({
      success: true,
      message: 'Eligibility evaluation completed successfully.',
      eligibilityCheck: {
        id: eligibilityCheck._id,
        documentId: eligibilityCheck.documentId,
        result: eligibilityCheck.result,
        requirements: eligibilityCheck.requirements,
        requirementsConfig: eligibilityCheck.requirementsConfig,
        privacyProofHash: eligibilityCheck.privacyProofHash,
        createdAt: eligibilityCheck.createdAt,
        evaluations: evaluation.evaluations,
        extractedValuesPreview: {
          studentStatus: evaluation.evaluatedValues.studentStatus,
          branch: evaluation.evaluatedValues.branch,
          year: evaluation.evaluatedValues.year,
          cgpa: evaluation.evaluatedValues.cgpa
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's eligibility check history
// @route   GET /api/eligibility/history
// @access  Private
const getEligibilityHistory = async (req, res, next) => {
  try {
    const history = await EligibilityCheck.find({ userId: req.user._id })
      .populate('documentId', 'originalName fileHash createdAt')
      .populate('analysisId', 'extractedFields aiProvider confidence')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single eligibility check result by ID
// @route   GET /api/eligibility/:id
// @access  Private
const getEligibilityById = async (req, res, next) => {
  try {
    const check = await EligibilityCheck.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('documentId', 'originalName fileHash createdAt')
      .populate('analysisId', 'extractedFields evidence confidence aiProvider');

    if (!check) {
      return res.status(404).json({ success: false, message: 'Eligibility check result not found.' });
    }

    return res.json({
      success: true,
      check
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkEligibility,
  getEligibilityHistory,
  getEligibilityById
};
