import type { Subject, Term, LatinHonor } from '../types';

export const EXCLUDED_KEYWORDS = ['NSTP', 'PAHF', 'ROTC', 'CWTS', 'LTS'];

export const isExcludedSubject = (name: string): boolean => {
  const upper = name.toUpperCase();
  return EXCLUDED_KEYWORDS.some(keyword => upper.includes(keyword));
};

export const computeTermGWA = (subjects: Subject[]): number => {
  const eligible = subjects.filter(s => !s.isExcluded && s.name.trim() !== '');
  if (eligible.length === 0) return 0;

  const totalWeighted = eligible.reduce((sum, s) => sum + s.grade * s.units, 0);
  const totalUnits = eligible.reduce((sum, s) => sum + s.units, 0);

  if (totalUnits === 0) return 0;
  return parseFloat((totalWeighted / totalUnits).toFixed(2));
};

export const computeCumulativeGWA = (terms: Term[]): number => {
  const allEligible = terms
    .flatMap(t => t.subjects)
    .filter(s => !s.isExcluded && s.name.trim() !== '');

  if (allEligible.length === 0) return 0;

  const totalWeighted = allEligible.reduce((sum, s) => sum + s.grade * s.units, 0);
  const totalUnits = allEligible.reduce((sum, s) => sum + s.units, 0);

  if (totalUnits === 0) return 0;
  return parseFloat((totalWeighted / totalUnits).toFixed(2));
};

export const LATIN_HONORS: LatinHonor[] = [
  { honor: 'Summa Cum Laude', range: '3.75 – 4.00', min: 3.75, max: 4.00 },
  { honor: 'Magna Cum Laude', range: '3.50 – 3.74', min: 3.50, max: 3.74 },
  { honor: 'Cum Laude',       range: '3.25 – 3.49', min: 3.25, max: 3.49 },
  { honor: 'No Honor',        range: 'Below 3.25',  min: 0,    max: 3.24 },
];

export const getLatinHonor = (gwa: number): LatinHonor => {
  return LATIN_HONORS.find(h => gwa >= h.min && gwa <= h.max) ?? LATIN_HONORS[3];
};

export const GRADE_OPTIONS = [4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0];
export const UNIT_OPTIONS  = [1, 2, 3, 4, 5, 6];