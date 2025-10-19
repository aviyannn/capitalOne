// src/pages/login.tsx
import Head from "next/head";
import Starfield from "../components/Starfield";
import CelestialCanvas from "../components/CelestialCanvas";
import LoginCard from "../components/LoginCard";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | Car Cosmos</title>
      </Head>

      {/* Background stack */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#040718] to-[#0b1739]" />
      <Starfield density={1.1} baseSpeed={12} color="#dfefff" />
      <CelestialCanvas hideLabels />

      {/* Foreground */}
      <main className="relative z-20 min-h-screen min-w-full flex items-center justify-center px-4">
        <LoginCard />
      </main>
    </>
  );
}
