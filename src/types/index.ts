export interface Subject {
  id: string;
  name: string;
  grade: number;
  units: number;
  isExcluded: boolean;
}

export interface Term {
  id: string;
  yearLevel: YearLevel;
  termPeriod: TermPeriod;
}

export type YearLevel = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type TermPeriod = '1st Semester' | '2nd Semester' | 'Summer';

export interface LatinHonor {
  honor: string;
  range: string;
  min: number;
  max: number
}
