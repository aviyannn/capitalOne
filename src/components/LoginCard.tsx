// src/components/LoginCard.tsx
import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase";

const quotes = [
  "The stars don’t rush — they rise with purpose.",
  "Set your sights higher than the sky; aim for the stars.",
  "Dream big enough to need the whole universe.",
  "Every goal you set is a new star in your galaxy.",
];

const LoginCard: React.FC = () => {
  const supabase = createClientBrowser();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // avoid double submits
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          const msg = (error.message || "").toLowerCase();
          if (msg.includes("rate limit")) {
            setMode("signin");
            setError("You’ve tried this a few times. Try signing in instead.");
            return;
          }
          if (msg.includes("already registered")) {
            setMode("signin");
            setError("Account exists — try signing in.");
            return;
          }
          throw error;
        }
        if (!data.session) {
          setError("Check your email to confirm your account, then sign in.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  }

  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="mx-auto max-w-xs rounded-3xl shadow-2xl bg-gradient-to-br from-[#1a193b] to-[#121228] backdrop-blur-xl border border-blue-600/30 px-6 py-9 flex flex-col items-center z-20">
      <div className="mb-6">
        <span className="block w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 flex items-center justify-center text-3xl">
          🪐
        </span>
      </div>

      <h1 className="text-2xl font-extrabold text-white mb-1">
        {mode === "signup" ? "Create Your Orbit" : "Enter Your Orbit"}
      </h1>
      <p className="text-base text-blue-100 mb-5 text-center">
        Reach for the stars—your cosmic journey starts here.
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          className="max-w-xs w-full rounded-xl px-4 py-3 text-base text-white bg-blue-900/40 placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 border-none mx-auto"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="max-w-xs w-full rounded-xl px-4 py-3 text-base text-white bg-blue-900/40 placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 border-none mx-auto"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-300 font-semibold -mt-2 text-center">{error}</div>}

        <button
          type="submit"
          className="max-w-xs w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition mx-auto disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "🚀 Launching..." : mode === "signup" ? "Create Account" : "🚀 Launch"}
        </button>
      </form>

      <div className="text-blue-200 text-sm mt-4 flex flex-row space-x-3">
        <button
          type="button"
          className="text-blue-300 hover:underline"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          disabled={loading}
        >
          {mode === "signup" ? "Have an account? Sign in" : "New here? Create New Orbit"}
        </button>
        <span>•</span>
        <a className="text-blue-300 hover:underline" href="/forgot">Lost in Space?</a>
      </div>

      <div className="text-blue-100 mt-2 text-base opacity-90 text-center">{todayQuote}</div>
    </div>
  );
};

export default LoginCard;
