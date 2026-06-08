import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Box, Shield, Sparkles, History } from "lucide-react";
import BlockyButton from "@/components/ui-custom/BlockyButton";
import OrbLogo from "@/components/ui-custom/OrbLogo";

// ── Multiple script examples ─────────────────────────────────────────────────
const SCRIPTS = [
  {
    filename: "CoinCollector.lua",
    lines: [
      { t: "comment", s: "-- AI Generated: Coin collection with leaderstat rewards" },
      { t: "kw",      s: "local Players = game:GetService(\"Players\")" },
      { t: "kw",      s: "local COIN_VALUE = 10" },
      { t: "blank",   s: "" },
      { t: "fn",      s: "local function onCoinTouched(coin, hit)" },
      { t: "ind",     s: "  local player = Players:GetPlayerFromCharacter(hit.Parent)" },
      { t: "ind",     s: "  if player then" },
      { t: "ind2",    s: "    player.leaderstats.Coins.Value += COIN_VALUE" },
      { t: "ind2",    s: "    coin.Parent = nil" },
      { t: "ind2",    s: "    task.delay(30, function() coin.Parent = workspace.Coins end)" },
      { t: "ind",     s: "  end" },
      { t: "fn",      s: "end" },
    ],
  },
  {
    filename: "CombatSystem.lua",
    lines: [
      { t: "comment", s: "-- AI Generated: Sword combat with damage & knockback" },
      { t: "kw",      s: "local Debris = game:GetService(\"Debris\")" },
      { t: "kw",      s: "local DAMAGE = 25;  local KNOCKBACK = 60" },
      { t: "blank",   s: "" },
      { t: "fn",      s: "local function onSwordHit(hit)" },
      { t: "ind",     s: "  local hum = hit.Parent:FindFirstChild(\"Humanoid\")" },
      { t: "ind",     s: "  if hum and hum.Health > 0 then" },
      { t: "ind2",    s: "    hum:TakeDamage(DAMAGE)" },
      { t: "ind2",    s: "    local bp = Instance.new(\"BodyVelocity\")" },
      { t: "ind2",    s: "    bp.Velocity = hit.Parent.HumanoidRootPart.CFrame.LookVector * -KNOCKBACK" },
      { t: "ind2",    s: "    Debris:AddItem(bp, 0.15)" },
      { t: "ind",     s: "  end" },
      { t: "fn",      s: "end" },
    ],
  },
  {
    filename: "TeleportSystem.lua",
    lines: [
      { t: "comment", s: "-- AI Generated: Multi-pad teleporter with cooldown" },
      { t: "kw",      s: "local TeleportService = game:GetService(\"TeleportService\")" },
      { t: "kw",      s: "local cooldowns = {}" },
      { t: "blank",   s: "" },
      { t: "fn",      s: "local function teleportPlayer(player, destination)" },
      { t: "ind",     s: "  if cooldowns[player.UserId] then return end" },
      { t: "ind",     s: "  cooldowns[player.UserId] = true" },
      { t: "ind",     s: "  local char = player.Character" },
      { t: "ind2",    s: "  char:MoveTo(destination.Position + Vector3.new(0, 3, 0))" },
      { t: "ind2",    s: "  task.delay(3, function() cooldowns[player.UserId] = nil end)" },
      { t: "fn",      s: "end" },
    ],
  },
  {
    filename: "ShopGUI.lua",
    lines: [
      { t: "comment", s: "-- AI Generated: Shop GUI with coin purchase & confirmation" },
      { t: "kw",      s: "local player = game.Players.LocalPlayer" },
      { t: "kw",      s: "local gui = player.PlayerGui:WaitForChild(\"ShopGui\")" },
      { t: "blank",   s: "" },
      { t: "fn",      s: "local function purchaseItem(itemName, cost)" },
      { t: "ind",     s: "  local coins = player.leaderstats.Coins" },
      { t: "ind",     s: "  if coins.Value >= cost then" },
      { t: "ind2",    s: "    local remote = game.ReplicatedStorage.BuyItem" },
      { t: "ind2",    s: "    remote:FireServer(itemName, cost)" },
      { t: "ind2",    s: "    gui.ConfirmFrame.Visible = false" },
      { t: "ind",     s: "  else" },
      { t: "ind2",    s: "    gui.ErrorLabel.Text = \"Not enough coins!\"" },
      { t: "ind",     s: "  end" },
      { t: "fn",      s: "end" },
    ],
  },
  {
    filename: "LeaderboardSystem.lua",
    lines: [
      { t: "comment", s: "-- AI Generated: Persistent leaderboard with DataStore" },
      { t: "kw",      s: "local DataStore = game:GetService(\"DataStoreService\")" },
      { t: "kw",      s: "local db = DataStore:GetOrderedDataStore(\"TopPlayers\")" },
      { t: "blank",   s: "" },
      { t: "fn",      s: "local function getLeaderboard()" },
      { t: "ind",     s: "  local pages = db:GetSortedAsync(false, 10)" },
      { t: "ind",     s: "  local top = pages:GetCurrentPage()" },
      { t: "ind",     s: "  for rank, entry in ipairs(top) do" },
      { t: "ind2",    s: "    print(rank, entry.key, entry.value)" },
      { t: "ind",     s: "  end" },
      { t: "fn",      s: "end" },
    ],
  },
  {
    filename: "VehicleSpawner.lua",
    lines: [
      { t: "comment", s: "-- AI Generated: Vehicle spawner with seat assignment" },
      { t: "kw",      s: "local vehicles = game.ReplicatedStorage.Vehicles" },
      { t: "kw",      s: "local spawnPad = workspace.VehicleSpawn" },
      { t: "blank",   s: "" },
      { t: "fn",      s: "local function spawnVehicle(player, vehicleName)" },
      { t: "ind",     s: "  local model = vehicles:FindFirstChild(vehicleName)" },
      { t: "ind",     s: "  if not model then return end" },
      { t: "ind",     s: "  local clone = model:Clone()" },
      { t: "ind2",    s: "  clone:SetPrimaryPartCFrame(spawnPad.CFrame + Vector3.new(0, 4, 0))" },
      { t: "ind2",    s: "  clone.Parent = workspace" },
      { t: "ind2",    s: "  clone.DriverSeat:Sit(player.Character.Humanoid)" },
      { t: "fn",      s: "end" },
    ],
  },
];

