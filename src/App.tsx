// 1. React core
import { useState, useEffect } from 'react';

// 2. Third-party
import { Routes, Route, Navigate } from 'react-router-dom';

// 3. Internal — types
import type { Term, YearLevel, TermPeriod } from './types';
import type { ScannedSubject } from './utils/geminiScanner';

// 4. Internal — utils
import { computeCumulativeGWA, getLatinHonor } from './utils/gwaCalculator';

// 5. Internal — components
import Header from './components/Header';

// 6. Internal — pages
import DashboardPage from './pages/dashboard/DashboardPage';
import HonorsPage    from './pages/honors/HonorsPage';
import ScannerPage   from './pages/scanner/ScannerPage';

// ─── Component ───────────────────────────────────────────
function App() {
  const [terms, setTerms] = useState<Term[]>(() => {
    const saved = localStorage.getItem('umdc-terms');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedYear, setSelectedYear] = useState<YearLevel>('1st Year');
  const [selectedTerm, setSelectedTerm] = useState<TermPeriod>('1st Semester');

  // ── Persist to localStorage ──
  useEffect(() => {
    localStorage.setItem('umdc-terms', JSON.stringify(terms));
  }, [terms]);

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

  // ── Sync scanned subjects to terms ──
  const handleSyncFromScanner = (scannedSubjects: ScannedSubject[]) => {
  setTerms(prev => {
    const updated = [...prev];

    scannedSubjects.forEach(scanned => {
      let termIndex = updated.findIndex(
        t => t.yearLevel  === scanned.yearLevel &&
             t.termPeriod === scanned.termPeriod
      );

      if (termIndex === -1) {
        updated.push({
          id:         Math.random().toString(36).slice(2),
          yearLevel:  scanned.yearLevel  as YearLevel,
          termPeriod: scanned.termPeriod as TermPeriod,
          subjects:   [],
        });
        termIndex = updated.length - 1;
      }

      const exists = updated[termIndex].subjects.some(
        s => s.name.toUpperCase() === scanned.title.toUpperCase()
      );

      if (!exists) {
        updated[termIndex].subjects.push({
          id:         Math.random().toString(36).slice(2),
          name:       scanned.title,
          // ── Fix: explicitly keep 0 grade, don't fallback ──
          grade:      typeof scanned.grade === 'number' ? scanned.grade : 0,
          units:      scanned.units,
          isExcluded: scanned.isExcluded,
        });
      }
    });

    return updated;
  });
};

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header
        gwa={cumulativeGWA}
        honor={latinHonor.honor}
        terms={terms}
      />

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
          <Route
            path="honors"
            element={
              <HonorsPage
                currentGWA={cumulativeGWA}
                terms={terms}
              />
            }
          />
          <Route
            path="scanner"
            element={
              <ScannerPage
                onSyncToTerms={handleSyncFromScanner}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;