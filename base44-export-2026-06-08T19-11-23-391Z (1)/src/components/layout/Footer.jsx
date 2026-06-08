import React from "react";
import { Box, Github, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t-4 border-primary/20 bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-primary">
                <Box className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-black font-heading">
                BLOX<span className="text-primary">SCRIPT</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium AI-powered Roblox script generation. Build games faster with intelligent Luau code.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-4">Product</h4>
            <div className="space-y-2">
              <Link to="/generate" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Script Generator</Link>
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/history" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Script History</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-secondary mb-4">Resources</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Documentation</span>
              <span className="block text-sm text-muted-foreground">Tutorials</span>
              <span className="block text-sm text-muted-foreground">Community</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-accent mb-4">Legal</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Terms of Service</span>
              <span className="block text-sm text-muted-foreground">Privacy Policy</span>
              <span className="block text-sm text-muted-foreground">Content Policy</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive" /> for Roblox developers
          </p>
          <div className="flex items-center gap-4">
            <Github className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}