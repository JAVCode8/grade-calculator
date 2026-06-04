// 1. Internal — types
import type { ScholarshipCategory } from '../types';

// ─── Freshman Academic Scholarship ───────────────────────
export const FRESHMAN_SCHOLARSHIPS = [
  {
    label:    'With Highest Honor',
    range:    '98 – 100',
    benefits: ['100% Total Assessment (net of personal items)', '₱1,000 book allowance (board courses)'],
    color:    { card: 'bg-yellow-50 border-yellow-300', badge: 'bg-yellow-100 text-yellow-700', text: 'text-yellow-700' },
  },
  {
    label:    'With High Honor',
    range:    '95 – 97',
    benefits: ['75% Total Assessment (net of personal items)', '₱1,000 book allowance (board courses)'],
    color:    { card: 'bg-blue-50 border-blue-300', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  },
  {
    label:    'With Honors',
    range:    '90 – 94',
    benefits: ['50% Tuition Fee only'],
    color:    { card: 'bg-emerald-50 border-emerald-300', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-700' },
  },
];

// ─── Honor Society & College Scholarship (2nd–4th/5th Year) ──
export const HONOR_SCHOLARSHIPS: ScholarshipCategory[] = [
  {
    category: 'Honor Society',
    label:    'Category A',
    gwaRange: '3.51 – 4.00',
    min:      3.51,
    max:      4.00,
    minGrade: 'No grade below 3.0',
    benefits: ['Full scholarship — free tuition and miscellaneous fees (net of personal items)',
  '₱1,000 worth of textbooks (board courses only)'],
    color: {
      card:  'bg-yellow-50 border-yellow-300',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      text:  'text-yellow-700',
      bar:   'bg-yellow-400',
    },
  },
  {
    category: 'Honor Society',
    label:    'Category B',
    gwaRange: '3.27 – 3.50',
    min:      3.27,
    max:      3.50,
    minGrade: 'No grade below 3.0',
    benefits: ['75% discount in total assessment (net of personal items)',
  '₱1,000 worth of textbooks (board courses only)',],
    color: {
      card:  'bg-blue-50 border-blue-300',
      badge: 'bg-blue-100 text-blue-700 border-blue-300',
      text:  'text-blue-700',
      bar:   'bg-blue-400',
    },
  },
  {
    category: 'College Scholarship',
    label:    'Category C',
    gwaRange: '3.01 – 3.26',
    min:      3.01,
    max:      3.26,
    minGrade: 'No grade below 3.0',
    benefits: ['50% discount in total assessment (net of personal items)'],
    color: {
      card:  'bg-emerald-50 border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      text:  'text-emerald-700',
      bar:   'bg-emerald-400',
    },
  },
  {
    category: 'College Scholarship',
    label:    'Category D',
    gwaRange: '3.00',
    min:      3.00,
    max:      3.00,
    minGrade: 'No grade below 3.0',
    benefits: ['50% discount in tuition fees only'],
    color: {
      card:  'bg-purple-50 border-purple-300',
      badge: 'bg-purple-100 text-purple-700 border-purple-300',
      text:  'text-purple-700',
      bar:   'bg-purple-400',
    },
  },
];