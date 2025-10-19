import React, { useMemo, useState } from "react";

type Props = {
  targetAmount: number;      // e.g. down payment or goal target
  currentSaved: number;      // e.g. 0 for now
};

export default function ProjectionCard({ targetAmount, currentSaved }: Props) {
  const [monthlySave, setMonthlySave] = useState(300);
  const remaining = Math.max(0, targetAmount - currentSaved);
  const months = monthlySave > 0 ? Math.ceil(remaining / monthlySave) : Infinity;
  const years = months === Infinity ? "∞" : (months/12).toFixed(1);

  const label = useMemo(() => {
    if (remaining <= 0) return "You’ve reached your target 🎉";
    return `${months} mo (${years} yr) at $${monthlySave}/mo`;
  }, [months, years, monthlySave, remaining]);

  return (
    <div className="w-full max-w-xl rounded-2xl bg-black/60 border border-white/10 p-5 shadow-lg">
      <h3 className="text-white font-bold text-lg mb-2">Savings Projection</h3>
      <div className="text-blue-100 text-sm mb-2">
        Target: <span className="font-semibold">${targetAmount}</span> • Current: <span className="font-semibold">${currentSaved}</span>
      </div>
      <input
        type="range"
        min={50}
        max={2000}
        step={50}
        value={monthlySave}
        onChange={(e) => setMonthlySave(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="mt-2 text-white font-semibold">{label}</div>
    </div>
  );
}
