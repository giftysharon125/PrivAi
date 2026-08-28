/**
 * Base AI Provider Interface for PrivAI Document Extraction
 */
class AIProviderInterface {
  /**
   * Extract structured student data from document text.
   * @param {string} documentText 
   * @returns {Promise<{
   *   studentStatus: boolean,
   *   name: string,
   *   branch: string,
   *   year: number,
   *   cgpa: number,
   *   skills: string[],
   *   evidence: { branch: string, year: string, cgpa: string },
   *   confidence: number
   * }>}
   */
  async extractInformation(documentText) {
    throw new Error('extractInformation() must be implemented by AI provider.');
  }
}

module.exports = AIProviderInterface;
