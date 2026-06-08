import React, { useRef, useEffect } from "react";

export default function OrbLogo({ size = 36 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 2;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      t += 0.012;

      // Outer glow ring
      const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.3);
      outerGlow.addColorStop(0, "rgba(147,90,230,0.0)");
      outerGlow.addColorStop(0.7, "rgba(147,90,230,0.18)");
      outerGlow.addColorStop(1, "rgba(147,90,230,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Base sphere gradient
      const sphere = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.05, cx, cy, r);
      sphere.addColorStop(0, "hsl(270,70%,82%)");
      sphere.addColorStop(0.3, "hsl(270,80%,58%)");
      sphere.addColorStop(0.75, "hsl(270,80%,28%)");
      sphere.addColorStop(1, "hsl(270,90%,10%)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = sphere;
      ctx.fill();

      // Rotating shimmer band
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      const shimmerX = cx + Math.cos(t) * r * 1.1;
      const shimmerY = cy + Math.sin(t * 0.7) * r * 0.6;
      const shimmer = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, r * 0.7);
      shimmer.addColorStop(0, "rgba(255,220,255,0.28)");
      shimmer.addColorStop(0.5, "rgba(200,140,255,0.06)");
      shimmer.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, size, size);

      // Specular highlight
      const spec = ctx.createRadialGradient(
        cx - r * 0.3, cy - r * 0.3, 0,
        cx - r * 0.3, cy - r * 0.3, r * 0.4
      );
      spec.addColorStop(0, "rgba(255,255,255,0.55)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spec;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();

      // Pulsing outer ring
      const pulseAlpha = 0.3 + Math.sin(t * 1.5) * 0.15;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,140,255,${pulseAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}