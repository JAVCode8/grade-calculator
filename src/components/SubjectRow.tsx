// 1. Third-party
import { Trash2, Lock, AlertTriangle } from 'lucide-react';

// 2. Internal — types
import type { Subject } from '../types';

// 3. Internal — utils
import { GRADE_OPTIONS, EXCLUDED_KEYWORDS } from '../utils/gwaCalculator';

// ─── Types ───────────────────────────────────────────────
interface SubjectRowProps {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
  onDelete: () => void;
}

// ─── Component ───────────────────────────────────────────
export default function SubjectRow({ subject, onUpdate, onDelete }: SubjectRowProps) {

  const handleGradeStep = (dir: 1 | -1) => {
    const idx  = GRADE_OPTIONS.indexOf(subject.grade);
    const next = idx + dir;
    if (next >= 0 && next < GRADE_OPTIONS.length) {
      onUpdate({ ...subject, grade: GRADE_OPTIONS[next] });
    }
  };

  const handleUnitStep = (dir: 1 | -1) => {
    const newVal = subject.units + dir;
    if (newVal >= 1) {
      onUpdate({ ...subject, units: newVal });
    }
  };

  const handleUnitInput = (val: string) => {
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= 1) {
      onUpdate({ ...subject, units: parsed });
    } else if (val === '') {
      onUpdate({ ...subject, units: 0 });
    }
  };

  const handleNameChange = (name: string) => {
    const isExcluded = EXCLUDED_KEYWORDS.some(k =>
      name.toUpperCase().includes(k.toUpperCase())
    );
    onUpdate({ ...subject, name, isExcluded });
  };

  // ── Grade status helpers ──
  const hasNoGrade   = subject.grade === 0;
  const isFailGrade  = subject.grade === 1.0;
  const isLowGrade   = subject.grade > 0 && subject.grade < 3.0;

  const rowBg = subject.isExcluded
    ? 'bg-warm-50 border-warm-200'
    : hasNoGrade
      ? 'bg-orange-50 border-orange-200'
      : isFailGrade
        ? 'bg-red-50 border-red-200'
        : 'bg-white border-blush';

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border transition-colors ${rowBg}`}>

      {/* ── Subject Name ── */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Subject name (e.g. Introduction to Computing)"
          value={subject.name}
          onChange={e => handleNameChange(e.target.value)}
          className="w-full text-base sm:text-sm text-warm-800 placeholder-warm-300 bg-transparent border-b border-dashed border-blush focus:outline-none focus:border-crimson-400 py-1"
        />

        {/* Status tags */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {subject.isExcluded && (
            <span className="inline-flex items-center gap-1 text-[10px] text-warm-400">
              <Lock size={9} /> Excluded from GWA
            </span>
          )}
          {hasNoGrade && !subject.isExcluded && (
            <span className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-medium">
              <AlertTriangle size={9} /> No grade yet — please update when available
            </span>
          )}
          {isFailGrade && !subject.isExcluded && (
            <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-medium">
              <AlertTriangle size={9} /> Failed subject — will affect GWA
            </span>
          )}
          {isLowGrade && !subject.isExcluded && (
            <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-medium">
              <AlertTriangle size={9} /> Grade below 3.0 — not qualified for honors
            </span>
          )}
        </div>
      </div>

      {/* ── Controls Row ── */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Units Stepper */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-warm-400 uppercase tracking-wider">Units</span>
          <div className="flex items-center border border-blush rounded-lg overflow-hidden">
            <button
              onClick={() => handleUnitStep(-1)}
              className="px-2 py-1.5 text-crimson-600 hover:bg-crimson-50 active:bg-crimson-100 text-sm font-bold transition-colors"
            >−</button>
            <input
              type="number"
              min={1}
              value={subject.units === 0 ? '' : subject.units}
              onChange={e => handleUnitInput(e.target.value)}
              onBlur={() => {
                if (subject.units < 1) onUpdate({ ...subject, units: 1 });
              }}
              className="w-10 text-center text-base sm:text-sm text-warm-800 bg-transparent focus:outline-none py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => handleUnitStep(1)}
              className="px-2 py-1.5 text-crimson-600 hover:bg-crimson-50 active:bg-crimson-100 text-sm font-bold transition-colors"
            >+</button>
          </div>
        </div>

        {/* Grade Stepper */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-warm-400 uppercase tracking-wider">Grade</span>
          <div className={`flex items-center border rounded-lg overflow-hidden
            ${hasNoGrade
              ? 'border-orange-300'
              : isFailGrade || isLowGrade
                ? 'border-red-300'
                : 'border-blush'
            }`}>
            <button
              onClick={() => handleGradeStep(-1)}
              className="px-2 py-1.5 text-crimson-600 hover:bg-crimson-50 active:bg-crimson-100 text-sm font-bold transition-colors"
            >−</button>
            <select
              value={subject.grade}
              onChange={e => onUpdate({ ...subject, grade: Number(e.target.value) })}
              className={`px-1 py-1.5 text-base sm:text-sm font-semibold bg-transparent focus:outline-none cursor-pointer
                ${hasNoGrade
                  ? 'text-orange-500'
                  : isFailGrade || isLowGrade
                    ? 'text-red-500'
                    : 'text-crimson-700'
                }`}
            >
              {GRADE_OPTIONS.map(g => (
                <option key={g} value={g}>
                  {g === 0 ? 'N/A' : g.toFixed(1)}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleGradeStep(1)}
              className="px-2 py-1.5 text-crimson-600 hover:bg-crimson-50 active:bg-crimson-100 text-sm font-bold transition-colors"
            >+</button>
          </div>
        </div>

        {/* Delete */}
        <div className="ml-auto">
          <button
            onClick={onDelete}
            className="p-1.5 text-warm-300 hover:text-crimson-600 transition-colors rounded-lg hover:bg-crimson-50"
          >
            <Trash2 size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}