// 1. React core
import { useState, useRef, useCallback } from 'react';

// 2. Third-party
import {
  ScanLine, Upload, Monitor, Smartphone,
  CheckCircle2, AlertCircle, Info, ImageIcon,
  X, Plus, Loader2, Trash2, Lock, ArrowRight,
} from 'lucide-react';

// 3. Internal — types
import type { ScannedSubject } from '../../utils/geminiScanner';

// 4. Internal — utils
import { scanPortalScreenshot } from '../../utils/geminiScanner';

// ─── Types ───────────────────────────────────────────────
interface ScannerPageProps {
  onSyncToTerms: (subjects: ScannedSubject[]) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

type ScanState = 'idle' | 'scanning' | 'done' | 'error';

// ─── Constants ───────────────────────────────────────────
const DESKTOP_TIPS = [
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Include the Header Row',
    desc: 'Make sure "Course Number", "Descriptive Title of Course", "Final Grade", and "Unit" columns are fully visible.',
  },
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Include the Term Title',
    desc: 'The red text block showing semester and year level must not be cropped.',
  },
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Use High Resolution',
    desc: 'Avoid blurry or skewed screenshots. Use a clear desktop-mode browser screenshot.',
  },
  {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200',
    title: 'Avoid Mobile Normal Mode',
    desc: 'In normal mobile mode, columns get cut off. Always use Desktop Mode on your browser.',
  },
];

const HOW_TO_DESKTOP_MODE = [
  {
    device: '📱 iPhone — Method 1 (Easiest)',
    steps: 'Open UMDC portal in Safari → Tap the "aA" icon on the LEFT side of the address bar → Tap "Request Desktop Website" → Screenshot',
  },
  {
    device: '📱 iPhone — Method 2 (Share)',
    steps: 'Tap Share button (⬆️) at the bottom → Scroll left in icons → Tap "Request Desktop Website" → Screenshot',
  },
  {
    device: '📱 iPhone — Always Desktop Mode',
    steps: 'Go to Settings → Apps → Safari → Request Desktop Website → Toggle ON "All Websites"',
  },
  {
    device: '📱 Android (Chrome)',
    steps: 'Tap the 3-dot menu (⋮) at top right → Check "Desktop site" → Screenshot',
  },
  {
    device: '💻 Desktop / Laptop',
    steps: 'Just take a screenshot normally — you\'re already in desktop mode',
  },
];

