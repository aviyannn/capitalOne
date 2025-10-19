import React from "react";

// Replace these with paths to your star/nebula SVGs in public/
const nebulaSvgs = ["/globe.svg", "/window.svg"];

const NebulaOverlay: React.FC = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    {nebulaSvgs.map((svg, idx) => (
      <img
        key={svg + idx}
        src={svg}
        alt={`Nebula ${idx}`}
        className={`absolute w-24 h-24 opacity-40 animate-spin`}
        style={{
          left: `${10 + idx * 60}px`,
          top: `${40 + idx * 120}px`,
          animationDuration: `${16 + idx * 4}s`,
        }}
      />
    ))}
    {/* Optionally sprinkle translucent white circles for stars */}
    {[...Array(25)].map((_, idx) => (
      <div
        key={idx}
        className="absolute rounded-full bg-white bg-opacity-20 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 80}%`,
          width: `${8 + Math.random() * 12}px`,
          height: `${8 + Math.random() * 12}px`,
          animationDuration: `${6 + Math.random() * 6}s`,
        }}
      />
    ))}
  </div>
);

export default NebulaOverlay;
