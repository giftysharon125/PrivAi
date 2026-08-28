const mongoose = require('mongoose');

const eligibilityCheckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true
    },
    requirementsConfig: {
      requiredBranch: { type: String, default: 'CSE' },
      minimumYear: { type: Number, default: 3 },
      minimumCGPA: { type: Number, default: 7.0 },
      studentStatusRequired: { type: Boolean, default: true }
    },
    requirements: {
      studentStatus: { type: Boolean, required: true },
      branch: { type: Boolean, required: true },
      year: { type: Boolean, required: true },
      cgpa: { type: Boolean, required: true }
    },
    result: {
      type: String,
      enum: ['ELIGIBLE', 'NOT_ELIGIBLE'],
      required: true
    },
    privacyProofHash: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EligibilityCheck', eligibilityCheckSchema);
