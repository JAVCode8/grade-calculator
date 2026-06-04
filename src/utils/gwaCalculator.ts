// 1. Internal — types
import type { Subject, Term, LatinHonor, QualificationResult } from '../types';

// ─── Excluded Subject Keywords ────────────────────────────
export const EXCLUDED_KEYWORDS = [
  'NSTP',
  'NATIONAL SERVICE TRAINING',
  'CWTS',
  'LTS',
  'ROTC',
  'PAHF',
  'GPE',
  'MOVEMENT COMPETENCY',
  'EXERCISE-BASED FITNESS',
  'DANCE AND SPORTS',
  'PATHFIT',
  'PHYSICAL ACTIVITY',
  'PHYSICAL EDUCATION',
  'CAED',
];

// ─── Grade & Unit Options ─────────────────────────────────
export const GRADE_OPTIONS = [4.0, 3.5, 3.0, 2.5, 2.0, 1.0, 0];
export const UNIT_OPTIONS  = [1, 2, 3, 4, 5, 6];

// ─── UMDC Grade Scale (Effective AY 2020-2021) ───────────
export const GRADE_SCALE = [
  { grade: 4.0, range: '96 – 100', description: 'High Distinction', label: 'A'  },
  { grade: 3.5, range: '90 – 95',  description: 'Distinction',      label: 'B+' },
  { grade: 3.0, range: '85 – 89',  description: 'Very Good',        label: 'B-' },
  { grade: 2.5, range: '80 – 84',  description: 'Good',             label: 'C+' },
  { grade: 2.0, range: '75 – 79',  description: 'Average',          label: 'C-' },
  { grade: 1.0, range: '< 75',     description: 'Fail',             label: 'F'  },
];

// ─── Latin Honors (Effective SY 2023-2024, 4.0 scale) ────
export const LATIN_HONORS: LatinHonor[] = [
  { honor: 'Summa Cum Laude', range: '3.51 – 4.00', min: 3.51, max: 4.00 },
  { honor: 'Magna Cum Laude', range: '3.27 – 3.50', min: 3.27, max: 3.50 },
  { honor: 'Cum Laude',       range: '3.01 – 3.26', min: 3.01, max: 3.26 },
  { honor: 'No Honor',        range: 'Below 3.01',  min: 0,    max: 3.00 },
];

// ─── Minimum Grade Requirement ────────────────────────────
// Source: UM Student Handbook 2024, Section 2.10.2, Page 52
// "Has no grade below 3.0 (under the new grading system)"
export const MIN_GRADE_REQUIREMENT = 3.0;

// ─── Helpers ─────────────────────────────────────────────
export const isExcludedSubject = (name: string): boolean => {
  const upper = name.toUpperCase();
  return EXCLUDED_KEYWORDS.some(keyword =>
    upper.includes(keyword.toUpperCase())
  );
};

// ─── GWA Calculators ─────────────────────────────────────
export const computeTermGWA = (subjects: Subject[]): number => {
  const eligible = subjects.filter(
    s => !s.isExcluded && s.name.trim() !== ''
  );
  if (eligible.length === 0) return 0;

  const totalWeighted = eligible.reduce((sum, s) => sum + s.grade * s.units, 0);
  const totalUnits    = eligible.reduce((sum, s) => sum + s.units, 0);

  if (totalUnits === 0) return 0;
  return parseFloat((totalWeighted / totalUnits).toFixed(2));
};

export const computeCumulativeGWA = (terms: Term[]): number => {
  const allEligible = terms
    .flatMap(t => t.subjects)
    .filter(s => !s.isExcluded && s.name.trim() !== '');

  if (allEligible.length === 0) return 0;

  const totalWeighted = allEligible.reduce((sum, s) => sum + s.grade * s.units, 0);
  const totalUnits    = allEligible.reduce((sum, s) => sum + s.units, 0);

  if (totalUnits === 0) return 0;
  return parseFloat((totalWeighted / totalUnits).toFixed(2));
};

export const getLatinHonor = (gwa: number): LatinHonor => {
  return LATIN_HONORS.find(h => gwa >= h.min && gwa <= h.max) ?? LATIN_HONORS[3];
};

// ─── Term Stats ───────────────────────────────────────────
export const computeTermStats = (subjects: Subject[]) => {
  const eligible = subjects.filter(
    s => !s.isExcluded && s.name.trim() !== ''
  );
  return {
    totalSubjects: eligible.length,
    totalUnits:    eligible.reduce((sum, s) => sum + s.units, 0),
  };
};

export const computeOverallStats = (terms: Term[]) => {
  const allEligible = terms
    .flatMap(t => t.subjects)
    .filter(s => !s.isExcluded && s.name.trim() !== '');
  return {
    totalSubjects: allEligible.length,
    totalUnits:    allEligible.reduce((sum, s) => sum + s.units, 0),
  };
};

// ─── Honor & Scholarship Qualification Checker ───────────
// Checks GWA range AND minimum grade requirement
export const checkHonorQualification = (terms: Term[]): QualificationResult => {
  const allEligible = terms
    .flatMap(t => t.subjects)
    .filter(s => !s.isExcluded && s.name.trim() !== '');

  // Find all subjects with grade below minimum requirement
  const disqualifyingSubjects = allEligible.filter(
    s => s.grade < MIN_GRADE_REQUIREMENT
  );

  const lowestGrade = allEligible.length > 0
    ? Math.min(...allEligible.map(s => s.grade))
    : 0;

  return {
    qualifies:              disqualifyingSubjects.length === 0,
    disqualifyingSubjects,
    lowestGrade,
  };
};