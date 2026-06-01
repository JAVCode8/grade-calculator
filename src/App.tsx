import { useState } from 'react';
import type { Term, YearLevel, TermPeriod } from './types';
import Header from './components/Header';
import { computeCumulativeGWA, getLatinHonor } from './utils/gwa-Calculator';

type ActiveView = 'dashboard' | 'scanner';

function App() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedYear, setSelectedYear] = useState<YearLevel>('1st Year');
  const [selectedTerm, setSelectedTerm] = useState<TermPeriod>('1st Semester');

  const cumulativeGWA = computeCumulativeGWA(terms);
  const latinHonor = getLatinHonor(cumulativeGWA);

  return (
    <div className="min-h-screen bg-red-50 flex flex-col">
      <Header
        gwa={cumulativeGWA}
        honor={latinHonor.honor}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Phases 2–5 components go here */}
        <div className="text-gray-400 text-sm">Dashboard content coming in Phase 2...</div>
      </main>
    </div>
  );
}

export default App;