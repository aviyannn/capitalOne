// src/pages/index.tsx
import Head from "next/head";
import { useRouter } from "next/router";
import Starfield from "@/components/Starfield";
import CelestialCanvas from "@/components/CelestialCanvas";
import StarButton from "@/components/StarButton";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Car Cosmos — Reach for the stars</title>
        <meta
          name="description"
          content="Set your car goal, track progress, and get there with cosmic guidance."
        />
      </Head>

      {/* Background stack */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#040718] to-[#0b1739]" />
      <Starfield density={1.1} baseSpeed={12} color="#dfefff" />
      <CelestialCanvas />

      {/* Foreground */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Chart your journey to a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              dream car
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-blue-100/90">
            Set a goal, track savings, and learn bite-size tips—one stellar step at a time.
          </p>

          <div className="mt-10">
            <StarButton onClick={() => router.push("/login")} />
          </div>
        </div>
      </main>
    </>
  );
}
