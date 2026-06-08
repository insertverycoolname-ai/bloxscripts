const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, FileCode, Monitor, Package, Star, Shield, TrendingUp, Loader2, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import BlockyCard from "@/components/ui-custom/BlockyCard";
import BlockyButton from "@/components/ui-custom/BlockyButton";

const COLORS = ["hsl(100,80%,50%)", "hsl(197,90%,55%)", "hsl(30,95%,55%)"];

export default function Dashboard() {
  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ["scripts"],
    queryFn: () => db.entities.Script.list("-created_date", 200),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const stats = {
    total: scripts.length,
    server: scripts.filter((s) => s.script_type === "Script").length,
    local: scripts.filter((s) => s.script_type === "LocalScript").length,
    module: scripts.filter((s) => s.script_type === "ModuleScript").length,
    favorites: scripts.filter((s) => s.is_favorite).length,
    validated: scripts.filter((s) => s.status === "validated").length,
  };

  const typeData = [
    { name: "Server", value: stats.server },
    { name: "Local", value: stats.local },
    { name: "Module", value: stats.module },
  ].filter((d) => d.value > 0);

  // Group by date for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const activityData = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("en", { weekday: "short" }),
    scripts: scripts.filter((s) => s.created_date?.startsWith(date)).length,
  }));

  const recentScripts = scripts.slice(0, 5);

  const statCards = [
    { label: "Total Scripts", value: stats.total, icon: FileCode, color: "text-primary" },
    { label: "Favorites", value: stats.favorites, icon: Star, color: "text-accent" },
    { label: "Validated", value: stats.validated, icon: Shield, color: "text-secondary" },
    { label: "This Week", value: activityData.reduce((a, b) => a + b.scripts, 0), icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading mb-1">
            DASH<span className="text-primary">BOARD</span>
          </h1>
          <p className="text-muted-foreground text-sm">Your scripting overview at a glance.</p>
        </div>
        <Link to="/generate">
          <BlockyButton variant="primary">
            <Zap className="w-4 h-4 mr-1" />
            New Script
          </BlockyButton>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((st, i) => (
          <motion.div
            key={st.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <BlockyCard animate={false} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted flex items-center justify-center border-2 border-border">
                <st.icon className={`w-6 h-6 ${st.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black">{st.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {st.label}
                </p>
              </div>
            </BlockyCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <BlockyCard animate={false} className="lg:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            7-Day Activity
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(240,5%,55%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(240,12%,13%)",
                    border: "2px solid hsl(240,10%,22%)",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="scripts" fill="hsl(100,80%,50%)" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BlockyCard>

        {/* Script Types Pie */}
        <BlockyCard animate={false}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Script Types
          </h3>
          {typeData.length > 0 ? (
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {typeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(240,12%,13%)",
                      border: "2px solid hsl(240,10%,22%)",
                      borderRadius: 0,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">
              No scripts yet
            </div>
          )}
          <div className="flex justify-center gap-4 mt-2">
            {typeData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3" style={{ backgroundColor: COLORS[i] }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </BlockyCard>
      </div>

      {/* Recent Scripts */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            Recent Scripts
          </h3>
          <Link to="/history" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentScripts.length === 0 ? (
          <BlockyCard className="text-center py-8">
            <p className="text-sm text-muted-foreground">No scripts yet. Start generating!</p>
          </BlockyCard>
        ) : (
          <div className="space-y-2">
            {recentScripts.map((script) => {
              const icons = { Script: FileCode, LocalScript: Monitor, ModuleScript: Package };
              const Icon = icons[script.script_type] || FileCode;
              return (
                <BlockyCard key={script.id} animate={false} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted flex items-center justify-center border border-border">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{script.title}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{script.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">
                    v{script.version || 1}
                  </span>
                </BlockyCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}