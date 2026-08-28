const fs = require('fs');
const crypto = require('crypto');
const pdfParse = require('pdf-parse');

/**
 * Extracts plain text content and SHA-256 hash from a PDF document.
 * @param {string|Buffer} input - Path to the PDF file or Buffer
 * @returns {Promise<{text: string, fileHash: string, pageCount: number}>}
 */
const extractPdfText = async (input) => {
  try {
    let buffer;
    if (typeof input === 'string') {
      buffer = fs.readFileSync(input);
    } else if (Buffer.isBuffer(input)) {
      buffer = input;
    } else {
      throw new Error('Invalid input format. Expected file path string or Buffer.');
    }

    // Compute SHA-256 hash for document integrity verification
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Parse PDF text
    const data = await pdfParse(buffer);

    // Clean up basic whitespace issues while preserving text structure
    const cleanedText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      text: cleanedText,
      fileHash,
      pageCount: data.numpages || 1
    };
  } catch (error) {
    console.error('[PDF Processor Error]', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

module.exports = { extractPdfText };
