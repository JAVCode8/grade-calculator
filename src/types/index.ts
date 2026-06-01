export interface Subject {
  id: string;
  name: string;
  grade: number;
  units: number;
  isExcluded: boolean; // NSTP, PAHF auto-excluded
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