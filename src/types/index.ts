export interface Subject {
  id: string;
  name: string;
  grade: number;
  units: number;
  isExcluded: boolean;
}

export interface Term {
  id: string;
  yearLevel: string;
  termPeriod: string;
  subjects: Subject[];
}

export type YearLevel = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type TermPeriod = '1st Semester' | '2nd Semester' | 'Summer';

export interface LatinHonor {
  honor: string;
  range: string;
  min: number;
  max: number;
}

export interface ScholarshipCategory {
  category: string;
  label: string;
  gwaRange: string;
  min: number;
  max: number;
  minGrade: string;
  benefits: string[];
  color: {
    card: string;
    badge: string;
    text: string;
    bar: string;
  };
}

export interface QualificationResult {
  qualifies: boolean;
  disqualifyingSubjects: Subject[];
  lowestGrade: number;
}

// ── Scanner Types ─────────────────────────────────────────
export interface ScannedSubject {
  courseNumber: string;
  title:        string;
  grade:        number;
  units:        number;
  termLabel:    string;
  yearLevel:    string;
  termPeriod:   string;
  isExcluded:   boolean;
}