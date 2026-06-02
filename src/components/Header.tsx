// 1. React core
import { useState } from 'react';

// 2. Third-party
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, ScanLine, X, AlertCircle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
interface HeaderProps {
  gwa: number;
  honor: string;
}

// ─── Constants ───────────────────────────────────────────
const EXCLUDED_NOTICE = 'Reminder: NSTP, PAHF (Movement Competency Training), PE, CWTS, LTS, ROTC, and CAED subjects are automatically excluded from GWA computation per UM academic policy.';

// ─── Component ───────────────────────────────────────────
export default function Header({ gwa, honor }: HeaderProps) {
  const [showBanner, setShowBanner] = useState(true);

  const navItems = [
    { to: '/',        label: 'Dashboard', icon: LayoutDashboard },
    { to: '/honors',  label: 'Honors',    icon: Trophy          },
    { to: '/scanner', label: 'AI Scanner', icon: ScanLine       },
  ];

  return (
    <header className="bg-white border-b border-blush shadow-warm-sm">

      {/* ── Dismissible Reminder Banner ── */}
      {showBanner && (
        <div className="bg-crimson-50 border-b border-crimson-200 px-4 py-2 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <AlertCircle size={14} className="text-crimson-700 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] sm:text-xs text-crimson-700 leading-relaxed">
              {EXCLUDED_NOTICE}
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="shrink-0 p-0.5 text-crimson-400 hover:text-crimson-700 transition-colors rounded"
            aria-label="Dismiss reminder"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Top Row ── */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-crimson-700 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <div>
            <span className="hidden sm:block text-crimson-700 font-bold text-sm tracking-wide">
              UMDC Academic Portal
            </span>
            <span className="block sm:hidden text-crimson-700 font-bold text-sm tracking-wide">
              UMDC Portal
            </span>
          </div>
        </div>

        {/* GWA + Honor */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-right">
            <p className="text-[9px] md:text-[10px] text-warm-500 uppercase tracking-widest">
              Cumulative GWA
            </p>
            <p className="text-xl md:text-2xl font-bold text-crimson-700 leading-none">
              {gwa > 0 ? gwa.toFixed(2) : '—'}
            </p>
          </div>

          <div className="border-l border-blush pl-3 md:pl-6 text-right">
            <p className="text-[9px] md:text-[10px] text-warm-500 uppercase tracking-widest">
              Projected Honor
            </p>
            {gwa > 0 ? (
              <>
                <p className="block sm:hidden text-xs font-semibold text-warm-800">
                  {honor === 'Summa Cum Laude' ? 'Summa' :
                   honor === 'Magna Cum Laude' ? 'Magna' :
                   honor === 'Cum Laude'       ? 'Cum Laude' : 'No Honor'}
                </p>
                <p className="hidden sm:block text-sm font-semibold text-warm-800">
                  {honor}
                </p>
              </>
            ) : (
              <p className="text-xs md:text-sm font-semibold text-warm-800">—</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav Row ── */}
      <div className="px-2 md:px-6 flex items-center gap-1 border-t border-blush overflow-x-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${isActive
                ? 'border-crimson-700 text-crimson-700'
                : 'border-transparent text-warm-500 hover:text-crimson-700 hover:border-crimson-200'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </div>

    </header>
  );
}