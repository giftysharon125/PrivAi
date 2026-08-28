const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileHash: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      default: 'application/pdf'
    },
    extractedText: {
      type: String,
      select: false // Do not expose in normal queries for privacy
    },
    status: {
      type: String,
      enum: ['uploaded', 'analyzed', 'error'],
      default: 'uploaded'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Document', documentSchema);
