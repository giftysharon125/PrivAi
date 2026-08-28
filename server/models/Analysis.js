const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    extractedFields: {
      studentStatus: { type: Boolean, default: false },
      name: { type: String, default: '' },
      branch: { type: String, default: '' },
      year: { type: Number, default: 0 },
      cgpa: { type: Number, default: 0 },
      skills: [{ type: String }]
    },
    evidence: {
      branch: { type: String, default: '' },
      year: { type: String, default: '' },
      cgpa: { type: String, default: '' }
    },
    confidence: { type: Number, default: 1.0 },
    aiProvider: { type: String, default: 'gemini' },
    rawResponse: { type: Object, default: {} }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
