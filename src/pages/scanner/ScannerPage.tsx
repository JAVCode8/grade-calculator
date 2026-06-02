// 1. React core
import { useState, useRef, useCallback } from 'react';

// 2. Third-party
import {
  ScanLine,
  Upload,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Info,
  ImageIcon,
  X,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
interface ScannerPageProps {
  onSyncToTerms?: (subjects: ScannedSubject[]) => void;
}

export interface ScannedSubject {
  name: string;
  grade: number;
  units: number;
  isExcluded: boolean;
  termLabel: string;
}

// ─── Constants ───────────────────────────────────────────
const DESKTOP_TIPS = [
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Include the Header Row',
    desc: 'Make sure "Course Number / School Year", "Descriptive Title of Course", "Final Grade", and "Unit" columns are fully visible.',
  },
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Include the Term Title',
    desc: 'The red text block showing the semester and year level (e.g., "1ST SEMESTER 2024-25 | 1ST YEAR-COLLEGE OF COMPUTING EDUCATION") must not be cropped.',
  },
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Use High Resolution',
    desc: 'Avoid blurry or skewed screenshots. Use a clear desktop or desktop-mode browser screenshot for best results.',
  },
  {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200',
    title: 'Avoid Mobile Normal Mode',
    desc: 'In normal mobile mode, columns get cut off and grades become unreadable. Always use Desktop Mode on your browser.',
  },
];

const HOW_TO_DESKTOP_MODE = [
  {
    device: '📱 iPhone — Method 1 (Easiest)',
    steps: 'Open the UMDC portal in Safari → Tap the "aA" icon on the LEFT side of the address bar → Tap "Request Desktop Website" → Take a screenshot',
  },
  {
    device: '📱 iPhone — Method 2 (Share button)',
    steps: 'Tap the Share button (⬆️) at the bottom → Scroll left in the top row of icons → Tap "Request Desktop Website" → Take a screenshot',
  },
  {
    device: '📱 iPhone — Always Desktop Mode',
    steps: 'Go to iPhone Settings → Apps → Safari → Request Desktop Website → Toggle ON "All Websites" — Safari will always show desktop view',
  },
  {
    device: '📱 Android (Chrome)',
    steps: 'Tap the 3-dot menu (⋮) at top right → Check "Desktop site" → Take a screenshot',
  },
  {
    device: '💻 Desktop / Laptop',
    steps: 'Just take a screenshot normally — you\'re already in desktop mode',
  },
];

