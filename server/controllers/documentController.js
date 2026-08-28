const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Document = require('../models/Document');
const { extractPdfText } = require('../services/documents/pdfProcessor');

// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid PDF document.' });
    }

    const filePath = req.file.path;
    const { text, fileHash } = await extractPdfText(filePath);

    const document = await Document.create({
      userId: req.user._id,
      originalName: req.file.originalname,
      fileHash,
      fileSize: req.file.size,
      filePath: req.file.filename,
      mimeType: req.file.mimetype,
      extractedText: text,
      status: 'uploaded'
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        originalName: document.originalName,
        fileSize: document.fileSize,
        fileHash: document.fileHash,
        status: document.status,
        createdAt: document.createdAt,
        textPreview: text.substring(0, 300) + (text.length > 300 ? '...' : '')
      }
    });
  } catch (error) {
    // Cleanup uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get document details by ID
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('+extractedText');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    return res.json({
      success: true,
      document: {
        id: document._id,
        originalName: document.originalName,
        fileSize: document.fileSize,
        fileHash: document.fileHash,
        status: document.status,
        createdAt: document.createdAt,
        extractedText: document.extractedText
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a sample demo document for instant 1-click testing
// @route   POST /api/documents/demo-sample
// @access  Private
const createSampleDocument = async (req, res, next) => {
  try {
    const type = req.body.sampleType || 'eligible_cse'; // 'eligible_cse', 'ineligible_cgpa', 'ineligible_year'
    
    let sampleName = 'Official_Academic_Transcript_GiftySharon.pdf';
    let sampleText = `NATIONAL INSTITUTE OF TECHNOLOGY
ACADEMIC TRANSCRIPT & ENROLLMENT CERTIFICATE

Student Name: Gifty Sharon
Roll Number: 21CSE084
Program: Bachelor of Technology (B.Tech)
Branch / Department: Computer Science and Engineering (CSE)
Current Year of Study: 3rd Year (Semester 6)
Enrollment Status: Active Regular Student

SEMESTER CUMULATIVE SCORE SUMMARY:
Semester 1 GPA: 8.00
Semester 2 GPA: 8.10
Semester 3 GPA: 8.25
Semester 4 GPA: 8.30
Semester 5 GPA: 8.15
CUMULATIVE GRADE POINT AVERAGE (CGPA): 8.20 / 10.0

KEY TECHNICAL SKILLS ACQUIRED:
Data Structures, Algorithms, Systems Programming, Database Systems, Web Development

Verification Authority: Controller of Examinations
Issued: July 2026`;

    if (type === 'ineligible_cgpa') {
      sampleName = 'Academic_Transcript_Alex_LowerCGPA.pdf';
      sampleText = `METROPOLITAN UNIVERSITY OF TECHNOLOGY
ACADEMIC MARKSHEET

Student Name: Alex Morgan
Roll Number: 21CSE102
Branch: Computer Science & Engineering (CSE)
Year of Study: Year 3
Student Status: Active Student

CUMULATIVE GRADE POINT AVERAGE (CGPA): 6.40 / 10.0
Status: Promoted to next academic session.`;
    } else if (type === 'ineligible_year') {
      sampleName = 'Academic_Certificate_Rohan_2ndYear.pdf';
      sampleText = `INSTITUTE OF COMPUTER SCIENCE
STUDENT CERTIFICATE

Student Name: Rohan Verma
Branch: CSE (Computer Science & Engineering)
Current Academic Year: 2nd Year (Semester 4)
Student Status: Active Student
CGPA: 8.50 / 10.0`;
    }

    const fileHash = crypto.createHash('sha256').update(sampleText).digest('hex');

    const document = await Document.create({
      userId: req.user._id,
      originalName: sampleName,
      fileHash,
      fileSize: Buffer.byteLength(sampleText, 'utf8'),
      filePath: 'sample-demo.pdf',
      mimeType: 'application/pdf',
      extractedText: sampleText,
      status: 'uploaded'
    });

    return res.status(201).json({
      success: true,
      message: 'Sample demo document loaded successfully.',
      document: {
        id: document._id,
        originalName: document.originalName,
        fileSize: document.fileSize,
        fileHash: document.fileHash,
        status: document.status,
        createdAt: document.createdAt,
        textPreview: sampleText
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  createSampleDocument
};
