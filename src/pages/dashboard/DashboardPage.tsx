// 1. Internal — types
import type { Term, YearLevel, TermPeriod } from '../../types';

// 2. Internal — components
import GradeReference from '../../components/GradeReference';
import PolicyNotice from '../../components/PolicyNotice';
import TermCard from '../../components/TermCard';
import TermInitializer from '../../components/TermInitializer';
import { computeCumulativeGWA } from '../../utils/gwaCalculator';

// ─── Types ───────────────────────────────────────────────
interface DashboardPageProps {
  terms: Term[];
  selectedYear: YearLevel;
  selectedTerm: TermPeriod;
  setSelectedYear: (y: YearLevel) => void;
  setSelectedTerm: (t: TermPeriod) => void;
  onInitialize: () => void;
  onUpdateTerm: (id: string, updated: Term) => void;
  onDeleteTerm: (id: string) => void;
}

// ─── Component ───────────────────────────────────────────
export default function DashboardPage({
  terms,
  selectedYear,
  selectedTerm,
  setSelectedYear,
  setSelectedTerm,
  onInitialize,
  onUpdateTerm,
  onDeleteTerm,
}: DashboardPageProps) {
  const cumulativeGWA = computeCumulativeGWA(terms);

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">

      {/* Left — Main Content */}
      <div className="flex flex-col gap-5 flex-1 w-full">
        <TermInitializer
          selectedYear={selectedYear}
          selectedTerm={selectedTerm}
          setSelectedYear={setSelectedYear}
          setSelectedTerm={setSelectedTerm}
          onInitialize={onInitialize}
        />

        {terms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {terms.map(term => (
              <TermCard
                key={term.id}
                term={term}
                onUpdate={updated => onUpdateTerm(term.id, updated)}
                onDelete={() => onDeleteTerm(term.id)}
              />
            ))}
          </div>
        )}

        {terms.length === 0 && (
          <div className="text-center py-16 text-warm-300">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-sm font-medium">No terms yet.</p>
            <p className="text-xs">
              Select a year and term above, then click Initialize Term.
            </p>
          </div>
        )}

        <PolicyNotice />
      </div>

      {/* Right — Grade Reference Sidebar */}
      <div className="w-full lg:w-72 shrink-0">
        <GradeReference currentGWA={cumulativeGWA} />
      </div>

    </div>
  );
}