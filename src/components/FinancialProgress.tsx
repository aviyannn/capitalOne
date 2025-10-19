import React from "react";

type Props = {
  goal: string;
  percent: number;
};

const FinancialProgress: React.FC<Props> = ({ goal, percent }) => (
  <div className="my-5 mx-auto w-full max-w-md bg-slate-800 rounded-xl p-4 shadow-lg text-white">
    <div className="mb-2 font-semibold">
      Journey toward <span className="text-yellow-300">{goal}</span>
    </div>
    <div className="w-full bg-slate-900 rounded h-4">
      <div
        className="bg-indigo-400 h-4 rounded transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
    <div className="text-right mt-1 text-indigo-200">{percent}% complete</div>
  </div>
);

export default FinancialProgress;
