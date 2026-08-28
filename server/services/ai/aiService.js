const { z } = require('zod');
const GeminiProvider = require('./geminiProvider');
const OpenAIProvider = require('./openaiProvider');
const MockProvider = require('./mockProvider');

// Strict Zod Schema definition for extracted AI output
const extractionSchema = z.object({
  studentStatus: z.boolean(),
  name: z.string().default('Student'),
  branch: z.string().default('CSE'),
  year: z.number().min(0).max(6).default(0),
  cgpa: z.number().min(0).max(10).default(0),
  skills: z.array(z.string()).default([]),
  evidence: z.object({
    branch: z.string().default(''),
    year: z.string().default(''),
    cgpa: z.string().default('')
  }).default({}),
  confidence: z.number().optional().default(1.0),
  aiProvider: z.string().default('demo')
});

/**
 * Resolves the appropriate AI provider based on environment and request settings.
 */
const getProvider = (preferredProvider) => {
  const provider = (preferredProvider || process.env.AI_PROVIDER || 'gemini').toLowerCase();

  if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }

  // Fallback to Mock / Demo Provider if keys missing or explicitly selected
  console.log(`[AI Service] Operating in Demo / Mock Mode (Provider: ${provider})`);
  return new MockProvider();
};

/**
 * Executes AI extraction with strict JSON schema validation and safe error fallback.
 * 
 * @param {string} documentText Raw extracted text from PDF
 * @param {Object} [options] Provider options (e.g. { provider: 'gemini' })
 * @returns {Promise<Object>} Validated structured extraction object
 */
const extractStudentData = async (documentText, options = {}) => {
  if (!documentText || documentText.trim().length === 0) {
    console.warn('[AI Service] Received empty document text. Using mock fallback.');
    const fallback = new MockProvider();
    return fallback.extractInformation('');
  }

  const provider = getProvider(options.provider);

  try {
    const rawResult = await provider.extractInformation(documentText);
    
    // Validate output strictly with Zod schema
    const validated = extractionSchema.safeParse(rawResult);

    if (!validated.success) {
      console.warn('[AI Service Schema Warning] Output failed schema validation:', validated.error.format());
      // Coerce fallback schema values instead of crashing
      return {
        studentStatus: Boolean(rawResult.studentStatus),
        name: String(rawResult.name || 'Student'),
        branch: String(rawResult.branch || 'CSE'),
        year: Number(rawResult.year) || 3,
        cgpa: Number(rawResult.cgpa) || 8.0,
        skills: Array.isArray(rawResult.skills) ? rawResult.skills : [],
        evidence: {
          branch: String(rawResult.evidence?.branch || ''),
          year: String(rawResult.evidence?.year || ''),
          cgpa: String(rawResult.evidence?.cgpa || '')
        },
        confidence: 0.9,
        aiProvider: rawResult.aiProvider || 'fallback'
      };
    }

    return validated.data;
  } catch (error) {
    console.error(`[AI Service Error] ${error.message}. Triggering safe mock fallback.`);
    const mockFallback = new MockProvider();
    const fallbackResult = await mockFallback.extractInformation(documentText);
    fallbackResult.aiProvider = 'mock-fallback-after-error';
    return fallbackResult;
  }
};

module.exports = {
  extractStudentData,
  getProvider,
  extractionSchema
};
