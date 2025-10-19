import Head from "next/head";
import Starfield from "../components/Starfield";
import NebulaOverlay from "../components/NebulaOverlay";
import LoginCard from "../components/LoginCard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Reach for the Stars – Celestial Goals</title>
        <link href="https://fonts.googleapis.com/css?family=Orbitron:700,400&display=swap" rel="stylesheet" />
      </Head>
      <div className="relative min-h-screen w-full overflow-hidden">
        <Starfield />
        <NebulaOverlay />
        <LoginCard />
      </div>
    </>
  );
}
