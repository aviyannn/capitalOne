import { useState, useEffect } from "react";

// You could randomize or rotate challenges here!
const dailyChallenges = [
  { challenge: "Try to spend $5 less on lunch today for a power-up!", category: "Food", amount: 5 },
  { challenge: "Skip one coffee shop visit this week and save $4!", category: "Coffee", amount: 4 },
  { challenge: "Log every expense for 2 days straight to boost your streak!", streak: 2 },
  { challenge: "Bring your own lunch and save $7 today!", category: "Food", amount: 7 },
];

function pickChallenge() {
  // Deterministic: rotate based on day or use random
  const index = new Date().getDate() % dailyChallenges.length;
  return dailyChallenges[index];
}

export default function CosmicChallengePanel({ onComplete, completed }) {
  const [challenge, setChallenge] = useState(pickChallenge());

  // Optional: Support changing daily, could store date-completed in DB/localStorage
  useEffect(() => {
    setChallenge(pickChallenge());
  }, []);

  return (
    <div className="cosmic-challenge bg-gradient-to-r from-purple-700 to-blue-900 p-4 mb-4 rounded-xl shadow-lg">
      <h2 className="text-white text-xl font-bold">🚀 Cosmic Challenge</h2>
      <p className="text-blue-100 mb-2">{challenge.challenge}</p>
      <button
        onClick={onComplete}
        disabled={completed}
        className={`mt-2 py-2 px-4 ${completed ? "bg-gray-400" : "bg-indigo-500 hover:scale-105"} rounded shadow text-white font-bold transition`}
      >
        {completed ? "Completed!" : "Mark Complete"}
      </button>
    </div>
  );
}
