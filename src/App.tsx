// 1. React core
import { useState } from 'react';

// 2. Third-party
import { Routes, Route, Navigate } from 'react-router-dom';

// 3. Internal — types
import type { Term, YearLevel, TermPeriod } from './types';

// 4. Internal — utils
import { computeCumulativeGWA, getLatinHonor } from './utils/gwaCalculator';

// 5. Internal — components
import Header from './components/Header';

// 6. Internal — pages
import DashboardPage from './pages/dashboard/DashboardPage';
import HonorsPage from './pages/honors/HonorsPage';
import ScannerPage from './pages/scanner/ScannerPage';

// ─── Component ───────────────────────────────────────────
function App() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedYear, setSelectedYear] = useState<YearLevel>('1st Year');
  const [selectedTerm, setSelectedTerm] = useState<TermPeriod>('1st Semester');

  const cumulativeGWA = computeCumulativeGWA(terms);
  const latinHonor    = getLatinHonor(cumulativeGWA);

  const handleInitialize = () => {
    const exists = terms.find(
      t => t.yearLevel === selectedYear && t.termPeriod === selectedTerm
    );
    if (exists) return;

    const newTerm: Term = {
      id:         Math.random().toString(36).slice(2),
      yearLevel:  selectedYear,
      termPeriod: selectedTerm,
      subjects:   [],
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
    <div className="min-h-screen bg-cream flex flex-col">
      <Header gwa={cumulativeGWA} honor={latinHonor.honor} />

      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        <Routes>
          <Route
            index
            element={
              <DashboardPage
                terms={terms}
                selectedYear={selectedYear}
                selectedTerm={selectedTerm}
                setSelectedYear={setSelectedYear}
                setSelectedTerm={setSelectedTerm}
                onInitialize={handleInitialize}
                onUpdateTerm={updateTerm}
                onDeleteTerm={deleteTerm}
              />
            }
          />
          <Route path="honors" element={<HonorsPage currentGWA={cumulativeGWA} />} />
          <Route path="scanner" element={<ScannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;