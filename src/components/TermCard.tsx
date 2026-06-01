import { PlusCircle, Trash2 } from 'lucide-react';
import type { Term, Subject } from '../types';
import SubjectRow from './SubjectRow';
import { computeTermGWA } from '../utils/gwaCalculator';

interface TermCardProps {
  term: Term;
  onUpdate: (updated: Term) => void;
  onDelete: () => void;
}

const newSubject = (): Subject => ({
  id: Math.random().toString(36).slice(2),
  name: '',
  grade: 2.0,
  units: 3,
  isExcluded: false,
});

export default function TermCard({ term, onUpdate, onDelete }: TermCardProps) {
  const termGWA = computeTermGWA(term.subjects);
  const currentYear = new Date().getFullYear();
  const academicYear = `AY ${currentYear}-${currentYear + 1}`;
  const isSummer = term.termPeriod === 'Summer';

  const addSubject = () => {
    onUpdate({ ...term, subjects: [...term.subjects, newSubject()] });
  };

  const updateSubject = (id: string, updated: Subject) => {
    onUpdate({
      ...term,
      subjects: term.subjects.map(s => s.id === id ? updated : s),
    });
  };

  const deleteSubject = (id: string) => {
    onUpdate({ ...term, subjects: term.subjects.filter(s => s.id !== id) });
  };

  return (
    <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">

      {/* Card Header */}
      <div className="flex items-start justify-between px-4 md:px-5 pt-4 pb-3 border-b border-blush">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-warm-900">
              {term.yearLevel} · {term.termPeriod}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
              ${isSummer
                ? 'bg-orange-100 text-orange-600'
                : 'bg-emerald-100 text-emerald-700'}`}
            >
              {isSummer ? 'INTENSIVE' : 'ACTIVE'}
            </span>
          </div>
          <p className="text-[11px] text-warm-400 mt-0.5">{academicYear}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-warm-500 uppercase tracking-wider">Term GWA</p>
            <p className="text-xl font-bold text-crimson-700 leading-none">
              {termGWA > 0 ? termGWA.toFixed(2) : '—'}
            </p>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 text-warm-300 hover:text-crimson-600 hover:bg-crimson-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Subject Rows */}
      <div className="px-4 md:px-5 py-3 flex flex-col gap-2">
        {term.subjects.length === 0 && (
          <p className="text-sm text-warm-300 text-center py-4">
            No subjects yet. Add one below.
          </p>
        )}
        {term.subjects.map(subject => (
          <SubjectRow
            key={subject.id}
            subject={subject}
            onUpdate={updated => updateSubject(subject.id, updated)}
            onDelete={() => deleteSubject(subject.id)}
          />
        ))}
      </div>

      {/* Add Subject */}
      <div className="px-4 md:px-5 pb-4">
        <button
          onClick={addSubject}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-blush text-warm-400 hover:text-crimson-700 hover:border-crimson-300 hover:bg-crimson-50 rounded-lg py-2.5 text-sm font-medium transition-colors"
        >
          <PlusCircle size={15} />
          Add Subject Row
        </button>
      </div>
    </div>
  );
}