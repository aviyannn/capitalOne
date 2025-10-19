// src/components/PaymentSimulator.tsx

import React from "react";

interface PaymentSimulatorProps {
  car: {
    name: string;
    price: number;
    monthly: number;
    description?: string;
  };
  profile: {
    income: number;
    creditScore: number;
    lifestyle?: string;
  };
  onFinish: () => void;
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({
  car,
  profile,
  onFinish,
}) => {
  // Use provided creditScore; fallback if missing
  const creditScore = profile.creditScore || 700;

  // Simple APR logic based on creditScore
  const aprSim =
    creditScore >= 750 ? 2.9 : creditScore >= 700 ? 3.9 : 5.9;

  // Calculate monthly payment (basic version)
  const months = 60;
  const principal = car.price;
  const aprDecimal = aprSim / 100 / 12;
  const monthly =
    aprDecimal > 0
      ? (principal * aprDecimal) /
        (1 - Math.pow(1 + aprDecimal, -months))
      : principal / months;

  return (
    <div className="rounded-3xl shadow-2xl bg-gradient-to-br from-[#151e2c] to-[#090f1e] max-w-lg p-10 border border-blue-500/30 text-center">
      <h2 className="text-white text-2xl font-bold mb-4">Payment Simulation</h2>
      <div className="text-blue-200 mb-2">
        <b>Car:</b> {car.name}
      </div>
      <div className="text-blue-200 mb-2">
        <b>Price:</b> ${car.price.toLocaleString()}
      </div>
      <div className="text-blue-200 mb-2">
        <b>Credit Score:</b> {creditScore}
      </div>
      <div className="text-blue-200 mb-2">
        <b>APR:</b> {aprSim}% (simulated)
      </div>
      <div className="text-blue-200 mb-6">
        <b>Estimated Monthly Payment: </b>
        <span className="text-white font-semibold">
          ${monthly.toFixed(2)}
        </span>
      </div>
      <button
        onClick={onFinish}
        className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition"
      >
        Finish & Go!
      </button>
    </div>
  );
};
