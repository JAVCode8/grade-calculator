// 1. Third-party
import { Trophy, BookOpen } from 'lucide-react';

// 2. Internal — utils
import { LATIN_HONORS, GRADE_SCALE } from '../utils/gwaCalculator';

// ─── Types ───────────────────────────────────────────────
interface GradeReferenceProps {
  currentGWA: number;
}

// ─── Helpers ─────────────────────────────────────────────
const getHonorStyle = (honor: string) => {
  switch (honor) {
    case 'Summa Cum Laude': return {
      card: 'bg-yellow-50 border-yellow-300',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      bar:   'bg-yellow-400',
      text:  'text-yellow-700',
    };
    case 'Magna Cum Laude': return {
      card: 'bg-blue-50 border-blue-300',
      badge: 'bg-blue-100 text-blue-700 border-blue-300',
      bar:   'bg-blue-400',
      text:  'text-blue-700',
    };
    case 'Cum Laude': return {
      card: 'bg-emerald-50 border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      bar:   'bg-emerald-400',
      text:  'text-emerald-700',
    };
    default: return {
      card: 'bg-warm-50 border-warm-200',
      badge: 'bg-warm-100 text-warm-500 border-warm-200',
      bar:   'bg-warm-300',
      text:  'text-warm-500',
    };
  }
};

// ─── Component ───────────────────────────────────────────
export default function GradeReference({ currentGWA }: GradeReferenceProps) {
  const currentHonor = LATIN_HONORS.find(
    h => currentGWA >= h.min && currentGWA <= h.max
  ) ?? LATIN_HONORS[3];

  const style = getHonorStyle(currentHonor.honor);

  // Progress within current honor bracket
  const bracketRange  = currentHonor.max - currentHonor.min;
  const progressInBracket = currentGWA - currentHonor.min;
  const progressPercent = bracketRange > 0
    ? Math.min((progressInBracket / bracketRange) * 100, 100)
    : 0;

  // Next honor bracket
  const currentIndex = LATIN_HONORS.findIndex(h => h.honor === currentHonor.honor);
  const nextHonor    = currentIndex > 0 ? LATIN_HONORS[currentIndex - 1] : null;
  const pointsNeeded = nextHonor
    ? (nextHonor.min - currentGWA).toFixed(2)
    : null;

  return (
    <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 md:px-5 py-4 border-b border-blush">
        <div className="w-7 h-7 bg-crimson-50 rounded-lg flex items-center justify-center">
          <Trophy size={14} className="text-crimson-700" />
        </div>
        <h2 className="text-sm font-semibold text-warm-900">Grade Reference</h2>
      </div>

      {/* ── Current GWA Status ── */}
      {currentGWA > 0 ? (
        <div className="px-4 md:px-5 py-4 border-b border-blush">

          {/* Honor Badge */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-[10px] text-warm-400 uppercase tracking-widest mb-0.5">
                Current Standing
              </p>
              <p className="text-sm font-bold text-warm-900">
                {currentHonor.honor}
              </p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${style.badge}`}>
              GWA {currentGWA.toFixed(2)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-warm-400">
              <span>{currentHonor.min.toFixed(2)}</span>
              <span>{currentHonor.max.toFixed(2)}</span>
            </div>
            <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {nextHonor && (
              <p className="text-[10px] text-warm-400 text-center pt-0.5">
                Need{' '}
                <span className={`font-bold ${style.text}`}>
                  +{pointsNeeded}
                </span>{' '}
                points for{' '}
                <span className="font-semibold text-warm-700">
                  {nextHonor.honor}
                </span>
              </p>
            )}

            {!nextHonor && currentHonor.honor === 'Summa Cum Laude' && (
              <p className="text-[10px] text-yellow-600 font-semibold text-center pt-0.5">
                🎉 Highest honor achieved!
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 md:px-5 py-6 border-b border-blush text-center">
          <p className="text-xs text-warm-300">
            Add subjects to see your standing.
          </p>
        </div>
      )}

      {/* ── Latin Honor Brackets ── */}
      <div className="px-4 md:px-5 py-4 border-b border-blush">
        <p className="text-[10px] text-warm-400 uppercase tracking-widest mb-3">
          Latin Honor Brackets
        </p>
        <div className="flex flex-col gap-2">
          {LATIN_HONORS.filter(h => h.honor !== 'No Honor').map(honor => {
            const isActive  = currentGWA > 0 && currentHonor.honor === honor.honor;
            const honorStyle = getHonorStyle(honor.honor);
            return (
              <div
                key={honor.honor}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all
                  ${isActive ? honorStyle.card : 'border-blush bg-warm-50'}`}
              >
                <div className="flex items-center gap-2">
                  {isActive && (
                    <Trophy size={11} className={honorStyle.text} />
                  )}
                  <span className={`text-sm font-medium
                    ${isActive ? honorStyle.text : 'text-warm-600'}`}>
                    {honor.honor}
                  </span>
                </div>
                <span className={`text-xs font-semibold
                  ${isActive ? honorStyle.text : 'text-warm-400'}`}>
                  {honor.range}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── UMDC Grade Scale ── */}
      <div className="px-4 md:px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={12} className="text-warm-400" />
          <p className="text-[10px] text-warm-400 uppercase tracking-widest">
            UMDC Grade Scale (AY 2020–2021)
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {GRADE_SCALE.map(({ grade, range, description, label }) => (
            <div
              key={grade}
              className="flex items-center justify-between px-3 py-2 bg-warm-50 border border-blush rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-crimson-700 w-6">
                  {label}
                </span>
                <span className="text-xs font-semibold text-warm-700">
                  {grade.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-warm-400 hidden sm:block">
                  {description}
                </span>
                <span className="text-[10px] font-medium text-warm-500">
                  {range}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-warm-300 mt-3 text-center leading-relaxed">
          Latin honor brackets are estimated based on the 4.0 scale.
          Always verify with your registrar.
        </p>
      </div>

    </div>
  );
}