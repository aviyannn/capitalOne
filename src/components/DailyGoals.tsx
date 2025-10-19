import React from "react";

type Goal = {
  id: string;
  description: string;
  completed: boolean;
};

type Props = {
  goals: Goal[];
  onComplete: (goalId: string) => void;
};

const DailyGoals: React.FC<Props> = ({ goals, onComplete }) => (
  <div className="bg-black bg-opacity-60 rounded-2xl shadow-xl p-6 mx-auto mb-6 max-w-md w-full">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-indigo-300 font-bold text-lg">Today's Cosmic Goals</h2>
    </div>
    <ul>
      {goals.map(goal => (
        <li key={goal.id} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={() => onComplete(goal.id)}
            className="mr-2 accent-indigo-400"
          />
          <span className={goal.completed ? "line-through text-slate-400" : "text-white"}>
            {goal.description}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default DailyGoals;