const TOKEN_COLORS = {
  comment: { className: "text-muted-foreground/65", italic: true },
  fn:      { className: "text-secondary" },
  ind:     { className: "text-foreground/85" },
  ind2:    { className: "text-foreground/70" },
  blank:   { className: "" },
  kw:      { className: "text-foreground/90" },
};

// Colorize keywords inline
function colorize(text) {
  const keywords = ["local", "function", "end", "if", "then", "else", "for", "in", "do", "return", "not", "and", "or"];
  return text.split(/\b/).map((tok, j) => {
    if (keywords.includes(tok)) return <span key={j} className="text-secondary">{tok}</span>;
    if (/^".*"$/.test(tok) || /^'.*'$/.test(tok)) return <span key={j} className="text-accent/80">{tok}</span>;
    if (/^\d+$/.test(tok)) return <span key={j} className="text-primary/90">{tok}</span>;
    return <span key={j}>{tok}</span>;
  });
}

// ── Live typing component (fully independent from any external animation) ────
function LiveCodeTyping() {
  const [scriptIdx, setScriptIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | pause | clearing

  // Refs to hold mutable loop state without triggering re-renders
  const state = useRef({ scriptIdx: 0, lineIdx: 0, charIdx: 0, phase: "typing" });

  useEffect(() => {
    let timeout;

    const schedule = (fn, delay) => { timeout = setTimeout(fn, delay); };

    const tick = () => {
      const s = state.current;
      const script = SCRIPTS[s.scriptIdx];

      if (s.phase === "typing") {
        const line = script.lines[s.lineIdx];
        const isBlank = line.type === "blank" || line.s === "";

        if (isBlank || s.charIdx >= line.s.length) {
          // Commit line
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[s.lineIdx] = line.s;
            return next;
          });
          const nextLine = s.lineIdx + 1;
          if (nextLine >= script.lines.length) {
            // All lines done → pause then clear
            s.phase = "pause";
            schedule(tick, 2800);
          } else {
            s.lineIdx = nextLine;
            s.charIdx = 0;
            schedule(tick, isBlank ? 70 : 100);
          }
        } else {
          // Type one char
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[s.lineIdx] = line.s.slice(0, s.charIdx + 1);
            return next;
          });
          s.charIdx += 1;
          const speed = line.t === "comment" ? 16 : 10;
          schedule(tick, speed);
        }
      } else if (s.phase === "pause") {
        // Clear and advance to next script
        s.scriptIdx = (s.scriptIdx + 1) % SCRIPTS.length;
        s.lineIdx = 0;
        s.charIdx = 0;
        s.phase = "typing";
        setScriptIdx(s.scriptIdx);
        setDisplayedLines([]);
        setLineIdx(0);
        schedule(tick, 50);
      }
    };

    schedule(tick, 400);
    return () => clearTimeout(timeout);
  }, []); // Empty deps — runs once, fully self-contained

  const script = SCRIPTS[scriptIdx];

  return (
    <div
      className="border border-primary/30 overflow-hidden"
      style={{
        background: "rgba(16,13,28,0.9)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 0 60px rgba(147,90,230,0.12), 0 0 0 1px rgba(147,90,230,0.08)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(147,90,230,0.15)", background: "rgba(147,90,230,0.06)" }}
      >
        <div className="w-3 h-3 rounded-sm bg-destructive/60" />
        <div className="w-3 h-3 rounded-sm bg-accent/60" />
        <div className="w-3 h-3 rounded-sm bg-primary/60" />
        <span className="ml-3 text-xs font-mono text-muted-foreground tracking-wide">
          {script.filename}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Writing</span>
        </div>
      </div>

      {/* Code area */}
      <div className="p-5 min-h-[320px] font-mono text-sm leading-7 text-left overflow-hidden">
        {script.lines.map((line, i) => {
          const displayed = displayedLines[i] ?? "";
          const isTyping = i === state.current.lineIdx && state.current.phase === "typing";
          const isDone = i < state.current.lineIdx;
          if (!isDone && !isTyping) return null;

          const { className, italic } = TOKEN_COLORS[line.t] || { className: "text-foreground" };
          return (
            <div key={`${scriptIdx}-${i}`} className={`${className} ${italic ? "italic" : ""}`}>
              {colorize(displayed)}
              {isTyping && <span className="typing-cursor" />}
            </div>
          );
        })}
        {state.current.phase === "pause" && <span className="typing-cursor" />}
      </div>
    </div>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "50K+", label: "Scripts Generated" },
  { value: "12K+", label: "Developers" },
  { value: "99.2%", label: "Valid Code Rate" },
  { value: "<8s",   label: "Avg. Generation" },
];

