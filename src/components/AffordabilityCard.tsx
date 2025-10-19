import React from "react";

type Props = {
  safeBudget: number;       // from API (10% monthly income)
  estPayment?: number;      // from your simulator result (finance or lease)
};

export default function AffordabilityCard({ safeBudget, estPayment }: Props) {
  const payment = estPayment ?? 0;
  const diff = safeBudget - payment;
  const ok = payment <= safeBudget;

  return (
    <div className="w-full max-w-xl rounded-2xl bg-black/60 border border-white/10 p-5 shadow-lg">
      <h3 className="text-white font-bold text-lg mb-2">Affordability</h3>
      <div className="text-blue-100 text-sm mb-3">
        Rule of thumb: keep <span className="font-semibold">total car costs ≤ 10% of monthly income</span>.
      </div>
      <div className="grid grid-cols-2 gap-4 text-white">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-blue-200 text-sm">Safe Monthly Budget</div>
          <div className="text-2xl font-extrabold">${safeBudget}</div>
        </div>
        <div className={`rounded-xl p-4 ${ok ? "bg-green-500/20" : "bg-red-500/20"}`}>
          <div className="text-blue-200 text-sm">Estimated Payment</div>
          <div className="text-2xl font-extrabold">${payment}</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-blue-100">
        {ok ? "Nice! You’re within a conservative envelope." :
          `You’re over by ~$${Math.abs(diff).toFixed(0)}. Consider a larger down payment, longer term, or a lower trim.`}
      </div>
    </div>
  );
}
