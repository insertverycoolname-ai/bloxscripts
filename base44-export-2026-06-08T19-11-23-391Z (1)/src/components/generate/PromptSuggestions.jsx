import React from "react";
import { Lightbulb } from "lucide-react";

const suggestions = [
  "Create a coin collection system where coins float, spin, and respawn after 30 seconds. Award 10 coins on touch and update the player's leaderstat.",
  "Build a daily reward system that gives increasing rewards for consecutive login days using DataStore.",
  "Make a local script for a sprint ability that doubles walk speed when holding Shift, with a stamina bar GUI.",
  "Create a ModuleScript inventory system with functions to add, remove, and check for items.",
  "Build a round-based game system with a lobby, countdown timer, teleporting players to the arena, and announcing winners.",
  "Create a pet follow system where a model follows the player with smooth movement and a floating name tag.",
];

export default function PromptSuggestions({ onSelect }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Lightbulb className="w-3.5 h-3.5" />
        Quick Ideas
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="text-left text-xs p-2.5 border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-colors truncate"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}