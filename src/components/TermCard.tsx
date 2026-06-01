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

  const isSummer = term.termPeriod === 'Summer';
  const currentYear = new Date().getFullYear();
  const academicYear = `Academic Year ${currentYear}-${currentYear + 1}`;

  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">

      {/* Card Header */}
      <div className="flex items-start justify-between px-4 md:px-5 pt-4 pb-3 border-b border-red-50">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">
              {term.yearLevel} · {term.termPeriod}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
              ${isSummer
                ? 'bg-orange-100 text-orange-600'
                : 'bg-green-100 text-green-600'}`}
            >
              {isSummer ? 'INTENSIVE' : 'ACTIVE'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{academicYear}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Term GWA</p>
            <p className="text-xl font-bold text-red-600 leading-none">
              {termGWA > 0 ? termGWA.toFixed(2) : '—'}
            </p>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Subject Rows */}
      <div className="px-4 md:px-5 py-3 flex flex-col gap-2">
        {term.subjects.length === 0 && (
          <p className="text-sm text-gray-300 text-center py-4">
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
          className="w-full flex items-center justify-center gap-2 border border-dashed border-red-200 text-red-400 hover:text-red-600 hover:border-red-400 hover:bg-red-50 rounded-lg py-2.5 text-sm font-medium transition-colors"
        >
          <PlusCircle size={15} />
          Add Subject Row
        </button>
      </div>

    </div>
  );
}