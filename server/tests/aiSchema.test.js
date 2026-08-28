const { extractionSchema } = require('../services/ai/aiService');

describe('AI Extraction Schema Validation Tests', () => {
  test('Valid extraction payload passes Zod schema', () => {
    const payload = {
      studentStatus: true,
      name: 'Gifty Sharon',
      branch: 'CSE',
      year: 3,
      cgpa: 8.2,
      skills: ['Data Structures', 'Python'],
      evidence: {
        branch: 'CSE department',
        year: '3rd year student',
        cgpa: 'CGPA 8.2'
      },
      confidence: 0.98,
      aiProvider: 'gemini'
    };

    const result = extractionSchema.safeParse(payload);
    expect(result.success).toBe(true);
    expect(result.data.cgpa).toBe(8.2);
  });

  test('Coerces missing optional fields cleanly', () => {
    const minimalPayload = {
      studentStatus: true,
      name: 'Alex'
    };

    const result = extractionSchema.safeParse(minimalPayload);
    expect(result.success).toBe(true);
    expect(result.data.branch).toBe('CSE');
    expect(result.data.year).toBe(0);
    expect(result.data.cgpa).toBe(0);
  });
});
