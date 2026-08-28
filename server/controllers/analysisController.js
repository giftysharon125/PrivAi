const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const { extractStudentData } = require('../services/ai/aiService');

// @desc    Perform AI analysis on document
// @route   POST /api/analysis/:documentId
// @access  Private
const analyzeDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { preferredProvider } = req.body;

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id
    }).select('+extractedText');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    // Call AI Extraction service
    const extractedData = await extractStudentData(document.extractedText, {
      provider: preferredProvider
    });

    // Check if an analysis already exists for this document
    let analysis = await Analysis.findOne({ documentId });

    if (analysis) {
      analysis.extractedFields = {
        studentStatus: extractedData.studentStatus,
        name: extractedData.name,
        branch: extractedData.branch,
        year: extractedData.year,
        cgpa: extractedData.cgpa,
        skills: extractedData.skills
      };
      analysis.evidence = extractedData.evidence;
      analysis.confidence = extractedData.confidence;
      analysis.aiProvider = extractedData.aiProvider;
      analysis.rawResponse = extractedData;
      await analysis.save();
    } else {
      analysis = await Analysis.create({
        documentId: document._id,
        userId: req.user._id,
        extractedFields: {
          studentStatus: extractedData.studentStatus,
          name: extractedData.name,
          branch: extractedData.branch,
          year: extractedData.year,
          cgpa: extractedData.cgpa,
          skills: extractedData.skills
        },
        evidence: extractedData.evidence,
        confidence: extractedData.confidence,
        aiProvider: extractedData.aiProvider,
        rawResponse: extractedData
      });
    }

    // Update document status
    document.status = 'analyzed';
    await document.save();

    return res.status(200).json({
      success: true,
      message: 'AI document extraction completed successfully.',
      analysis: {
        id: analysis._id,
        documentId: analysis.documentId,
        extractedFields: analysis.extractedFields,
        evidence: analysis.evidence,
        confidence: analysis.confidence,
        aiProvider: analysis.aiProvider,
        createdAt: analysis.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analysis by document ID
// @route   GET /api/analysis/:documentId
// @access  Private
const getAnalysis = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const analysis = await Analysis.findOne({
      documentId,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found for this document.' });
    }

    return res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeDocument,
  getAnalysis
};