// ─── Component ───────────────────────────────────────────
export default function ScannerPage({ onSyncToTerms }: ScannerPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedSubjects, setScannedSubjects] = useState<ScannedSubject[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Hoisted before useCallback ──
  const handleImageFiles = (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    const newImages: UploadedImage[] = valid.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    // Reset scan state when new images added
    setScanState('idle');
    setScannedSubjects([]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageFiles(Array.from(e.dataTransfer.files));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) handleImageFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(img => img.id !== id);
    });
    setScanState('idle');
    setScannedSubjects([]);
  };

  const handleClearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setScanState('idle');
    setScannedSubjects([]);
    setErrorMessage('');
  };

  // ── Scan Handler ──
  const handleScan = async () => {
    if (images.length === 0) return;

    setScanState('scanning');
    setScanProgress(0);
    setErrorMessage('');

    // Simulate progress while waiting
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 400);

    const result = await scanPortalScreenshot(images.map(img => img.file));

    clearInterval(progressInterval);
    setScanProgress(100);

    if (result.success && result.subjects.length > 0) {
      setScannedSubjects(result.subjects);
      // Select all non-zero-grade subjects by default
      const defaultSelected = new Set(
        result.subjects
          .map((_, i) => i)
          .filter(i => result.subjects[i].grade > 0)
      );
      setSelectedIds(defaultSelected);
      setScanState('done');
    } else {
      setErrorMessage(result.error ?? 'No subjects found. Please try a clearer screenshot.');
      setScanState('error');
    }
  };

  // ── Toggle subject selection ──
  const toggleSubject = (index: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === scannedSubjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(scannedSubjects.map((_, i) => i)));
    }
  };

  // ── Confirm & Sync ──
  const handleConfirmSync = () => {
    const toSync = scannedSubjects.filter((_, i) => selectedIds.has(i));
    onSyncToTerms(toSync);
    // Reset scanner
    handleClearAll();
    setScanState('idle');
  };

  // ── Group subjects by term for display ──
  const groupedByTerm = scannedSubjects.reduce((acc, subject, index) => {
    const key = subject.termLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push({ subject, index });
    return acc;
  }, {} as Record<string, { subject: ScannedSubject; index: number }[]>);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-lg font-bold text-warm-900">AI Portal Grade Scanner</h1>
        <p className="text-xs text-warm-400 mt-0.5">
          Upload screenshots of your UMDC Student Portal to automatically extract your grades.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Left — Upload + Scan + Results ── */}
        <div className="flex flex-col gap-4 flex-1 w-full">

          {/* Drop Zone — hide when scan is done */}
          {scanState !== 'done' && (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer
                  ${isDragging
                    ? 'border-crimson-500 bg-crimson-50 scale-[1.01]'
                    : 'border-blush bg-white hover:border-crimson-300 hover:bg-crimson-50'
                  }`}
              >
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors
                    ${isDragging ? 'bg-crimson-100' : 'bg-crimson-50'}`}>
                    <ScanLine size={24} className="text-crimson-600" />
                  </div>
                  <p className="text-sm font-semibold text-warm-800 mb-1">
                    {isDragging ? 'Drop your screenshots here' : 'Drop your portal screenshots here'}
                  </p>
                  <p className="text-xs text-warm-400 mb-4">
                    or click to browse — multiple screenshots allowed
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white rounded-lg transition-colors">
                    <Upload size={14} />
                    <span className="text-sm font-medium">Choose Screenshots</span>
                  </div>
                  <p className="text-[10px] text-warm-300 mt-3">
                    Supports PNG, JPG, JPEG, WEBP — Multiple files allowed
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Uploaded Images */}
              {images.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-warm-800">
                      {images.length} {images.length === 1 ? 'screenshot' : 'screenshots'} ready
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-blush text-warm-500 hover:text-crimson-700 hover:border-crimson-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Plus size={12} /> Add More
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-400 hover:text-red-600 hover:border-red-400 rounded-lg text-xs font-medium transition-colors"
                      >
                        <X size={12} /> Clear All
                      </button>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden"
                      >
                        <div className="absolute top-2 left-2 z-10 bg-crimson-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          #{index + 1}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); handleRemoveImage(img.id); }}
                          className="absolute top-2 right-2 z-10 p-1.5 bg-white border border-blush rounded-full shadow-warm-sm text-warm-400 hover:text-crimson-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <img
                          src={img.preview}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full object-contain max-h-64"
                        />
                        <div className="px-3 py-2 border-t border-blush">
                          <p className="text-[10px] text-warm-500 truncate">{img.file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scanning Progress */}
              {scanState === 'scanning' && (
                <div className="bg-white rounded-xl border border-blush shadow-warm-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 size={18} className="text-crimson-600 animate-spin" />
                    <div>
                      <p className="text-sm font-semibold text-warm-900">
                        AI Reading Your Screenshots...
                      </p>
                      <p className="text-xs text-warm-400">
                        Extracting subject names, grades, and units
                      </p>
                    </div>
                    <span className="ml-auto text-lg font-bold text-crimson-700">
                      {Math.round(scanProgress)}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-crimson-600 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      <span className="text-[10px] text-warm-400">Portal Auth</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      <span className="text-[10px] text-warm-400">Grid Detection</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Loader2 size={11} className="text-crimson-500 animate-spin" />
                      <span className="text-[10px] text-warm-400">Extracting OCR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {scanState === 'error' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Scanning Failed</p>
                    <p className="text-xs text-red-500 mt-0.5">{errorMessage}</p>
                    <button
                      onClick={handleScan}
                      className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Scan Button */}
              {images.length > 0 && scanState !== 'scanning' && (
                <button
                  onClick={handleScan}
                  className="w-full flex items-center justify-center gap-2 bg-crimson-700 hover:bg-crimson-800 active:bg-crimson-900 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <ScanLine size={16} />
                  Scan & Extract Grades ({images.length} {images.length === 1 ? 'image' : 'images'})
                </button>
              )}
            </>
          )}

          {/* ── Extracted Data Review ── */}
          {scanState === 'done' && scannedSubjects.length > 0 && (
            <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">

              {/* Review Header */}
              <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-blush">
                <div>
                  <h2 className="text-sm font-semibold text-warm-900">
                    Extracted Academic Data Review
                  </h2>
                  <p className="text-[10px] text-warm-400 mt-0.5">
                    AI found {scannedSubjects.length} subjects —
                    review and deselect any incorrect entries
                  </p>
                </div>
                {/* Rescan button */}
                <button
                  onClick={() => {
                    setScanState('idle');
                    setScannedSubjects([]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-blush text-warm-500 hover:text-crimson-700 hover:border-crimson-300 rounded-lg text-xs font-medium transition-colors"
                >
                  <ScanLine size={12} />
                  Rescan
                </button>
              </div>

              {/* Select All */}
              <div className="flex items-center justify-between px-4 md:px-5 py-2.5 border-b border-blush bg-warm-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === scannedSubjects.length}
                    onChange={toggleAll}
                    className="accent-crimson-600 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-warm-600 font-medium">
                    Select All ({selectedIds.size}/{scannedSubjects.length})
                  </span>
                </label>
                <div className="flex items-center gap-3 text-[10px] text-warm-400">
                  <span>Subject</span>
                  <span>Units</span>
                  <span>Grade</span>
                </div>
              </div>

              {/* Grouped by Term */}
              <div className="divide-y divide-blush">
                {Object.entries(groupedByTerm).map(([termLabel, items]) => (
                  <div key={termLabel}>
                    {/* Term Header */}
                    <div className="px-4 md:px-5 py-2 bg-crimson-50 border-b border-blush">
                      <p className="text-[11px] font-bold text-crimson-700 uppercase">
                        {termLabel}
                      </p>
                    </div>

                    {/* Subject Rows */}
                    {items.map(({ subject, index }) => (
                      <div
                        key={index}
                        onClick={() => toggleSubject(index)}
                        className={`flex items-center gap-3 px-4 md:px-5 py-3 cursor-pointer transition-colors
                          ${selectedIds.has(index)
                            ? 'bg-white hover:bg-warm-50'
                            : 'bg-warm-50 opacity-50 hover:opacity-70'
                          }`}
                      >
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedIds.has(index)}
                          onChange={() => toggleSubject(index)}
                          onClick={e => e.stopPropagation()}
                          className="accent-crimson-600 w-3.5 h-3.5 shrink-0"
                        />

                        {/* Subject Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-warm-700">
                              {subject.courseNumber}
                            </span>
                            {subject.isExcluded && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] text-warm-400 bg-warm-100 px-1.5 py-0.5 rounded-full">
                                <Lock size={8} /> Excluded
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-warm-500 truncate mt-0.5">
                            {subject.title}
                          </p>
                        </div>

                        {/* Units */}
                        <span className="text-xs font-medium text-warm-600 w-10 text-center shrink-0">
                          {subject.units.toFixed(1)}
                        </span>

                        {/* Grade */}
                        <span className={`text-sm font-bold w-10 text-right shrink-0
                          ${subject.grade === 0
                            ? 'text-warm-300'
                            : subject.grade >= 3.5
                              ? 'text-emerald-600'
                              : subject.grade >= 2.5
                                ? 'text-blue-600'
                                : 'text-crimson-600'
                          }`}>
                          {subject.grade === 0 ? '—' : subject.grade.toFixed(1)}
                        </span>

                        {/* Delete */}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setScannedSubjects(prev => prev.filter((_, i) => i !== index));
                            setSelectedIds(prev => {
                              const next = new Set(prev);
                              next.delete(index);
                              return next;
                            });
                          }}
                          className="p-1 text-warm-300 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Confirm Footer */}
              <div className="px-4 md:px-5 py-4 border-t border-blush bg-warm-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-xs text-warm-500">
                    <span className="font-semibold text-warm-700">{selectedIds.size}</span> subjects
                    will be synced to your Dashboard.
                    Excluded subjects won't affect your GWA.
                  </p>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setScanState('idle');
                        setScannedSubjects([]);
                        handleClearAll();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 border border-blush text-warm-500 hover:text-crimson-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Discard Scan
                    </button>
                    <button
                      onClick={handleConfirmSync}
                      disabled={selectedIds.size === 0}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-crimson-700 hover:bg-crimson-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Confirm & Sync to Dashboard
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ── Right — Instructions ── */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">

          {/* Best Format Card */}
          <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-blush bg-crimson-50">
              <Monitor size={14} className="text-crimson-700 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-crimson-700">
                  Use Desktop Mode Screenshot
                </p>
                <p className="text-[10px] text-crimson-500">
                  Required for accurate AI scanning
                </p>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-blush flex flex-col gap-2">
              <div className="flex items-start gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-700">✅ Desktop Mode</p>
                  <p className="text-[10px] text-emerald-600">
                    All columns visible — Course, Title, Grade, Units in one clean row
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <X size={13} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-600">❌ Mobile Normal Mode</p>
                  <p className="text-[10px] text-red-500">
                    Columns get cut off — grades and units become unreadable
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Smartphone size={11} className="text-warm-400" />
                <p className="text-[10px] text-warm-400 uppercase tracking-widest font-semibold">
                  How to enable Desktop Mode
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {HOW_TO_DESKTOP_MODE.map(item => (
                  <div key={item.device} className="px-3 py-2 bg-warm-50 border border-blush rounded-lg">
                    <p className="text-[11px] font-semibold text-warm-800 mb-0.5">{item.device}</p>
                    <p className="text-[10px] text-warm-500 leading-relaxed">{item.steps}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-blush">
              <Info size={14} className="text-crimson-700 shrink-0" />
              <p className="text-sm font-semibold text-warm-900">Tips for Accurate Scanning</p>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2">
              {DESKTOP_TIPS.map((tip, i) => (
                <div key={i} className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border ${tip.bg}`}>
                  <tip.icon size={13} className={`${tip.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-[11px] font-semibold ${tip.color} mb-0.5`}>{tip.title}</p>
                    <p className="text-[10px] text-warm-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Example */}
          <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-blush">
              <ImageIcon size={14} className="text-crimson-700 shrink-0" />
              <p className="text-sm font-semibold text-warm-900">Visual Example</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-warm-500 mb-2 leading-relaxed">
                Your screenshot should look like this:
              </p>
              <div className="rounded-lg border border-blush overflow-hidden text-[9px]">
                <div className="grid grid-cols-4 bg-warm-50 border-b border-blush px-2 py-1.5">
                  <span className="font-bold text-warm-600">Course</span>
                  <span className="font-bold text-warm-600 col-span-2">Title</span>
                  <span className="font-bold text-warm-600 text-right">Gr/Unit</span>
                </div>
                <div className="px-2 py-1.5 bg-crimson-50 border-b border-blush">
                  <span className="font-bold text-crimson-700">1ST SEM 2024-25 | 1ST YEAR</span>
                </div>
                {[
                  { code: 'CCE 101/L', title: 'INTRO TO COMPUTING', grade: '3.5', units: '3.0' },
                  { code: 'CCE 102/L', title: 'COMPUTER PROG 1', grade: '4.0', units: '3.0' },
                  { code: 'NSTP 1', title: 'NAT\'L SVC TRNG', grade: '3.5', units: '3.0' },
                ].map(row => (
                  <div key={row.code} className="grid grid-cols-4 px-2 py-1.5 border-b border-blush last:border-0">
                    <span className="text-warm-700 font-medium">{row.code}</span>
                    <span className="text-warm-600 col-span-2 truncate">{row.title}</span>
                    <span className="text-crimson-700 font-bold text-right">{row.grade}/{row.units}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-2 text-center">
                ✅ This format is ideal for AI scanning
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}