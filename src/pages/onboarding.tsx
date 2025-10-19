import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClientBrowser } from "@/lib/supabase";
import NebulaOverlay from "@/components/NebulaOverlay";
import CelestialCanvas from "@/components/CelestialCanvas";
import CarSelector, { CarChoice } from "@/components/CarSelector";
import { PaymentSimulator } from "@/components/PaymentSimulator";

// Profile types
type Lifestyle =
  | "budget"
  | "balanced"
  | "premium"
  | "eco"
  | "family"
  | "performance";

// Set BYPASS_LOGIN globally to true for this file (hardcoded for dev)
const BYPASS_LOGIN = true;

export default function Onboarding() {
  const supabase = createClientBrowser();
  const router = useRouter();

  // Gate: must be logged in (skip if bypass login is active)
  useEffect(() => {
    if (BYPASS_LOGIN) return; // Login bypass always enabled
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
    });
  }, [router, supabase]);

  const [step, setStep] = useState<"profile" | "car" | "sim">("profile");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // profile
  const [displayName, setDisplayName] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [creditScore, setCreditScore] = useState("700");
  const [lifestyle, setLifestyle] = useState<Lifestyle | "">("");

  // chosen car (from selector)
  const [car, setCar] = useState<CarChoice | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Required field validation
    if (
      !displayName.trim() ||
      !annualIncome.trim() ||
      !creditScore.trim() ||
      !lifestyle
    ) {
      setError("Please fill out all fields.");
      return;
    }

    setSaving(true);
    try {
      // With BYPASS_LOGIN, use fake user object
      let user;
      if (BYPASS_LOGIN) {
        user = { id: "dev-bypass-user-1" };
      } else {
        const {
          data: { user: realUser },
        } = await supabase.auth.getUser();
        if (!realUser) throw new Error("Not authenticated");
        user = realUser;
      }

      // Simulate save to DB with BYPASS_LOGIN, otherwise use Supabase
      let upsertResult;
      if (BYPASS_LOGIN) {
        upsertResult = { error: null };
      } else {
        upsertResult = await supabase.from("profiles").upsert(
          {
            id: user.id,
            display_name: displayName || null,
            annual_income: annualIncome ? Number(annualIncome) : null,
            credit_score: creditScore ? Number(creditScore) : null,
            lifestyle: lifestyle as any,
          },
          { onConflict: "id" }
        );
      }
      if (upsertResult.error) throw upsertResult.error;
      setStep("car");
    } catch (e: any) {
      setError(e?.message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleCarSelected(choice: CarChoice) {
    setCar(choice);
    setStep("sim");
  }

  async function finishAndGo() {
    if (!car) return;
    setSaving(true);
    setError(null);

    try {
      let user;
      if (BYPASS_LOGIN) {
        user = { id: "dev-bypass-user-1" };
      } else {
        const { data: { user: realUser }, error: uErr } = await supabase.auth.getUser();
        if (uErr) throw uErr;
        if (!realUser) throw new Error("Not authenticated");
        user = realUser;
      }

      // Mark onboarded + save preferred model
      let upsertProfileResult;
      if (BYPASS_LOGIN) {
        upsertProfileResult = { error: null };
      } else {
        upsertProfileResult = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              preferred_toyota_models: [car.model],
              onboarded: true,
            },
            { onConflict: "id" }
          );
      }
      if (upsertProfileResult.error) throw upsertProfileResult.error;

      // Optional starter goal (DB only if not bypass)
      if (!BYPASS_LOGIN) {
        try {
          await supabase
            .from("goals")
            .upsert(
              {
                user_id: user.id,
                name: car.model,
                car_id: car.model,
                target_amount: car.price ?? 0,
                is_active: true,
              },
              { onConflict: "user_id" }
            );
        } catch {
          /* ignore if goals not set up yet */
        }
      }

      router.replace("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to complete onboarding.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Head><title>Onboarding | Car Cosmos</title></Head>
      <NebulaOverlay />
      <CelestialCanvas />

      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40 bg-red-900/70 text-red-100 border border-red-400/40 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* STEP 1: Profile */}
      {step === "profile" && (
        <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <form
            onSubmit={saveProfile}
            className="w-full max-w-xl rounded-3xl bg-black/55 border border-blue-500/25 shadow-2xl px-8 py-10 backdrop-blur-xl"
          >
            <h1 className="text-3xl font-extrabold text-white mb-6 text-center">
              Personalize Your Journey
            </h1>
            <div className="space-y-4">
              <input
                required
                className="w-full rounded-xl px-4 py-3 bg-white/10 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <input
                required
                className="w-full rounded-xl px-4 py-3 bg-white/10 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Annual Income"
                inputMode="numeric"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
              />
              <div>
                <label className="block text-blue-200 text-sm mb-1">
                  Credit Score <span className="opacity-70">(300–850)</span>
                </label>
                <input
                  required
                  className="w-full rounded-xl px-4 py-3 bg-white/10 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="700"
                  inputMode="numeric"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                />
              </div>
              <select
                required
                className="w-full rounded-xl px-4 py-3 bg-white/10 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value as Lifestyle)}
              >
                <option value="">Select Goal</option>
                <option value="budget">Budget</option>
                <option value="balanced">Balanced</option>
                <option value="premium">Premium</option>
                <option value="eco">Eco</option>
                <option value="family">Family</option>
                <option value="performance">Performance</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold shadow-lg disabled:opacity-60"
              >
                {saving ? "Saving…" : "Next: Find Your Car"}
              </button>
            </div>
            {/* BYPASS Message */}
            {BYPASS_LOGIN && (
              <div className="mt-4 p-3 text-center rounded-xl bg-gray-700 text-white font-medium border border-gray-500">
                🚀 <b>Login bypass is <span className="text-green-300">ENABLED</span> for dev-demo.<br />
                All authentication is skipped.</b>
              </div>
            )}
          </form>
        </main>
      )}

      {/* STEP 2: Car selection */}
      {step === "car" && (
        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          <h2 className="text-white text-3xl font-extrabold mb-6 drop-shadow">
            Choose your Toyota target
          </h2>
          <div className="w-full max-w-5xl">
            <CarSelector onSelect={handleCarSelected} />
          </div>
        </main>
      )}

      {/* STEP 3: Simulator then finish */}
      {step === "sim" && car && (
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <PaymentSimulator
            car={{
              name: car.model,
              price: car.price ?? 0,
              monthly: 0,
              description: `${car.model} plan`,
            }}
            profile={{
              income: Number(annualIncome || "0"),
              creditScore: Number(creditScore || "700"),
              lifestyle,
            }}
            onFinish={finishAndGo}
          />
        </main>
      )}
    </>
  );
}
