import type { Term, YearLevel, TermPeriod } from '../../types';
import TermInitializer from '../../components/TermInitializer';
import TermCard from '../../components/TermCard';
import PolicyNotice from '../../components/PolicyNotice';

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
  return (
    <div className="flex flex-col gap-5">
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
  );
}