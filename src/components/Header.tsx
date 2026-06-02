import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine } from 'lucide-react';

interface HeaderProps {
  gwa: number;
  honor: string;
}

export default function Header({ gwa, honor }: HeaderProps) {
  const navItems = [
    { to: '/',        label: 'Dashboard',  icon: LayoutDashboard },
    { to: '/scanner', label: 'AI Scanner', icon: ScanLine },
  ];

  return (
    <header className="bg-white border-b border-blush shadow-warm-sm">

      {/* Top Row */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-crimson-700 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <div>
            <span className="hidden sm:block text-crimson-700 font-bold text-sm tracking-wide">
              GWA Calculator
            </span>
            <span className="block sm:hidden text-crimson-700 font-bold text-sm tracking-wide">
              GWA Calculator
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
                   honor === 'Cum Laude' ? 'Cum Laude' : 'No Honor'}
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

      {/* Nav Row — using NavLink for active styles */}
      <div className="px-2 md:px-6 flex items-center gap-1 border-t border-blush">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors
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