/**
 * Deterministic Eligibility Rules Engine for PrivAI.
 * 
 * IMPORTANT ARCHITECTURAL DESIGN:
 * The AI extracts structured facts from documents, but the AI DOES NOT decide eligibility.
 * This rules engine deterministically evaluates extracted facts against predefined criteria.
 * This guarantees consistency, testability, and ZK-proof generation readiness for Midnight.
 */

const DEFAULT_REQUIREMENTS = {
  requiredBranch: 'CSE',
  minimumYear: 3,
  minimumCGPA: 7.0,
  studentStatusRequired: true
};

/**
 * Normalizes branch name to standard codes (e.g. "Computer Science" -> "CSE")
 * @param {string} branchStr 
 * @returns {string}
 */
const normalizeBranch = (branchStr) => {
  if (!branchStr) return '';
  const cleaned = branchStr.trim().toUpperCase();
  if (cleaned.includes('ECE') || cleaned.includes('ELECTRONICS')) return 'ECE';
  if (cleaned.includes('MECH') || cleaned.includes('MECHANICAL')) return 'MECH';
  if (cleaned.includes('CIVIL')) return 'CIVIL';
  if (cleaned.includes('IT') || cleaned.includes('INFORMATION TECH')) return 'IT';
  if (
    cleaned.includes('CSE') ||
    cleaned.includes('COMPUTER SCIENCE') ||
    cleaned.includes('COMP SCIENCE') ||
    /\bCS\b/.test(cleaned)
  ) {
    return 'CSE';
  }
  return cleaned;
};

/**
 * Evaluates extracted student information against eligibility rules.
 * 
 * @param {Object} extractedData Extracted student data from AI service
 * @param {boolean} extractedData.studentStatus Active student enrollment status
 * @param {string} extractedData.branch Academic branch/department
 * @param {number|string} extractedData.year Current academic year (e.g., 3)
 * @param {number|string} extractedData.cgpa Cumulative GPA (e.g., 8.2)
 * @param {Object} [customRequirements] Optional override for requirement criteria
 * @returns {Object} Deterministic evaluation result with individual boolean flags and overall status
 */
const evaluateEligibility = (extractedData = {}, customRequirements = {}) => {
  const reqs = { ...DEFAULT_REQUIREMENTS, ...customRequirements };

  // 1. Student Status Check
  const studentStatusPassed = reqs.studentStatusRequired
    ? Boolean(extractedData.studentStatus)
    : true;

  // 2. Branch Check (Normalized matching)
  const normalizedExtractedBranch = normalizeBranch(extractedData.branch);
  const normalizedRequiredBranch = normalizeBranch(reqs.requiredBranch);
  const branchPassed = normalizedExtractedBranch === normalizedRequiredBranch;

  // 3. Academic Year Check (Parsed numeric comparison)
  const parsedYear = typeof extractedData.year === 'number'
    ? extractedData.year
    : parseInt(String(extractedData.year || '0').replace(/\D/g, ''), 10) || 0;
  
  const yearPassed = parsedYear >= reqs.minimumYear;

  // 4. CGPA Check (Float comparison rounded to 2 decimals for precision)
  const parsedCGPA = typeof extractedData.cgpa === 'number'
    ? extractedData.cgpa
    : parseFloat(String(extractedData.cgpa || '0').replace(/[^0-9.]/g, '')) || 0;

  // Precise floating point check (e.g., 6.999 is not 7.0, 7.00 is 7.0)
  const cgpaPassed = Number(parsedCGPA.toFixed(2)) >= Number(reqs.minimumCGPA.toFixed(2));

  // Overall Result
  const requirements = {
    studentStatus: studentStatusPassed,
    branch: branchPassed,
    year: yearPassed,
    cgpa: cgpaPassed
  };

  const isEligible = studentStatusPassed && branchPassed && yearPassed && cgpaPassed;

  return {
    result: isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE',
    requirements,
    requirementsConfig: reqs,
    evaluatedValues: {
      studentStatus: Boolean(extractedData.studentStatus),
      branch: extractedData.branch || 'Unknown',
      normalizedBranch: normalizedExtractedBranch,
      year: parsedYear,
      cgpa: parsedCGPA
    },
    evaluations: {
      studentStatus: {
        pass: studentStatusPassed,
        rule: `Student status required = ${reqs.studentStatusRequired}`,
        actual: Boolean(extractedData.studentStatus)
      },
      branch: {
        pass: branchPassed,
        rule: `Branch must match '${reqs.requiredBranch}'`,
        actual: extractedData.branch || 'None'
      },
      year: {
        pass: yearPassed,
        rule: `Year must be >= ${reqs.minimumYear}`,
        actual: parsedYear
      },
      cgpa: {
        pass: cgpaPassed,
        rule: `CGPA must be >= ${reqs.minimumCGPA}`,
        actual: parsedCGPA
      }
    }
  };
};

module.exports = {
  evaluateEligibility,
  normalizeBranch,
  DEFAULT_REQUIREMENTS
};
