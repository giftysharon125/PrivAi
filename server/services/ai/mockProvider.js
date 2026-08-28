const AIProviderInterface = require('./aiProviderInterface');

class MockProvider extends AIProviderInterface {
  async extractInformation(documentText = '') {
    // Artificial quick processing latency for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const text = documentText.toUpperCase();

    // Pattern matching heuristics for demo documents
    let name = 'Gifty Sharon';
    let branch = 'CSE';
    let year = 3;
    let cgpa = 8.2;
    let studentStatus = true;
    let skills = ['Data Structures', 'Python', 'React', 'Algorithms'];

    // Check if document explicitly contains negative / different criteria
    if (text.includes('MECH') || text.includes('MECHANICAL')) {
      branch = 'Mechanical Engineering';
    } else if (text.includes('ECE') || text.includes('ELECTRONICS')) {
      branch = 'ECE';
    } else if (text.includes('CIVIL')) {
      branch = 'Civil Engineering';
    } else if (text.includes('CSE') || text.includes('COMPUTER SCIENCE')) {
      branch = 'CSE';
    }

    // CGPA Extraction heuristic
    const cgpaMatch = documentText.match(/CGPA[:\s]+([0-9.]+)/i) || documentText.match(/GPA[:\s]+([0-9.]+)/i);
    if (cgpaMatch && cgpaMatch[1]) {
      cgpa = parseFloat(cgpaMatch[1]);
    } else if (text.includes('LOW_CGPA') || text.includes('CGPA: 6.2')) {
      cgpa = 6.2;
    }

    // Year Extraction heuristic
    const yearMatch = documentText.match(/YEAR[:\s]+([0-4])/i) || documentText.match(/([1-4])(?:ST|ND|RD|TH)?\s+YEAR/i);
    if (yearMatch && yearMatch[1]) {
      year = parseInt(yearMatch[1], 10);
    } else if (text.includes('2ND YEAR') || text.includes('YEAR: 2')) {
      year = 2;
    }

    // Name heuristic
    const nameMatch = documentText.match(/NAME[:\s]+([A-Za-z\s]+)/i) || documentText.match(/STUDENT[:\s]+([A-Za-z\s]+)/i);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim().split('\n')[0];
    }

    return {
      studentStatus,
      name,
      branch,
      year,
      cgpa,
      skills,
      evidence: {
        branch: `Extracted '${branch}' from certificate text context`,
        year: `Identified academic year ${year} from enrollment details`,
        cgpa: `Verified cumulative GPA score of ${cgpa} from transcript summary`
      },
      confidence: 0.98,
      aiProvider: 'demo-mock'
    };
  }
}

module.exports = MockProvider;
