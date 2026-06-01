import { Trash2, Lock } from 'lucide-react';
import type { Subject } from '../types';
import { GRADE_OPTIONS } from '../utils/gwaCalculator';

interface SubjectRowProps {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
  onDelete: () => void;
}

export default function SubjectRow({ subject, onUpdate, onDelete }: SubjectRowProps) {
  const handleGradeStep = (dir: 1 | -1) => {
    const idx = GRADE_OPTIONS.indexOf(subject.grade);
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
    const isExcluded = ['NSTP', 'PAHF', 'ROTC', 'CWTS', 'LTS'].some(k =>
      name.toUpperCase().includes(k)
    );
    onUpdate({ ...subject, name, isExcluded });
  };

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border transition-colors
      ${subject.isExcluded
        ? 'bg-warm-50 border-warm-200'
        : 'bg-white border-blush'}`}
    >
      {/* Subject Name */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Subject name (e.g. Introduction to Computing)"
          value={subject.name}
          onChange={e => handleNameChange(e.target.value)}
          className="w-full text-base sm:text-sm text-warm-800 placeholder-warm-300 bg-transparent border-b border-dashed border-blush focus:outline-none focus:border-crimson-400 py-1"
        />
        {subject.isExcluded && (
          <span className="inline-flex items-center gap-1 text-[10px] text-warm-400 mt-1">
            <Lock size={9} /> Excluded from GWA
          </span>
        )}
      </div>

      {/* Controls Row */}
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
          <div className="flex items-center border border-blush rounded-lg overflow-hidden">
            <button
              onClick={() => handleGradeStep(-1)}
              className="px-2 py-1.5 text-crimson-600 hover:bg-crimson-50 active:bg-crimson-100 text-sm font-bold transition-colors"
            >−</button>
            <select
              value={subject.grade}
              onChange={e => onUpdate({ ...subject, grade: Number(e.target.value) })}
              className="px-1 py-1.5 text-base sm:text-sm font-semibold text-crimson-700 bg-transparent focus:outline-none cursor-pointer"
            >
              {GRADE_OPTIONS.map(g => (
                <option key={g} value={g}>{g.toFixed(1)}</option>
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