import Head from "next/head";
import { useEffect, useState } from "react";
import Starfield from "../components/Starfield";
import CelestialCanvas from "../components/CelestialCanvas";
import { createClientBrowser } from "@/lib/supabase";

export default function ResetPassword() {
  const supabase = createClientBrowser();

  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.data.subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null);

    if (pw.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (pw !== pw2)   { setErr("Passwords do not match."); return; }

    setLoading(true);
    try {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { setErr("Recovery session not found. Open the email link again."); return; }
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;

      setMsg("Password updated! Redirecting to login…");
      setTimeout(() => (window.location.href = "/login"), 1200);
    } catch (e: any) {
      setErr(e?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Set New Password | Car Cosmos</title></Head>

      {/* Background stack */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#040718] to-[#0b1739]" />
      <Starfield />
      <CelestialCanvas hideLabels />

      {/* Foreground */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-xs w-full rounded-3xl shadow-2xl bg-gradient-to-br from-[#1a193b] to-[#121228] backdrop-blur-xl border border-blue-600/30 px-6 py-9 flex flex-col items-center"
        >
          <span className="block w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 flex items-center justify-center text-2xl">
            ✨
          </span>
          <h1 className="text-2xl font-extrabold text-white mb-1">Set a New Password</h1>
          <p className="text-base text-blue-100 mb-5 text-center">
            {ready ? "Choose a strong password." : "Verifying your reset link…"}
          </p>

          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            className="max-w-xs w-full rounded-xl px-4 py-3 text-base text-white bg-blue-900/40 placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 border-none mb-3"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={!ready || loading}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Confirm password"
            className="max-w-xs w-full rounded-xl px-4 py-3 text-base text-white bg-blue-900/40 placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 border-none mb-4"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            disabled={!ready || loading}
          />

          {err && <div className="w-full text-red-300 text-sm mb-2">{err}</div>}
          {msg && <div className="w-full text-green-300 text-sm mb-2">{msg}</div>}

          <button
            type="submit"
            className="max-w-xs w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold shadow-lg hover:scale-105 transition disabled:opacity-60"
            disabled={!ready || loading}
          >
            {loading ? "Updating…" : "Update Password"}
          </button>

          <a href="/login" className="text-blue-300 hover:underline text-sm mt-4">
            Back to Login
          </a>
        </form>
      </main>
    </>
  );
}
