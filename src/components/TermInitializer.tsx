import type { YearLevel, TermPeriod } from '../types';
import { PlusCircle } from 'lucide-react';

interface TermInitializerProps {
  selectedYear: YearLevel;
  selectedTerm: TermPeriod;
  setSelectedYear: (y: YearLevel) => void;
  setSelectedTerm: (t: TermPeriod) => void;
  onInitialize: () => void;
}

const YEAR_LEVELS: YearLevel[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const TERM_PERIODS: TermPeriod[] = ['1st Semester', '2nd Semester', 'Summer'];

export default function TermInitializer({
  selectedYear,
  selectedTerm,
  setSelectedYear,
  setSelectedTerm,
  onInitialize,
}: TermInitializerProps) {
  return (
    <div className="bg-white rounded-xl border border-blush p-4 md:p-6 shadow-warm-sm">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">

          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest text-warm-500 mb-1.5">
              Select Year Level
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value as YearLevel)}
              className="w-full border border-blush rounded-lg px-3 py-3 text-base sm:text-sm text-warm-800 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-300 cursor-pointer"
            >
              {YEAR_LEVELS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest text-warm-500 mb-1.5">
              Select Term Period
            </label>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value as TermPeriod)}
              className="w-full border border-blush rounded-lg px-3 py-3 text-base sm:text-sm text-warm-800 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-300 cursor-pointer"
            >
              {TERM_PERIODS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onInitialize}
          className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 bg-crimson-700 hover:bg-crimson-800 active:bg-crimson-900 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          Initialize Term
        </button>
      </div>
    </div>
  );
}