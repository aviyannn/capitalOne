import React, { useState } from "react";
import NebulaOverlay from "./NebulaOverlay"; // Adjust path as needed

type Props = {
  onComplete: (profile: {
    name: string;
    income: number;
    ssn: string;
    creditScore: number;
    lifestyle: string;
    modelPrefs: string[];
  }) => void;
};

const toyotaModels = [
  "Camry", "Corolla", "Prius", "Highlander", "RAV4"
];

export const UserProfileForm: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [income, setIncome] = useState<string>("");;
  const [ssn, setSsn] = useState("");
  const [creditScore, setCreditScore] = useState<number>(700);
  const [lifestyle, setLifestyle] = useState("");
  const [modelPrefs, setModelPrefs] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onComplete({
      name,
      income: Number(income), // <--- this ensures 'income' is treated as a number later
      ssn,
      creditScore,
      lifestyle,
      modelPrefs
    });
  }
  

  function handleToggleModel(model: string) {
    setModelPrefs(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NebulaOverlay />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gradient-to-b from-indigo-950/80 via-black/70 to-purple-950/80 backdrop-blur-lg rounded-2xl p-8 max-w-lg mx-auto shadow-2xl flex flex-col gap-5 border border-indigo-600"
        style={{ boxShadow: "0 8px 48px 12px rgba(80,60,255,0.14)" }}
      >
        <h2 className="text-white font-bold text-3xl mb-2 text-center drop-shadow">
          Personalize Your Journey
        </h2>
        <input
          className="rounded px-3 py-2 bg-slate-900/80 text-white"
          type="text" placeholder="Name" value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
            className="rounded px-3 py-2 bg-slate-900/80 text-white"
            type="number"
            placeholder="Annual Income"
            value={income}
            onChange={e => setIncome(e.target.value)}
             required
        />

        <input
          className="rounded px-3 py-2 bg-slate-900/80 text-white"
          type="text" placeholder="Social Security Number" value={ssn}
          onChange={e => setSsn(e.target.value)}
          required maxLength={9}
        />
        <div>
          <label className="block text-indigo-300 mb-1">Credit Score <span className="text-xs text-sky-400">(300–850)</span></label>
          <input
            className="rounded px-3 py-2 bg-slate-900/80 text-white w-full"
            type="number" min={300} max={850}
            placeholder="Credit Score"
            value={creditScore}
            onChange={e => setCreditScore(Number(e.target.value))}
            required
          />
        </div>
        <select
          className="rounded px-3 py-2 bg-slate-900/80 text-white"
          value={lifestyle}
          onChange={e => setLifestyle(e.target.value)}
          required
        >
          <option value="">Select Lifestyle</option>
          <option value="Family">Family</option>
          <option value="Commuting">Commuting</option>
          <option value="Adventure">Adventure/Outdoors</option>
          <option value="Simple/City">Simple/City</option>
        </select>
        <div>
          <div className="text-indigo-300 mb-1">Preferred Toyota Models:</div>
          <div className="flex flex-wrap gap-2">
            {toyotaModels.map(model => (
              <label key={model} className="flex items-center gap-1 text-white">
                <input
                  type="checkbox"
                  checked={modelPrefs.includes(model)}
                  onChange={() => handleToggleModel(model)}
                />
                {model}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="rounded bg-gradient-to-r from-indigo-700 to-purple-500 text-white px-4 py-3 text-lg font-bold mt-2 shadow-lg"
        >
          Next: Find Your Car
        </button>
      </form>
    </div>
  );
};
