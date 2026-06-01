import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import type { Term, YearLevel, TermPeriod } from './types';
import Header from './components/Header';
import DashboardPage from './pages/dashboard/DashboardPage';
import ScannerPage from './pages/scanner/ScannerPage';
import { computeCumulativeGWA, getLatinHonor } from './utils/gwaCalculator';

function App() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedYear, setSelectedYear] = useState<YearLevel>('1st Year');
  const [selectedTerm, setSelectedTerm] = useState<TermPeriod>('1st Semester');

  const cumulativeGWA = computeCumulativeGWA(terms);
  const latinHonor = getLatinHonor(cumulativeGWA);

  const handleInitialize = () => {
    const exists = terms.find(
      t => t.yearLevel === selectedYear && t.termPeriod === selectedTerm
    );
    if (exists) return;

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
          <Route path="scanner" element={<ScannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;