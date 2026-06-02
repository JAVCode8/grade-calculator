// 1. Third-party
import { Info } from 'lucide-react';

// ─── Component ───────────────────────────────────────────
export default function PolicyNotice() {
  const excludedSubjects = [
    {
      code:     'NSTP',
      fullName: 'National Service Training Program',
      note:     'NSTP 1 & NSTP 2',
    },
    {
      code:     'PAHF',
      fullName: 'Movement Competency Training',
      note:     'Physical Activity toward Health and Fitness',
    },
    {
      code:     'PE',
      fullName: 'Physical Education',
      note:     'All PE subjects',
    },
    {
      code:     'CAED 500',
      fullName: 'Computer-Aided Engineering Design',
      note:     'UM specific excluded subject',
    },
    {
      code:     'CWTS / LTS / ROTC',
      fullName: 'NSTP Components',
      note:     'Civic Welfare Training Service, Literacy Training Service, Reserve Officers Training Corps',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 md:px-5 py-3.5 border-b border-blush bg-crimson-50">
        <Info size={14} className="text-crimson-700 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-crimson-700">Policy Notice</p>
          <p className="text-[10px] text-crimson-500">
            Per UM Student Handbook — Section 2.9.2, Page 40
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 md:px-5 py-3 border-b border-blush">
        <p className="text-xs text-warm-600 leading-relaxed">
          The following subjects are <span className="font-semibold text-crimson-700">strictly excluded</span> from
          the GWA computation as per institutional academic policy. The calculator
          automatically detects and filters these entries when you type the subject name.
        </p>
      </div>

      {/* Excluded Subjects List */}
      <div className="px-4 md:px-5 py-3 flex flex-col gap-2">
        {excludedSubjects.map(subject => (
          <div
            key={subject.code}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-3 py-2.5 bg-crimson-50 border border-crimson-100 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-crimson-700 shrink-0">
                {subject.code}
              </span>
              <span className="text-xs text-warm-700 font-medium">
                {subject.fullName}
              </span>
            </div>
            <span className="text-[10px] text-warm-400 sm:text-right">
              {subject.note}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="px-4 md:px-5 py-3 border-t border-blush">
        <p className="text-[10px] text-warm-400 leading-relaxed">
          📌 Source: UM Student Handbook, Section 2.9.2 — "The following subjects are not
          included in the computation of the GWA: <span className="font-medium">PE, NSTP and CAED 500.</span>"
          PAHF (Movement Competency Training) is excluded as the modern equivalent of PE.
        </p>
      </div>

    </div>
  );
}