const PILLS = [
  { icon: Shield,   text: "Validated & Safe",    color: "text-secondary border-secondary/30 bg-secondary/10" },
  { icon: Sparkles, text: "Auto-Polish",          color: "text-accent border-accent/30 bg-accent/10" },
  { icon: History,  text: "Version Control",      color: "text-primary border-primary/30 bg-primary/10" },
  { icon: Zap,      text: "Instant Generation",   color: "text-primary border-primary/30 bg-primary/10" },
];

// Staggered word animation
function AnimatedHeadline() {
  const line1 = ["WRITE", "ROBLOX"];
  const line2 = ["SCRIPTS"];
  const line3 = ["WITH", "AI."];

  const wordVariants = {
    hidden: { opacity: 0, y: 50, skewY: 5, filter: "blur(10px)" },
    visible: (i) => ({
      opacity: 1, y: 0, skewY: 0, filter: "blur(0px)",
      transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  let wordCount = 0;

  const renderWord = (word, isHighlight = false, isAccent = false) => {
    const i = wordCount++;
    return (
      <motion.span
        key={word + i}
        custom={i}
        variants={wordVariants}
        initial="hidden"
        animate="visible"
        className="inline-block mr-4"
        style={
          isHighlight
            ? {
                background: "linear-gradient(135deg, hsl(270,80%,78%), hsl(280,90%,88%), hsl(260,70%,65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 0 30px rgba(147,90,230,0.5))",
              }
            : isAccent
            ? { color: "hsl(197,90%,60%)" }
            : {}
        }
      >
        {word}
      </motion.span>
    );
  };

  return (
    <h1 className="text-5xl sm:text-6xl lg:text-[82px] font-black font-heading leading-none mb-6 tracking-tight">
      <div className="mb-1">
        {line1.map((w) => renderWord(w))}
      </div>
      <div className="mb-1">
        {renderWord("SCRIPTS", true)}
      </div>
      <div>
        {renderWord("WITH")}
        {renderWord("AI.", false, true)}
      </div>
    </h1>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[96vh] flex flex-col items-center justify-center px-4 py-28 overflow-hidden">

        {/* Central radial hero glow — static, independent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 38%, rgba(100,40,220,0.16) 0%, rgba(147,90,230,0.07) 40%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-10"
            style={{
              border: "1px solid rgba(147,90,230,0.4)",
              background: "rgba(147,90,230,0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              AI-Powered Script Engine
            </span>
          </motion.div>

          {/* Animated headline */}
          <AnimatedHeadline />

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed"
            style={{ color: "rgba(200,190,220,0.75)" }}
          >
            Describe it. Generate it. Ship it.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
          >
            {PILLS.map((p) => (
              <div
                key={p.text}
                className={`flex items-center gap-1.5 px-3 py-1 border text-xs font-bold premium-btn ${p.color}`}
              >
                <p.icon className="w-3.5 h-3.5" />
                {p.text}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/generate">
              <BlockyButton variant="primary" size="lg" className="text-sm px-8 py-6">
                <Zap className="w-5 h-5 mr-2" />
                Start Generating Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </BlockyButton>
            </Link>
            <Link to="/pricing">
              <BlockyButton variant="outline" size="lg" className="text-sm px-8 py-6">
                View Plans
              </BlockyButton>
            </Link>
          </motion.div>

          {/* Live code typing */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <LiveCodeTyping />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section
        className="border-y relative z-10"
        style={{
          borderColor: "rgba(147,90,230,0.15)",
          background: "rgba(16,13,28,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x"
          style={{ borderColor: "rgba(147,90,230,0.12)" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="py-8 px-6 text-center">
              <p
                className="text-3xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, hsl(270,80%,75%), hsl(270,60%,60%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-28 px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="p-14 relative overflow-hidden"
            style={{
              border: "1px solid rgba(147,90,230,0.3)",
              background: "rgba(16,13,28,0.8)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 100px rgba(147,90,230,0.1), 0 0 0 1px rgba(147,90,230,0.06)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(147,90,230,0.12) 0%, transparent 70%)",
              }}
            />
            <OrbLogo size={52} />
            <h2
              className="text-4xl font-black font-heading mt-5 mb-3 relative z-10"
              style={{
                background: "linear-gradient(135deg, #fff 30%, hsl(270,80%,78%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              READY TO BUILD?
            </h2>
            <p className="text-muted-foreground mb-8 relative z-10 max-w-md mx-auto">
              Join thousands of Roblox developers shipping game scripts in seconds instead of hours.
            </p>
            <Link to="/generate" className="relative z-10 inline-block">
              <BlockyButton variant="primary" size="lg" className="text-sm px-10 py-6">
                <Zap className="w-5 h-5 mr-2" />
                Start For Free
              </BlockyButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}