// 1. Third-party
import { Trophy, GraduationCap, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

// 2. Internal — constants
import { HONOR_SCHOLARSHIPS, FRESHMAN_SCHOLARSHIPS } from '../../constants/scholarship';

// 3. Internal — utils
import { LATIN_HONORS, GRADE_SCALE } from '../../utils/gwaCalculator';

// ─── Types ───────────────────────────────────────────────
interface HonorsPageProps {
  currentGWA: number;
}

// ─── Helpers ─────────────────────────────────────────────
const getLatinHonorStyle = (honor: string) => {
  switch (honor) {
    case 'Summa Cum Laude': return { card: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700 border-yellow-300', bar: 'bg-yellow-400' };
    case 'Magna Cum Laude': return { card: 'bg-blue-50 border-blue-300',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700 border-blue-300',     bar: 'bg-blue-400'   };
    case 'Cum Laude':       return { card: 'bg-emerald-50 border-emerald-300', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', bar: 'bg-emerald-400' };
    default:                return { card: 'bg-warm-50 border-warm-200',   text: 'text-warm-500',   badge: 'bg-warm-100 text-warm-500 border-warm-200',       bar: 'bg-warm-300'   };
  }
};

// ─── Component ───────────────────────────────────────────
export default function HonorsPage({ currentGWA }: HonorsPageProps) {
  const currentLatinHonor = LATIN_HONORS.find(
    h => currentGWA >= h.min && currentGWA <= h.max
  ) ?? LATIN_HONORS[3];

  const currentScholarship = HONOR_SCHOLARSHIPS.find(
    s => currentGWA >= s.min && currentGWA <= s.max
  ) ?? null;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-lg font-bold text-warm-900">Honors & Scholarships</h1>
        <p className="text-xs text-warm-400 mt-0.5">
          Based on UM Student Handbook — Effective SY 2023-2024 (4.0 grading scale)
        </p>
      </div>

      {/* ── Current Standing Banner ── */}
      {currentGWA > 0 ? (
        <div className={`rounded-xl border p-4 md:p-5 ${getLatinHonorStyle(currentLatinHonor.honor).card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className={`text-[10px] uppercase tracking-widest mb-1 ${getLatinHonorStyle(currentLatinHonor.honor).text}`}>
                Your Current Standing
              </p>
              <p className={`text-xl font-bold ${getLatinHonorStyle(currentLatinHonor.honor).text}`}>
                {currentLatinHonor.honor}
              </p>
              {currentScholarship && (
                <p className={`text-xs font-medium mt-1 ${getLatinHonorStyle(currentLatinHonor.honor).text}`}>
                  Eligible for: {currentScholarship.category} — {currentScholarship.label}
                </p>
              )}
            </div>
            <div className={`text-right shrink-0`}>
              <p className={`text-[10px] uppercase tracking-widest ${getLatinHonorStyle(currentLatinHonor.honor).text}`}>
                Cumulative GWA
              </p>
              <p className={`text-3xl font-bold ${getLatinHonorStyle(currentLatinHonor.honor).text}`}>
                {currentGWA.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-blush bg-white p-5 text-center">
          <p className="text-sm text-warm-300">
            Go to Dashboard, add your subjects to see your honor standing.
          </p>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Latin Honors ── */}
        <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 md:px-5 py-4 border-b border-blush">
            <div className="w-7 h-7 bg-crimson-50 rounded-lg flex items-center justify-center">
              <GraduationCap size={14} className="text-crimson-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-warm-900">Latin Honors</h2>
              <p className="text-[10px] text-warm-400">Graduation — Effective SY 2023-2024</p>
            </div>
          </div>

          <div className="px-4 md:px-5 py-4 flex flex-col gap-2">
            {LATIN_HONORS.filter(h => h.honor !== 'No Honor').map(honor => {
              const isActive = currentGWA > 0 && currentLatinHonor.honor === honor.honor;
              const style    = getLatinHonorStyle(honor.honor);
              return (
                <div
                  key={honor.honor}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg border transition-all
                    ${isActive ? style.card : 'bg-warm-50 border-blush'}`}
                >
                  <div className="flex items-center gap-2">
                    {isActive
                      ? <Trophy size={13} className={style.text} />
                      : <Trophy size={13} className="text-warm-300" />
                    }
                    <span className={`text-sm font-semibold ${isActive ? style.text : 'text-warm-600'}`}>
                      {honor.honor}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border
                    ${isActive ? style.badge : 'bg-white text-warm-400 border-blush'}`}>
                    {honor.range}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Requirement note */}
          <div className="px-4 md:px-5 pb-4">
            <div className="flex gap-2 bg-crimson-50 rounded-lg px-3 py-2.5">
              <AlertCircle size={13} className="text-crimson-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-crimson-700 leading-relaxed">
                Candidates must have <strong>no grade below 2.5</strong> in any subject.
                PE, NSTP, and CAED 500 are excluded from GWA computation.
              </p>
            </div>
          </div>
        </div>

        {/* ── Honor Society & College Scholarship ── */}
        <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 md:px-5 py-4 border-b border-blush">
            <div className="w-7 h-7 bg-crimson-50 rounded-lg flex items-center justify-center">
              <Trophy size={14} className="text-crimson-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-warm-900">Honor Society & College Scholarship</h2>
              <p className="text-[10px] text-warm-400">2nd to 4th/5th Year Students</p>
            </div>
          </div>

          <div className="px-4 md:px-5 py-4 flex flex-col gap-3">
            {HONOR_SCHOLARSHIPS.map(scholarship => {
              const isActive = currentGWA > 0 &&
                currentGWA >= scholarship.min &&
                currentGWA <= scholarship.max;

              return (
                <div
                  key={scholarship.label}
                  className={`rounded-lg border p-3 transition-all
                    ${isActive ? scholarship.color.card : 'bg-warm-50 border-blush'}`}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isActive && <CheckCircle2 size={13} className={scholarship.color.text} />}
                      <div>
                        <span className={`text-xs font-bold ${isActive ? scholarship.color.text : 'text-warm-700'}`}>
                          {scholarship.label}
                        </span>
                        <span className={`text-[10px] ml-1.5 ${isActive ? scholarship.color.text : 'text-warm-400'}`}>
                          {scholarship.category}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border
                      ${isActive ? scholarship.color.badge : 'bg-white text-warm-400 border-blush'}`}>
                      GWA {scholarship.gwaRange}
                    </span>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-col gap-1">
                    {scholarship.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className={`text-[10px] mt-0.5 ${isActive ? scholarship.color.text : 'text-warm-300'}`}>•</span>
                        <span className={`text-[11px] ${isActive ? scholarship.color.text : 'text-warm-500'}`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Min grade requirement */}
                  <p className={`text-[10px] mt-2 font-medium ${isActive ? scholarship.color.text : 'text-warm-400'}`}>
                    Requirement: {scholarship.minGrade}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Freshman Academic Scholarship ── */}
        <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 md:px-5 py-4 border-b border-blush">
            <div className="w-7 h-7 bg-crimson-50 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-crimson-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-warm-900">Freshman Academic Scholarship</h2>
              <p className="text-[10px] text-warm-400">Entering Freshmen — SHS Honor Graduates</p>
            </div>
          </div>

          <div className="px-4 md:px-5 py-4 flex flex-col gap-3">
            {FRESHMAN_SCHOLARSHIPS.map(scholarship => (
              <div
                key={scholarship.label}
                className={`rounded-lg border p-3 ${scholarship.color.card}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${scholarship.color.text}`}>
                    {scholarship.label}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${scholarship.color.badge}`}>
                    {scholarship.range}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {scholarship.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className={`text-[10px] mt-0.5 ${scholarship.color.text}`}>•</span>
                      <span className={`text-[11px] ${scholarship.color.text}`}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-warm-400 mt-1">
              For top 10 graduates of SHS with 150+ graduating students.
            </p>
          </div>
        </div>

        {/* ── UMDC Grade Scale ── */}
        <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 md:px-5 py-4 border-b border-blush">
            <div className="w-7 h-7 bg-crimson-50 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-crimson-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-warm-900">UMDC Grade Scale</h2>
              <p className="text-[10px] text-warm-400">Undergraduate — Effective AY 2020-2021</p>
            </div>
          </div>

          <div className="px-4 md:px-5 py-4 flex flex-col gap-2">
            {GRADE_SCALE.map(({ grade, range, description, label }) => (
              <div
                key={grade}
                className="flex items-center justify-between px-3 py-2.5 bg-warm-50 border border-blush rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-crimson-700 w-5">{label}</span>
                  <span className="text-sm font-bold text-warm-800">{grade.toFixed(1)}</span>
                  <span className="text-xs text-warm-500 hidden sm:block">{description}</span>
                </div>
                <span className="text-xs font-medium text-warm-500">{range}</span>
              </div>
            ))}
          </div>

          <div className="px-4 md:px-5 pb-4">
            <p className="text-[10px] text-warm-300 text-center">
              Source: UM Student Handbook (AY 2020-2021). Always verify with your registrar.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}