import React from "react";

type Props = {
  spendByCat: Record<string, number>;
};

const COLORS = ["#8ab4ff", "#b388ff", "#7ee787", "#ffd166", "#ff8fab", "#9ae6b4"];

export default function SpendingOverview({ spendByCat }: Props) {
  const entries = Object.entries(spendByCat).sort((a,b) => b[1]-a[1]).slice(0,6);
  const max = Math.max(1, ...entries.map(([,v]) => v));

  return (
    <div className="w-full max-w-xl rounded-2xl bg-black/60 border border-white/10 p-5 shadow-lg">
      <h3 className="text-white font-bold text-lg mb-3">This month’s spending</h3>
      <div className="space-y-3">
        {entries.map(([cat, val], i) => (
          <div key={cat} className="flex items-center gap-3">
            <div className="w-28 text-sm text-blue-100 truncate">{cat}</div>
            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(val/max)*100}%`, background: COLORS[i % COLORS.length] }}
                title={`$${val.toFixed(0)}`}
              />
            </div>
            <div className="w-16 text-right text-sm text-blue-100">${val.toFixed(0)}</div>
          </div>
        ))}
        {entries.length === 0 && <div className="text-blue-200 text-sm">No transactions yet.</div>}
      </div>
    </div>
  );
}
