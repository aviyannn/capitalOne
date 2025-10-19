import React, { useEffect, useRef } from "react";

type StarfieldProps = {
  /** Stars per ~12k px². 0.8 ≈ light, 1 ≈ default, 1.4 ≈ dense */
  density?: number;
  /** Base drift speed in px/sec */
  baseSpeed?: number;
  /** Star color (any CSS color). Tip: try "#cfe9ff" */
  color?: string;
  /** Set layer order (keep below your CelestialCanvas which is z-10) */
  zIndex?: number;
  /** Turn twinkle on/off */
  twinkle?: boolean;
};

type Star = {
  x: number; y: number; r: number; a: number; // position, radius, alpha
  vx: number; vy: number;                      // drift
  tw: number; ph: number;                      // twinkle amp & phase
};

const Starfield: React.FC<StarfieldProps> = ({
  density = 1,
  baseSpeed = 14,
  color = "#cfe9ff",
  zIndex = 0,         // sits behind CelestialCanvas (which is z-10)
  twinkle = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  // device-pixel-ratio aware resize
  const resize = () => {
    const canvas = canvasRef.current!;
    const dpr = Math.max(1, Math.min(2, (window.devicePixelRatio || 1)));
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // (re)seed stars
    const areaUnits = (w * h) / 12000;               // tune density by area
    const count = Math.min(700, Math.max(80, Math.floor(areaUnits * density)));
    const stars: Star[] = new Array(count).fill(0).map(() => {
      const r = Math.random() * 1.2 + 0.3;           // 0.3–1.5 px
      const speed = baseSpeed * (0.6 + Math.random() * 0.8); // px/sec
      const ang = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: r * dpr,
        a: 0.6 + Math.random() * 0.35,               // base alpha
        vx: Math.cos(ang) * speed * dpr / 60,        // per frame (~60fps)
        vy: Math.sin(ang) * speed * dpr / 60,
        tw: (Math.random() * 0.35 + 0.15) * (twinkle ? 1 : 0),
        ph: Math.random() * Math.PI * 2,
      };
    });
    starsRef.current = stars;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvasRef.current.getContext("2d")!;
    let t = 0;

    const draw = () => {
      t += 1;
      const { width: W, height: H } = canvasRef.current!;
      ctx.clearRect(0, 0, W, H);

      // soft vignette (subtle depth)
      const g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.6, Math.max(W, H));
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // draw & advance
      for (const s of starsRef.current) {
        // twinkle
        const tw = s.tw ? (Math.sin((t / 35) + s.ph) * s.tw) : 0;
        const alpha = Math.max(0, Math.min(1, s.a + tw));

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // a tiny outer glow
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // drift
        s.x += s.vx;
        s.y += s.vy;

        // wrap
        if (s.x < -4) s.x = W + 4;
        else if (s.x > W + 4) s.x = -4;
        if (s.y < -4) s.y = H + 4;
        else if (s.y > H + 4) s.y = -4;
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, baseSpeed, color, twinkle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
};

export default Starfield;
