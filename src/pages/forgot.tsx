import Head from "next/head";
import { useState, useEffect } from "react";
import Starfield from "../components/Starfield";
import CelestialCanvas from "../components/CelestialCanvas";
import { createClientBrowser } from "@/lib/supabase";

export default function Forgot() {
  const supabase = createClientBrowser();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/reset`,
      });
      if (error) throw error;
      setMsg("Check your inbox for the reset link.");
    } catch (e: any) {
      const m = (e?.message || "").toLowerCase();
      if (m.includes("rate limit")) setErr("You’ve requested a few times—try again shortly.");
      else if (m.includes("smtp") || m.includes("email")) setErr("Email couldn’t be sent. Check SMTP settings.");
      else setErr(e?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Reset Password | Car Cosmos</title></Head>

      {/* Background stack */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#040718] to-[#0b1739]" />
      <Starfield />                            {/* likely z below 0 */}
      <CelestialCanvas hideLabels />           {/* animated planets layer */}

      {/* Foreground */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={handleReset}
          className="mx-auto max-w-xs w-full rounded-3xl shadow-2xl bg-gradient-to-br from-[#1a193b] to-[#121228] backdrop-blur-xl border border-blue-600/30 px-6 py-9 flex flex-col items-center"
        >
          <span className="block w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 flex items-center justify-center text-2xl">
            🔑
          </span>
          <h1 className="text-2xl font-extrabold text-white mb-1">Lost in Space?</h1>
          <p className="text-base text-blue-100 mb-5 text-center">Enter your email to receive a reset link.</p>

          <input
            type="email"
            required
            placeholder="Email"
            className="max-w-xs w-full rounded-xl px-4 py-3 text-base text-white bg-blue-900/40 placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 border-none mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {err && <div className="w-full text-red-300 text-sm mb-2">{err}</div>}
          {msg && <div className="w-full text-green-300 text-sm mb-2">{msg}</div>}

          <button
            type="submit"
            className="max-w-xs w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending…" : "Reset Password"}
          </button>

          <a href="/login" className="text-blue-300 hover:underline text-sm mt-4">
            Back to Login
          </a>
        </form>
      </main>
    </>
  );
}
