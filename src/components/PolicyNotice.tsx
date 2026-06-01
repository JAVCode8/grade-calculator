import { Info } from 'lucide-react';

export default function PolicyNotice() {
  return (
    <div className="flex gap-3 bg-crimson-50 border-l-4 border-crimson-700 rounded-r-xl px-4 py-3">
      <Info size={16} className="text-crimson-700 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-crimson-700">Policy Notice</p>
        <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">
          NSTP and PAHF subjects are strictly excluded from the GWA calculation as per
          institutional academic policy. The calculator automatically filters these entries.
        </p>
      </div>
    </div>
  );
}