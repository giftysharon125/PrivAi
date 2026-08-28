const AIProviderInterface = require('./aiProviderInterface');

class GeminiProvider extends AIProviderInterface {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  async extractInformation(documentText) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }

    try {
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: this.apiKey });

      const prompt = `You are a specialized academic document parser for PrivAI.
Analyze the following student document/certificate text and extract key verification fields into a STRICT JSON object.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY valid raw JSON. Do NOT include markdown code blocks, commentary, or leading/trailing text.
2. Evaluate if the student is currently an active student (studentStatus = true/false).
3. Extract student full name.
4. Extract branch/department (e.g., "CSE", "Computer Science", "ECE", "Mechanical").
5. Extract current academic year as an integer (e.g., 1, 2, 3, or 4). If semester is given (e.g. 6th sem), year = 3.
6. Extract CGPA / GPA as a floating point number (e.g., 8.2).
7. Extract key skills mentioned in the document as an array of strings.
8. Provide textual evidence snippets for branch, year, and cgpa.

EXPECTED JSON SCHEMA:
{
  "studentStatus": true,
  "name": "Student Name",
  "branch": "CSE",
  "year": 3,
  "cgpa": 8.2,
  "skills": ["Skill1", "Skill2"],
  "evidence": {
    "branch": "Exact quote or line from document",
    "year": "Exact quote or line from document",
    "cgpa": "Exact quote or line from document"
  }
}

DOCUMENT TEXT:
${documentText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const textResponse = response.text || '';
      
      // Clean potential JSON markdown wrapping if present
      const cleanedJson = textResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsedData = JSON.parse(cleanedJson);

      return {
        studentStatus: Boolean(parsedData.studentStatus),
        name: String(parsedData.name || 'Unknown Student'),
        branch: String(parsedData.branch || 'Unknown'),
        year: Number(parsedData.year) || 0,
        cgpa: Number(parsedData.cgpa) || 0,
        skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
        evidence: {
          branch: String(parsedData.evidence?.branch || ''),
          year: String(parsedData.evidence?.year || ''),
          cgpa: String(parsedData.evidence?.cgpa || '')
        },
        confidence: 0.95,
        aiProvider: 'gemini'
      };
    } catch (error) {
      console.error('[Gemini Provider Error]', error.message);
      throw new Error(`Gemini AI extraction failed: ${error.message}`);
    }
  }
}

module.exports = GeminiProvider;
