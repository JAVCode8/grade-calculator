import { useState } from 'react';
import type { Term, YearLevel, TermPeriod } from './types';
import Header from './components/Header';
import TermInitializer from './components/TermInitializer';
import TermCard from './components/TermCard';
import PolicyNotice from './components/PolicyNotice';
import { computeCumulativeGWA, getLatinHonor } from './utils/gwaCalculator';

type ActiveView = 'dashboard' | 'scanner';

function App() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedYear, setSelectedYear] = useState<YearLevel>('1st Year');
  const [selectedTerm, setSelectedTerm] = useState<TermPeriod>('1st Semester');

  const cumulativeGWA = computeCumulativeGWA(terms);
  const latinHonor = getLatinHonor(cumulativeGWA);

  const handleInitialize = () => {
    const exists = terms.find(
      t => t.yearLevel === selectedYear && t.termPeriod === selectedTerm
    );
    if (exists) return; // prevent duplicates

    const newTerm: Term = {
      id: Math.random().toString(36).slice(2),
      yearLevel: selectedYear,
      termPeriod: selectedTerm,
      subjects: [],
    };
    setTerms(prev => [...prev, newTerm]);
  };

  const updateTerm = (id: string, updated: Term) => {
    setTerms(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTerm = (id: string) => {
    setTerms(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col">
      <Header
        gwa={cumulativeGWA}
        honor={latinHonor.honor}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        {activeView === 'dashboard' && (
          <div className="flex flex-col gap-5">

            {/* Term Initializer */}
            <TermInitializer
              selectedYear={selectedYear}
              selectedTerm={selectedTerm}
              setSelectedYear={setSelectedYear}
              setSelectedTerm={setSelectedTerm}
              onInitialize={handleInitialize}
            />

            {/* Term Cards Grid */}
            {terms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terms.map(term => (
                  <TermCard
                    key={term.id}
                    term={term}
                    onUpdate={updated => updateTerm(term.id, updated)}
                    onDelete={() => deleteTerm(term.id)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {terms.length === 0 && (
              <div className="text-center py-16 text-gray-300">
                <p className="text-4xl mb-3">📚</p>
                <p className="text-sm font-medium">No terms yet.</p>
                <p className="text-xs">Select a year and term above, then click Initialize Term.</p>
              </div>
            )}

            {/* Policy Notice */}
            <PolicyNotice />

          </div>
        )}

        {activeView === 'scanner' && (
          <div className="text-gray-400 text-sm text-center py-16">
            AI Scanner coming in Phase 5...
          </div>
        )}
      </main>
    </div>
  );
}

export default App;