// 1. Third-party
import { Info } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
interface ExcludedSubject {
  code: string;
  fullName: string;
  variants: string[];
}

// ─── Constants ───────────────────────────────────────────
// Source: UM Student Handbook Section 2.9.2 Page 40
// + actual UMDC subject names from curriculum
const EXCLUDED_SUBJECTS: ExcludedSubject[] = [
  {
    code:     'NSTP 1 & 2',
    fullName: 'National Service Training Program',
    variants: [
      'NATIONAL SERVICE TRAINING PROGRAM 1',
      'NATIONAL SERVICE TRAINING PROGRAM 2',
    ],
  },
  {
    code:     'PAHF 1',
    fullName: 'Movement Competency Training',
    variants: ['PAHF 1', 'MOVEMENT COMPETENCY TRAINING'],
  },
  {
    code:     'PAHF 2',
    fullName: 'Exercise-Based Fitness Activities',
    variants: ['PAHF 2', 'EXERCISE-BASED FITNESS ACTIVITIES'],
  },
  {
    code:     'PAHF 3',
    fullName: 'Dance and Sports 1',
    variants: ['PAHF 3', 'DANCE AND SPORTS 1'],
  },
  {
    code:     'PAHF 4',
    fullName: 'Dance and Sports 2',
    variants: ['PAHF 4', 'DANCE AND SPORTS 2'],
  },
  {
    code:     'CAED 500',
    fullName: 'Career and Personality Development',
    variants: ['CAED 500'],
  },
  {
    code:     'CWTS / LTS / ROTC',
    fullName: 'NSTP Components',
    variants: [
      'Civic Welfare Training Service',
      'Literacy Training Service',
      'Reserve Officers Training Corps',
    ],
  },
];

// ─── Component ───────────────────────────────────────────
export default function PolicyNotice() {
  return (
    <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 md:px-5 py-3.5 border-b border-blush bg-crimson-50">
        <Info size={14} className="text-crimson-700 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-crimson-700">Policy Notice</p>
          <p className="text-[10px] text-crimson-500">
            Per UM Student Handbook — Section 2.9.2, Page 40
          </p>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="px-4 md:px-5 py-3 border-b border-blush">
        <p className="text-xs text-warm-600 leading-relaxed">
          The following subjects are{' '}
          <span className="font-semibold text-crimson-700">
            strictly excluded
          </span>{' '}
          from GWA computation per institutional academic policy. The
          calculator <span className="font-semibold">automatically detects</span>{' '}
          and excludes these subjects when you type their name — whether
          you type the subject code (e.g. PAHF 1) or the full name
          (e.g. DANCE AND SPORTS 1).
        </p>
      </div>

      {/* ── Excluded Subjects List ── */}
      <div className="px-4 md:px-5 py-3 flex flex-col gap-2">
        {EXCLUDED_SUBJECTS.map(subject => (
          <div
            key={subject.code}
            className="rounded-lg border border-crimson-100 bg-crimson-50 overflow-hidden"
          >
            {/* Subject Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-crimson-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-crimson-700">
                  {subject.code}
                </span>
                <span className="text-xs text-warm-700 font-medium">
                  {subject.fullName}
                </span>
              </div>
            </div>

            {/* Variants */}
            <div className="px-3 py-1.5 flex flex-wrap gap-1.5">
              {subject.variants.map(variant => (
                <span
                  key={variant}
                  className="text-[10px] bg-white border border-crimson-200 text-warm-500 px-2 py-0.5 rounded-full"
                >
                  {variant}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 md:px-5 py-3 border-t border-blush">
        <p className="text-[10px] text-warm-400 leading-relaxed">
          📌 Source: UM Student Handbook, Section 2.9.2 —{' '}
          <span className="italic">
            "The following subjects are not included in the computation
            of the GWA: PE, NSTP and CAED 500."
          </span>{' '}
          PAHF subjects are excluded as the modern equivalent of PE
          under the UMDC curriculum.
        </p>
      </div>

    </div>
  );
}