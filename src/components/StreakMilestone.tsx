import React from "react";

type Props = {
  streak: number;
  milestones: string[];
};

const StreakMilestone: React.FC<Props> = ({ streak, milestones }) => (
  <div className="flex flex-col items-center my-6">
    <div className="bg-indigo-800 rounded-xl px-6 py-2 text-yellow-300 font-bold shadow-lg">
      Streak: {streak} 🔥
    </div>
    <div className="flex gap-3 mt-4">
      {milestones.map((ms, idx) => (
        <div
          key={ms + idx}
          className="bg-gradient-to-tr from-yellow-200 to-pink-300 px-3 py-1 rounded-lg text-black font-semibold shadow"
        >
          {ms}
        </div>
      ))}
    </div>
  </div>
);

export default StreakMilestone;
