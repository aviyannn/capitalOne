import React from "react";

type Props = {
  celestialBody: string;
  rings?: number;
  glow?: boolean;
};

const CelestialCanvas: React.FC<Props> = ({ celestialBody, rings = 0, glow = false }) => (
  <div className="my-8 flex flex-col items-center">
    <div className="relative w-40 h-40 flex items-center justify-center">
      <div className={`absolute rounded-full w-40 h-40 ${glow ? "shadow-[0_0_80px_40px_rgba(255,255,100,0.2)]" : ""}`}
           style={{ background: "#FFD700" }} />
      {[...Array(rings)].map((_, idx) => (
        <div
          key={idx}
          className="absolute rounded-full border-2 border-yellow-200"
          style={{
            width: `${180 + idx * 16}px`,
            height: `${180 + idx * 16}px`,
            left: `${-20 - idx * 8}px`,
            top: `${-20 - idx * 8}px`,
            opacity: 0.5 - idx * 0.03,
          }}
        />
      ))}
    </div>
    <div className="text-white font-bold text-2xl mt-2">{celestialBody}</div>
  </div>
);

export default CelestialCanvas;
