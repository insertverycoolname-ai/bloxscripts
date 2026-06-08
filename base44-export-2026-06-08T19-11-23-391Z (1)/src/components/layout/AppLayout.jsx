import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LuxuryBackground from "@/components/ui-custom/LuxuryBackground";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(240,15%,7%)" }}>
      <LuxuryBackground />
      <Navbar />
      <main className="flex-1 pt-16 relative z-10">
        <Outlet />
      </main>
      <Footer className="relative z-10" />
    </div>
  );
}