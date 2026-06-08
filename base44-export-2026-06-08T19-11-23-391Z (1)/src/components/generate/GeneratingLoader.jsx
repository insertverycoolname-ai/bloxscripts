import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CODE_FLICKERS = [
  "local Players = game:GetService(\"Players\")",
  "local DataStore = game:GetService(\"DataStoreService\")",
  "function onPlayerAdded(player) ...",
  "local RunService = game:GetService(\"RunService\")",
  "task.spawn(function() ... end)",
  "workspace:FindFirstChild(\"Arena\")",
  "Players:GetPlayerFromCharacter(hit.Parent)",
  "humanoid:TakeDamage(damage)",
  "RemoteEvent:FireClient(player, data)",
  "local success, err = pcall(function()",
  "leaderstats.Coins.Value += reward",
  "game:GetService(\"TweenService\")",
];

const STAGES = [
  { label: "Analyzing prompt", pct: 18 },
  { label: "Determining script type", pct: 32 },
  { label: "Architecting logic", pct: 50 },
  { label: "Writing Luau code", pct: 72 },
  { label: "Adding error handling", pct: 85 },
  { label: "Finalizing output", pct: 96 },
];

export default function GeneratingLoader() {
  const [stage, setStage] = useState(0);
  const [flicker, setFlicker] = useState(0);
  const [progress, setProgress] = useState(0);

  // Advance stages
  useEffect(() => {
    const t = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  // Smooth progress bar
  useEffect(() => {
    const target = STAGES[stage].pct;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= target) return p;
        return Math.min(p + 1, target);
      });
    }, 25);
    return () => clearInterval(t);
  }, [stage]);

  // Flicker code lines
  useEffect(() => {
    const t = setInterval(() => {
      setFlicker(Math.floor(Math.random() * CODE_FLICKERS.length));
    }, 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="border-2 border-primary/40 bg-card overflow-hidden glow-purple">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-border bg-muted/40">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Engine Active</span>
      </div>

      <div className="p-8 flex flex-col items-center gap-6">
        {/* Glowing ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            style={{ boxShadow: "0 0 30px rgba(147,90,230,0.25), inset 0 0 30px rgba(147,90,230,0.1)" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute rounded-full border-b-2 border-secondary/60"
            style={{ inset: "6px" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-lg font-black text-primary">{progress}%</span>
        </div>

        {/* Stage label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-bold text-foreground tracking-wide"
          >
            {STAGES[stage].label}...
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full max-w-sm h-2 bg-muted border border-border">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Flickering code lines */}
        <div className="w-full max-w-sm space-y-1.5">
          {[0, 1, 2].map((offset) => {
            const idx = (flicker + offset) % CODE_FLICKERS.length;
            return (
              <motion.div
                key={`${idx}-${offset}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: offset === 0 ? 0.9 : offset === 1 ? 0.45 : 0.2 }}
                className="font-mono text-[11px] text-primary truncate px-3 py-1 bg-primary/5 border border-primary/10"
              >
                {CODE_FLICKERS[idx]}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}