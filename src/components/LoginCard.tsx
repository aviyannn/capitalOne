import { useState } from "react";

const quotes = [
  "The stars don’t rush — they rise with purpose.",
  "Set your sights higher than the sky; aim for the stars.",
  "Even the smallest star shines in the darkness.",
  "Dream big enough to need the whole universe.",
  "Every goal you set is a new star in your galaxy.",
  "Shape your future—one constellation at a time.",
];

const LoginCard: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1200);
  };

  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="absolute top-1/2 left-1/2 z-30" style={{transform: "translate(-50%, -54%)"}}>
      <div className="min-w-[340px] max-w-lg rounded-3xl shadow-[0_16px_44px_0_rgba(13,30,43,0.6)] border-[2.5px] border-[#6db3ff3a] bg-[#06091bbd] text-center animate-fadeIn backdrop-blur-2xl px-10 py-12">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-radial from-[#236cf5] to-[#20125d] shadow-lg border-4 border-[#74c5ff37] flex items-center justify-center"
            style={{
              backgroundImage:
              "url('https://cdn-icons-png.flaticon.com/512/616/616430.png')",
              backgroundSize: "80% 80%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
        />
        <h1 className="text-3xl font-bold text-[#DAF2FF] mb-1 tracking-wide">Enter Your Orbit</h1>
        <p className="text-base text-[#b7d0fa] mb-5">Reach for the stars—your cosmic journey starts here.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" required placeholder="Email"
                 className="w-full rounded-xl px-4 py-3 text-lg text-[#E0F0FB] bg-[#1e325a32] focus:outline-blue-600 shadow"
          />
          <input type="password" required minLength={6} placeholder="Password"
                 className="w-full rounded-xl px-4 py-3 text-lg text-[#E0F0FB] bg-[#1e325a32] focus:outline-blue-600 shadow"
          />
          <button type="submit"
                  className="w-full py-3 text-base rounded-full font-semibold bg-gradient-to-r from-[#16aaff] to-[#5d3bdf] text-white shadow-lg border border-[#856cff44] animate-pulse transition disabled:opacity-60"
                  disabled={loading}>
            {loading ? '🚀 Launching...' : '🚀 Launch'}
          </button>
        </form>
        {error && <div className="text-[#fabebe] mt-2">{error}</div>}
        <div className="text-[#bee7ffec] mt-5 text-sm">
          <a href="/signup" className="text-[#7ec6ff] hover:underline">Create New Orbit</a> •
          <a href="/forgot" className="text-[#7ec6ff] hover:underline">Lost in Space?</a>
        </div>
        <div className="text-[#feebff] mt-6 text-base opacity-90">{todayQuote}</div>
      </div>
    </div>
  );
};

export default LoginCard;

