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
    <div className="bg-white rounded-xl border border-red-100 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-end">

        {/* Year Level */}
        <div className="flex-1">
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
            Select Year Level
          </label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value as YearLevel)}
            className="w-full border border-red-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          >
            {YEAR_LEVELS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Term Period */}
        <div className="flex-1">
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
            Select Term Period
          </label>
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value as TermPeriod)}
            className="w-full border border-red-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          >
            {TERM_PERIODS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Initialize Button */}
        <button
          onClick={onInitialize}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <PlusCircle size={16} />
          Initialize Term
        </button>

      </div>
    </div>
  );
}