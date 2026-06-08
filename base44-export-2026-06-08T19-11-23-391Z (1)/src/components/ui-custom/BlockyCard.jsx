import React from "react";
import { motion } from "framer-motion";

export default function BlockyCard({ children, className = "", glow = "", onClick, animate = true }) {
  const Component = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      {...animateProps}
      onClick={onClick}
      className={`border-2 border-border p-5 relative overflow-hidden premium-card ${glow} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </Component>
  );
}