import { LayoutDashboard, ScanLine } from 'lucide-react';

type ActiveView = 'dashboard' | 'scanner';

interface HeaderProps {
  gwa: number;
  honor: string;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export default function Header({ gwa, honor, activeView, setActiveView }: HeaderProps) {
  const navItems = [
    { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner' as ActiveView, label: 'AI Scanner', icon: ScanLine },
  ];

  return (
    <header className="bg-white border-b border-red-100 shadow-sm">

      {/* Top Row — Logo + GWA */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          {/* Hide full name on very small screens */}
          <div>
            <span className="hidden sm:block text-red-700 font-bold text-sm tracking-wide">
              UMDC Academic Portal
            </span>
            <span className="block sm:hidden text-red-700 font-bold text-sm tracking-wide">
              UMDC Portal
            </span>
          </div>
        </div>

        {/* GWA + Honor — stacks tighter on mobile */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-right">
            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest">
              Cumulative GWA
            </p>
            <p className="text-xl md:text-2xl font-bold text-red-600 leading-none">
              {gwa > 0 ? gwa.toFixed(2) : '—'}
            </p>
          </div>

          <div className="border-l border-red-100 pl-3 md:pl-6 text-right">
            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest">
              Projected Honor
            </p>
            {/* Truncate long honor names on mobile */}
            <p className="text-xs md:text-sm font-semibold text-gray-700 max-w-[90px] md:max-w-none truncate">
              {gwa > 0 ? honor : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Row */}
      <div className="px-2 md:px-6 flex items-center gap-1 border-t border-red-50">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`flex items-center gap-2 px-3 md:px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeView === id
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-200'
              }`}
          >
            <Icon size={15} />
            {/* Always show label — it's short enough */}
            {label}
          </button>
        ))}
      </div>

    </header>
  );
}