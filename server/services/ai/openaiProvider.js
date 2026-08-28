const AIProviderInterface = require('./aiProviderInterface');

class OpenAIProvider extends AIProviderInterface {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
  }

  async extractInformation(documentText) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured in environment variables.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are an academic document parser for PrivAI. Extract fields into JSON: studentStatus (boolean), name (string), branch (string), year (number), cgpa (number), skills (array of strings), evidence (object with branch, year, cgpa quotes).'
            },
            {
              role: 'user',
              content: documentText
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const resData = await response.json();
      const content = resData.choices[0]?.message?.content || '{}';
      const parsedData = JSON.parse(content);

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
        aiProvider: 'openai'
      };
    } catch (error) {
      console.error('[OpenAI Provider Error]', error.message);
      throw new Error(`OpenAI extraction failed: ${error.message}`);
    }
  }
}

module.exports = OpenAIProvider;