// ─── Component ───────────────────────────────────────────
export default function ScannerPage({ onSyncToTerms }: ScannerPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Drag & Drop Handlers ──
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  }, []);

  const handleImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-lg font-bold text-warm-900">AI Portal Grade Scanner</h1>
        <p className="text-xs text-warm-400 mt-0.5">
          Upload a screenshot of your UMDC Student Portal to automatically extract your grades.
        </p>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Left — Upload + Preview ── */}
        <div className="flex flex-col gap-4 flex-1 w-full">

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !image && fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed transition-all
              ${image
                ? 'border-crimson-200 bg-white cursor-default'
                : isDragging
                  ? 'border-crimson-500 bg-crimson-50 cursor-copy scale-[1.01]'
                  : 'border-blush bg-white hover:border-crimson-300 hover:bg-crimson-50 cursor-pointer'
              }`}
          >
            {image ? (
              /* ── Image Preview ── */
              <div className="relative">
                <img
                  src={image}
                  alt="Portal screenshot"
                  className="w-full rounded-xl object-contain max-h-[500px]"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 bg-white border border-blush rounded-full shadow-warm-sm text-warm-500 hover:text-crimson-600 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-3 left-3 bg-white border border-blush rounded-lg px-3 py-1.5 shadow-warm-sm">
                  <p className="text-[11px] text-warm-600 font-medium">
                    {imageFile?.name}
                  </p>
                </div>
              </div>
            ) : (
              /* ── Empty State ── */
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors
                  ${isDragging ? 'bg-crimson-100' : 'bg-crimson-50'}`}>
                  <ScanLine size={24} className="text-crimson-600" />
                </div>
                <p className="text-sm font-semibold text-warm-800 mb-1">
                  {isDragging ? 'Drop your screenshot here' : 'Drop your portal screenshot here'}
                </p>
                <p className="text-xs text-warm-400 mb-4">
                  or click to browse your files
                </p>
                <div className="flex items-center gap-2 px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white rounded-lg transition-colors">
                  <Upload size={14} />
                  <span className="text-sm font-medium">Choose Screenshot</span>
                </div>
                <p className="text-[10px] text-warm-300 mt-3">
                  Supports PNG, JPG, JPEG, WEBP
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Scan Button — shown after image upload */}
          {image && (
            <button
              className="w-full flex items-center justify-center gap-2 bg-crimson-700 hover:bg-crimson-800 active:bg-crimson-900 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <ScanLine size={16} />
              Scan & Extract Grades
            </button>
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

            {/* Format Comparison */}
            <div className="px-4 py-3 border-b border-blush flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    ✅ Desktop Mode (Recommended)
                  </p>
                  <p className="text-[10px] text-emerald-600">
                    All columns visible — Course, Title, Grade, Units in one clean row
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <X size={13} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-600">
                    ❌ Mobile Normal Mode
                  </p>
                  <p className="text-[10px] text-red-500">
                    Columns get cut off — grades and units become unreadable
                  </p>
                </div>
              </div>
            </div>

            {/* How to enable desktop mode */}
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
                    <p className="text-[11px] font-semibold text-warm-800 mb-0.5">
                      {item.device}
                    </p>
                    <p className="text-[10px] text-warm-500 leading-relaxed">
                      {item.steps}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-blush">
              <Info size={14} className="text-crimson-700 shrink-0" />
              <p className="text-sm font-semibold text-warm-900">
                Tips for Accurate Scanning
              </p>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2">
              {DESKTOP_TIPS.map((tip, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border ${tip.bg}`}
                >
                  <tip.icon size={13} className={`${tip.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-[11px] font-semibold ${tip.color} mb-0.5`}>
                      {tip.title}
                    </p>
                    <p className="text-[10px] text-warm-500 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Example Card */}
          <div className="bg-white rounded-xl border border-blush shadow-warm-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-blush">
              <ImageIcon size={14} className="text-crimson-700 shrink-0" />
              <p className="text-sm font-semibold text-warm-900">Visual Example</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] text-warm-500 mb-2 leading-relaxed">
                Your screenshot should look like this — all columns visible in one row:
              </p>
              {/* Mock table preview */}
              <div className="rounded-lg border border-blush overflow-hidden text-[9px]">
                <div className="grid grid-cols-4 bg-warm-50 border-b border-blush px-2 py-1.5">
                  <span className="font-bold text-warm-600">Course No.</span>
                  <span className="font-bold text-warm-600 col-span-2">Title</span>
                  <span className="font-bold text-warm-600 text-right">Grade / Unit</span>
                </div>
                <div className="px-2 py-1.5 bg-crimson-50 border-b border-blush">
                  <span className="font-bold text-crimson-700 text-[9px]">
                    1ST SEMESTER 2024-25 | 1ST YEAR
                  </span>
                </div>
                {[
                  { code: 'CCE 101/L', title: 'INTRO TO COMPUTING', grade: '3.5', units: '3.0' },
                  { code: 'CCE 102/L', title: 'COMPUTER PROG 1', grade: '4.0', units: '3.0' },
                  { code: 'NSTP 1', title: 'NAT\'L SERVICE TRNG', grade: '3.5', units: '3.0' },
                ].map(row => (
                  <div
                    key={row.code}
                    className="grid grid-cols-4 px-2 py-1.5 border-b border-blush last:border-0"
                  >
                    <span className="text-warm-700 font-medium">{row.code}</span>
                    <span className="text-warm-600 col-span-2">{row.title}</span>
                    <span className="text-crimson-700 font-bold text-right">
                      {row.grade} / {row.units}
                    </span>
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