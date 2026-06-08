const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { Sparkles, Loader2, CheckCheck } from "lucide-react";
import BlockyButton from "@/components/ui-custom/BlockyButton";
import BlockyCard from "@/components/ui-custom/BlockyCard";
import CodeDisplay from "@/components/ui-custom/CodeDisplay";

const polishOptions = [
  { id: "performance", label: "Optimize Performance", description: "Reduce lag and improve efficiency" },
  { id: "readability", label: "Improve Readability", description: "Better naming, comments, and structure" },
  { id: "security", label: "Harden Security", description: "Add validation and exploit prevention" },
  { id: "bestpractices", label: "Best Practices", description: "Align with Roblox coding standards" },
];

export default function PolishPanel({ code, scriptType, onCodeUpdate }) {
  const [selectedOptions, setSelectedOptions] = useState(["performance", "readability"]);
  const [polishedCode, setPolishedCode] = useState("");
  const [changes, setChanges] = useState([]);

  const toggleOption = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const polishMutation = useMutation({
    mutationFn: async () => {
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `You are a Roblox Luau code polishing expert. Refine this ${scriptType} with focus on: ${selectedOptions.join(", ")}.

Original code:
${code}

Rules:
- Maintain exact same functionality
- Keep all comments but improve them
- Do not add unnecessary complexity
- Follow modern Roblox API practices

Return the improved code and a list of changes made.`,
        response_json_schema: {
          type: "object",
          properties: {
            polished_code: { type: "string", description: "The improved Luau code" },
            changes: {
              type: "array",
              items: { type: "string" },
              description: "List of changes made",
            },
          },
        },
        model: "claude_sonnet_4_6",
      });
      return result;
    },
    onSuccess: (result) => {
      setPolishedCode(result.polished_code);
      setChanges(result.changes || []);
    },
  });

  const applyPolish = () => {
    onCodeUpdate(polishedCode);
    setPolishedCode("");
    setChanges([]);
  };

  return (
    <div className="space-y-4">
      <BlockyCard animate={false}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-bold">Script Polish</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {polishOptions.map((opt) => {
            const isSelected = selectedOptions.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`p-3 border-2 text-left transition-all ${
                  isSelected
                    ? "border-accent/50 bg-accent/10"
                    : "border-border hover:border-accent/30"
                }`}
              >
                <p className="text-xs font-bold">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.description}</p>
              </button>
            );
          })}
        </div>

        <BlockyButton
          variant="accent"
          className="w-full"
          onClick={() => polishMutation.mutate()}
          disabled={polishMutation.isPending || selectedOptions.length === 0}
        >
          {polishMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Polishing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1" />
              Polish Script
            </>
          )}
        </BlockyButton>
      </BlockyCard>

      {polishedCode && (
        <>
          {changes.length > 0 && (
            <BlockyCard animate={false}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Changes Made
              </h4>
              <div className="space-y-1">
                {changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCheck className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </BlockyCard>
          )}

          <CodeDisplay code={polishedCode} title="Polished Script" scriptType={scriptType} />

          <BlockyButton variant="primary" onClick={applyPolish} className="w-full">
            Apply Polished Version
          </BlockyButton>
        </>
      )}
    </div>
  );
}