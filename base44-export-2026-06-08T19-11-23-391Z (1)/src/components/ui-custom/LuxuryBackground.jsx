import React, { useEffect, useRef } from "react";

// Deep luxury background: drifting 3D block shards + glowing grid + aurora glow
// Runs fully independently — never resets
export default function LuxuryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Block shards ─────────────────────────────────────────────────────
    const shards = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      w: Math.random() * 14 + 3,
      h: Math.random() * 14 + 3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.18 + 0.03,
      hue: Math.random() > 0.65 ? 270 : Math.random() > 0.5 ? 250 : 290,
    }));

    // ── Aurora layers ────────────────────────────────────────────────────
    let auroraT = 0;

    const drawAurora = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Layer 1 — wide slow shift
      const g1 = ctx.createRadialGradient(
        w * (0.3 + Math.sin(auroraT * 0.18) * 0.2),
        h * 0.15,
        0,
        w * 0.5,
        h * 0.4,
        w * 0.7
      );
      g1.addColorStop(0, `rgba(100,40,220,${0.07 + Math.sin(auroraT * 0.3) * 0.025})`);
      g1.addColorStop(0.5, `rgba(147,90,230,${0.04 + Math.sin(auroraT * 0.5) * 0.015})`);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Layer 2 — right side bloom
      const g2 = ctx.createRadialGradient(
        w * (0.75 + Math.cos(auroraT * 0.22) * 0.15),
        h * (0.5 + Math.sin(auroraT * 0.13) * 0.2),
        0,
        w * 0.75,
        h * 0.5,
        w * 0.5
      );
      g2.addColorStop(0, `rgba(120,60,255,${0.055 + Math.cos(auroraT * 0.4) * 0.02})`);
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    // ── Grid ─────────────────────────────────────────────────────────────
    const drawGrid = () => {
      const w = canvas.width;
      const h = canvas.height;
      const gap = 72;
      const baseAlpha = 0.028;

      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += gap) {
        ctx.strokeStyle = `rgba(147,90,230,${baseAlpha})`;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gap) {
        ctx.strokeStyle = `rgba(147,90,230,${baseAlpha})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Glowing intersections
      const glowAlpha = 0.28 + Math.sin(auroraT * 0.8) * 0.12;
      for (let x = 0; x < w; x += gap) {
        for (let y = 0; y < h; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,120,255,${glowAlpha * 0.35})`;
          ctx.fill();
        }
      }
    };

    // ── Shards ───────────────────────────────────────────────────────────
    const drawShards = () => {
      const w = canvas.width;
      const h = canvas.height;
      shards.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.rotSpeed;
        if (s.x < -30) s.x = w + 30;
        if (s.x > w + 30) s.x = -30;
        if (s.y < -30) s.y = h + 30;
        if (s.y > h + 30) s.y = -30;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.fillStyle = `hsla(${s.hue},70%,65%,${s.alpha})`;
        ctx.strokeStyle = `hsla(${s.hue},80%,75%,${s.alpha * 1.6})`;
        ctx.lineWidth = 0.5;
        ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
        ctx.strokeRect(-s.w / 2, -s.h / 2, s.w, s.h);
        ctx.restore();
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      auroraT += 0.008;
      drawAurora();
      drawGrid();
      drawShards();
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}