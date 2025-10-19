// src/components/CelestialCanvas.tsx
import React, { useEffect, useState } from "react";

type CelestialBody = {
  label: string;
  color: string;
  rings: number;
  x: number;
  y: number;
  drift: number;
  fade: number;
  size: number;
  floating: boolean;
};

type CelestialCanvasProps = {
  /** Hide the “Mars / Saturn …” labels under bodies (useful on auth pages) */
  hideLabels?: boolean;
};

const CELESTIALS = [
  { label: "Saturn",  color: "#f7e26b", rings: 3 },
  { label: "Neptune", color: "#5a93e6", rings: 0 },
  { label: "Mars",    color: "#be4d35", rings: 0 },
  { label: "Jupiter", color: "#ebcfa5", rings: 2 },
  { label: "Comet",   color: "#eaeaea", rings: 1 },
];

function randomPos(i = 0) {
  // Only safe to call after mount (uses window size)
  return {
    x: Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15,
    y: Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.1,
    drift: (Math.random() - 0.5) * (12 + 5 * i),
    fade: Math.random() * 0.5 + 0.5,
  };
}

function genBodies(): CelestialBody[] {
  return [0, 1, 2].map((i) => {
    const base = CELESTIALS[Math.floor(Math.random() * CELESTIALS.length)];
    const pos = randomPos(i);
    return {
      ...base,
      ...pos,
      size: 70 + Math.random() * 50,
      floating: Math.random() > 0.5,
    };
  });
}

const CelestialCanvas: React.FC<CelestialCanvasProps> = ({ hideLabels = false }) => {
  const [bodies, setBodies] = useState<CelestialBody[]>([]);

  useEffect(() => {
    // initial bodies after mount
    setBodies(genBodies());

    // refresh composition every 8s
    const interval = setInterval(() => setBodies(genBodies()), 8000);

    // lightweight position animation
    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame++;
      setBodies((prev) =>
        prev.map((body, i) => ({
          ...body,
          x: body.x + Math.sin(frame / (200 + i * 80)) * body.drift,
          y: body.y + Math.cos(frame / (170 + i * 60)) * body.drift * 0.7,
        }))
      );
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // keep positions sensible on resize
    const onResize = () => setBodies(genBodies());
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
      {bodies.map((body, idx) => (
        <div
          key={body.label + idx}
          style={{
            position: "absolute",
            left: body.x,
            top: body.y,
            width: body.size,
            height: body.size,
            zIndex: 10,
            filter: "blur(0.5px)",
            opacity: body.fade,
            transition: "box-shadow 0.5s, opacity 1.2s",
            animation: "pulseStar 4s infinite alternate",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: "100%",
              height: "100%",
              background: body.color,
              boxShadow: body.rings > 0 ? `0 0 80px 20px ${body.color}33` : "",
              opacity: 0.95,
              transition: "box-shadow 0.5s, opacity 1.2s",
            }}
          />
          {[...Array(body.rings || 0)].map((_, ridx) => (
            <div
              key={"ring" + ridx}
              style={{
                position: "absolute",
                left: 8 - ridx * 5,
                top: 8 - ridx * 5,
                width: `calc(100% + ${ridx * 20}px)`,
                height: `calc(100% + ${ridx * 20}px)`,
                border: "2.5px solid rgba(255,255,200,0.13)",
                borderRadius: "9999px",
                opacity: 0.3 - ridx * 0.07,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Label (toggleable) */}
          {!hideLabels && (
            <span
              style={{
                position: "absolute",
                bottom: -28,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.0rem",
                textShadow: "0 2px 12px #0007",
                opacity: 0.85,
                letterSpacing: "1px",
                whiteSpace: "nowrap",
              }}
            >
              {body.label}
            </span>
          )}
        </div>
      ))}

      <style>{`
        @keyframes pulseStar {
          0% { opacity: 0.8; filter: blur(0.5px); }
          100% { opacity: 1; filter: blur(1.2px); }
        }
      `}</style>
    </div>
  );
};

export default CelestialCanvas;
