import React, { useState } from "react";

// Helper function to compute monthly payment for financing
function calcFinancePayment(price: number, down: number, rate: number, term: number) {
  // principal, interest rate (monthly), number of payments (months)
  const loanAmount = price - down;
  const monthlyRate = rate / 12 / 100;
  const payments = term * 12;
  return (
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -payments))
  );
}

// For lease: (price - residual) / lease term + interest/fees
function calcLeasePayment(price: number, down: number, leaseTerm: number = 36, residualPercent: number = 0.55) {
  const residual = price * residualPercent;
  return ((price - residual) / leaseTerm) + ((price + residual) * 0.0025) - down / leaseTerm;
}

type Props = {
  car: {
    name: string;
    price: number;
    monthly: number;
    description: string;
  };
  profile: {
    income: number;
    ssn: string;
  };
  onFinish: () => void; // transitions to dashboard etc.
};

const defaultApr = 3.9;

export const PaymentSimulator: React.FC<Props> = ({ car, profile, onFinish }) => {
  const [down, setDown] = useState(Math.round(car.price * 0.1));
  const [term, setTerm] = useState(5);
  const [apr, setApr] = useState(defaultApr);

  // Simulate credit score effect
  const creditScore =
    profile.ssn.length === 9
      ? 600 + (parseInt(profile.ssn[8]) % 4) * 50
      : 680; // Just a fake pattern for hackathon use!
  const aprSim = creditScore >= 750 ? 2.9 : creditScore >= 700 ? 3.9 : 5.9;

  // Recalculate with user's APR/score
  const financeMonthly = Math.round(
    calcFinancePayment(car.price, down, aprSim, term)
  );
  // Lease simulation
  const leaseMonthly = Math.round(
    calcLeasePayment(car.price, down)
  );

  return (
    <div className="bg-black bg-opacity-60 rounded-2xl p-8 max-w-lg mx-auto shadow-xl mt-10 flex flex-col gap-3">
      <h2 className="text-white font-bold text-xl mb-4">
        Payment Simulator ({car.name})
      </h2>
      <div className="flex gap-3 text-indigo-200">
        <div>
          <div>Down Payment ($):</div>
          <input
            className="rounded px-2 py-1 bg-slate-900 text-white w-32"
            type="number"
            min={0}
            max={car.price}
            value={down}
            onChange={e => setDown(Number(e.target.value))}
          />
        </div>
        <div>
          <div>Term (years):</div>
          <select
            className="rounded px-2 py-1 bg-slate-900 text-white"
            value={term}
            onChange={e => setTerm(Number(e.target.value))}
          >
            {[3, 4, 5, 6, 7].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <div>Your Credit Score:</div>
          <span className="font-bold text-yellow-400">{creditScore}</span>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="flex-1 bg-indigo-800 rounded-xl shadow p-4 text-white">
          <div className="font-bold">Finance</div>
          <div>
            <span className="text-indigo-200">APR: </span>
            <span className="font-bold">{aprSim}%</span>
          </div>
          <div>
            <span className="text-indigo-200">Monthly Payment: </span>
            <span className="font-bold text-yellow-300">${financeMonthly}</span>
          </div>
        </div>
        <div className="flex-1 bg-purple-800 rounded-xl shadow p-4 text-white">
          <div className="font-bold">Lease</div>
          <div>
            <span className="text-indigo-200">Term: </span>
            <span className="font-bold">36 mo</span>
          </div>
          <div>
            <span className="text-indigo-200">Est. Payment: </span>
            <span className="font-bold text-yellow-300">${leaseMonthly}</span>
          </div>
        </div>
      </div>
      <button
        className="mt-7 rounded bg-gradient-to-r from-indigo-700 to-purple-500 text-white px-6 py-3 font-bold"
        onClick={onFinish}
      >
        Continue to Dashboard
      </button>
    </div>
  );
};
