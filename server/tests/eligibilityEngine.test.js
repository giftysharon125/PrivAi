const { evaluateEligibility, normalizeBranch } = require('../services/eligibility/rulesEngine');

describe('Deterministic Eligibility Rules Engine Tests', () => {
  test('Branch Normalization handles common variations', () => {
    expect(normalizeBranch('CSE')).toBe('CSE');
    expect(normalizeBranch('Computer Science')).toBe('CSE');
    expect(normalizeBranch('Computer Science and Engineering')).toBe('CSE');
    expect(normalizeBranch('COMP SCIENCE')).toBe('CSE');
    expect(normalizeBranch('Mechanical Engineering')).toBe('MECH');
    expect(normalizeBranch('ECE')).toBe('ECE');
  });

  test('Standard Eligible Student (CSE, Year 3, CGPA 8.2, Active Status) -> ELIGIBLE', () => {
    const studentData = {
      studentStatus: true,
      branch: 'CSE',
      year: 3,
      cgpa: 8.2
    };

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('ELIGIBLE');
    expect(evaluation.requirements.studentStatus).toBe(true);
    expect(evaluation.requirements.branch).toBe(true);
    expect(evaluation.requirements.year).toBe(true);
    expect(evaluation.requirements.cgpa).toBe(true);
  });

  test('Boundary Case: CGPA exactly 7.0 -> ELIGIBLE', () => {
    const studentData = {
      studentStatus: true,
      branch: 'Computer Science and Engineering',
      year: 3,
      cgpa: 7.0
    };

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('ELIGIBLE');
    expect(evaluation.requirements.cgpa).toBe(true);
  });

  test('Boundary Case: CGPA 6.99 (below 7.0) -> NOT_ELIGIBLE', () => {
    const studentData = {
      studentStatus: true,
      branch: 'CSE',
      year: 3,
      cgpa: 6.99
    };

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('NOT_ELIGIBLE');
    expect(evaluation.requirements.cgpa).toBe(false);
  });

  test('Ineligible Branch: ECE (requires CSE) -> NOT_ELIGIBLE', () => {
    const studentData = {
      studentStatus: true,
      branch: 'Electronics and Communication Engineering',
      year: 3,
      cgpa: 8.5
    };

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('NOT_ELIGIBLE');
    expect(evaluation.requirements.branch).toBe(false);
  });

  test('Ineligible Year: Year 2 (requires Year >= 3) -> NOT_ELIGIBLE', () => {
    const studentData = {
      studentStatus: true,
      branch: 'CSE',
      year: 2,
      cgpa: 9.0
    };

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('NOT_ELIGIBLE');
    expect(evaluation.requirements.year).toBe(false);
  });

  test('Inactive Student Status -> NOT_ELIGIBLE', () => {
    const studentData = {
      studentStatus: false,
      branch: 'CSE',
      year: 4,
      cgpa: 8.8
    };

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('NOT_ELIGIBLE');
    expect(evaluation.requirements.studentStatus).toBe(false);
  });

  test('Missing fields default safely to zero/false', () => {
    const studentData = {};

    const evaluation = evaluateEligibility(studentData);
    expect(evaluation.result).toBe('NOT_ELIGIBLE');
    expect(evaluation.requirements.studentStatus).toBe(false);
    expect(evaluation.requirements.branch).toBe(false);
  });
});
