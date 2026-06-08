import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, History, CreditCard, LayoutDashboard, Menu, X } from "lucide-react";
import OrbLogo from "@/components/ui-custom/OrbLogo";

const navLinks = [
  { path: "/generate", label: "Generate", icon: Zap },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/history", label: "History", icon: History },
  { path: "/pricing", label: "Pricing", icon: CreditCard },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(14,12,22,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(147,90,230,0.18)",
        boxShadow: "0 1px 0 rgba(147,90,230,0.08), 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <OrbLogo size={36} />
            <span className="text-xl font-black font-heading tracking-tight">
              BLOX
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(270,80%,70%), hsl(270,90%,85%), hsl(270,60%,60%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SCRIPT
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <button
                    className={`nav-link-premium flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none ${
                      isActive ? "active" : "text-muted-foreground"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </button>
                </Link>
              );
            })}

            {/* CTA */}
            <Link to="/generate" className="ml-2">
              <button
                className="premium-btn flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-primary/60 text-primary"
                style={{
                  background: "rgba(147,90,230,0.12)",
                  boxShadow: "0 0 12px rgba(147,90,230,0.2), inset 0 0 12px rgba(147,90,230,0.05)",
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                Generate Now
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden nav-link-premium p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 space-y-1"
          style={{ borderTop: "1px solid rgba(147,90,230,0.15)", background: "rgba(14,12,22,0.95)" }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                <div
                  className={`nav-link-premium flex items-center gap-3 px-4 py-3 font-bold text-sm uppercase tracking-wider ${
                    isActive ? "active text-primary" : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}