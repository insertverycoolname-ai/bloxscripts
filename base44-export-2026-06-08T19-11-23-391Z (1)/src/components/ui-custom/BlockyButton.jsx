import React from "react";
import { Button } from "@/components/ui/button";

const variantStyles = {
  primary:
    "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-[0_0_0_rgba(147,90,230,0)] hover:shadow-[0_0_20px_rgba(147,90,230,0.4)]",
  secondary:
    "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90",
  accent:
    "bg-accent text-accent-foreground border-accent hover:bg-accent/90",
  ghost:
    "bg-transparent text-foreground border-muted hover:bg-muted/60 hover:border-primary/30",
  outline:
    "bg-transparent text-foreground border-border hover:bg-primary/5 hover:border-primary/40 hover:text-primary/90",
};

export default function BlockyButton({ children, variant = "primary", className = "", ...props }) {
  return (
    <Button
      className={`font-bold uppercase tracking-wider border-2 text-xs premium-btn transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}