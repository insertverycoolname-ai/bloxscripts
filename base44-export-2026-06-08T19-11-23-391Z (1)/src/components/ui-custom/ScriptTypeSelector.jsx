import React from "react";
import { FileCode, Monitor, Package } from "lucide-react";

const types = [
  {
    value: "Script",
    label: "Server Script",
    description: "Runs on the server",
    icon: FileCode,
    color: "primary",
    borderClass: "border-primary/50 bg-primary/10 text-primary",
    inactiveClass: "border-border hover:border-primary/30",
  },
  {
    value: "LocalScript",
    label: "Local Script",
    description: "Runs on the client",
    icon: Monitor,
    color: "secondary",
    borderClass: "border-secondary/50 bg-secondary/10 text-secondary",
    inactiveClass: "border-border hover:border-secondary/30",
  },
  {
    value: "ModuleScript",
    label: "Module Script",
    description: "Reusable module",
    icon: Package,
    color: "accent",
    borderClass: "border-accent/50 bg-accent/10 text-accent",
    inactiveClass: "border-border hover:border-accent/30",
  },
];

export default function ScriptTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {types.map((type) => {
        const isActive = value === type.value;
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`p-3 border-2 transition-all text-left ${
              isActive ? type.borderClass : type.inactiveClass
            }`}
          >
            <Icon className={`w-5 h-5 mb-1.5 ${isActive ? "" : "text-muted-foreground"}`} />
            <p className={`text-xs font-bold ${isActive ? "" : "text-foreground"}`}>{type.label}</p>
            <p className="text-[10px] text-muted-foreground">{type.description}</p>
          </button>
        );
      })}
    </div>
  );
}