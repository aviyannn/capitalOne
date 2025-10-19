import React, { useEffect, useRef } from "react";
const BlockOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 8 + Math.random() * 12;
        ctx.fillStyle = "rgba(170, 200, 255, 0.08)";
        ctx.fillRect(x, y, size, size);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-10 pointer-events-none"
      style={{ position: "fixed", top: 0, left: 0 }}
    />
  );
};
export default BlockOverlay;
