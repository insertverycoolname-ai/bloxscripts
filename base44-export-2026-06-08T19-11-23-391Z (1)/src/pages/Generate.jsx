const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, Sparkles, Shield, Loader2, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import BlockyButton from "@/components/ui-custom/BlockyButton";
import BlockyCard from "@/components/ui-custom/BlockyCard";
import CodeDisplay from "@/components/ui-custom/CodeDisplay";
import ValidationPanel from "@/components/generate/ValidationPanel";
import PromptSuggestions from "@/components/generate/PromptSuggestions";
import GeneratingLoader from "@/components/generate/GeneratingLoader";

export default function Generate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scriptType, setScriptType] = useState("Script"); // auto-detected, not shown to user
  const [generatedCode, setGeneratedCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Polish prompt mutation ──────────────────────────────────────────────
  const polishPromptMutation = useMutation({
    mutationFn: async () => {
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `You are an expert at writing clear, detailed Roblox scripting prompts for AI code generation.

Take the following rough description and rewrite it as a detailed, specific prompt that will produce better Luau code. Add:
- Specific Roblox Studio objects that should be used (e.g. RemoteEvents, DataStores, GUIs)
- Edge cases to handle
- Clear behavior descriptions
- Any relevant game mechanics

Original description: "${description}"

Return ONLY the improved prompt text — no explanation, no preamble.`,
      });
      return result;
    },
    onSuccess: (result) => {
      setDescription(result.trim());
    },
  });

  // ── Main generate mutation ──────────────────────────────────────────────
  const generateMutation = useMutation({
    mutationFn: async () => {
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `You are an expert Roblox Luau programmer. Analyze the description below and:
1. Determine the most appropriate script type: Script (server), LocalScript (client), or ModuleScript (reusable module)
2. Generate a complete, functional, bug-free Luau script of that type

IMPORTANT RULES:
- Write ONLY in Luau (Roblox's scripting language)
- Follow Roblox Studio conventions for the chosen script type
- Include proper error handling with pcall where appropriate
- Add clear comments explaining the code sections
- Use modern Roblox API practices (task.*, new APIs)
- Do NOT generate any exploit, hack, ban evasion, or malicious code
- If the request seems malicious, return a comment-only placeholder explaining why

Title: ${title || "Untitled Script"}
Description: ${description}

Return a JSON object with two fields: "script_type" (one of: Script, LocalScript, ModuleScript) and "code" (the raw Luau code only, no markdown backticks).`,
        response_json_schema: {
          type: "object",
          properties: {
            script_type: {
              type: "string",
              enum: ["Script", "LocalScript", "ModuleScript"],
            },
            code: { type: "string" },
          },
        },
        model: "claude_sonnet_4_6",
      });
      return result;
    },
    onSuccess: (result) => {
      const code = (result.code || "")
        .replace(/^```\w*\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
      setGeneratedCode(code);
      setScriptType(result.script_type || "Script");
      setValidationResult(null);
      setActiveTab("generate");
    },
  });

  // ── Save mutation ───────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      return await db.entities.Script.create({
        title: title || "Untitled Script",
        description,
        code: generatedCode,
        script_type: scriptType,
        status: validationResult?.is_valid ? "validated" : "generated",
        version: 1,
        versions: [
          {
            version: 1,
            code: generatedCode,
            description: "Initial generation",
            timestamp: new Date().toISOString(),
          },
        ],
        validation_result: validationResult || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
      toast({ title: "Script saved!", description: "Find it in your history." });
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black font-heading mb-2">
          SCRIPT <span className="text-primary">GENERATOR</span>
        </h1>
        <p className="text-muted-foreground">
          Describe your script in plain English. AI handles the rest — including choosing the right script type.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Input Panel ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <BlockyCard animate={false}>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Script Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coin Collection System"
              className="border-2 border-border bg-muted/30 font-medium"
            />
          </BlockyCard>

          {/* Description + Polish Prompt */}
          <BlockyCard animate={false}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Describe Your Script
              </label>
              <button
                onClick={() => polishPromptMutation.mutate()}
                disabled={!description.trim() || polishPromptMutation.isPending}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {polishPromptMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Polish My Prompt
              </button>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want the script to do. Be as specific as possible — mention game objects, player actions, events, etc."
              className="border-2 border-border bg-muted/30 min-h-[160px] font-medium text-sm"
            />
            {polishPromptMutation.isSuccess && (
              <p className="text-[11px] text-primary mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Prompt refined — now hit Generate!
              </p>
            )}
          </BlockyCard>

          <PromptSuggestions onSelect={(s) => setDescription(s)} />

          <BlockyButton
            variant="primary"
            className="w-full py-6"
            onClick={() => generateMutation.mutate()}
            disabled={!description.trim() || generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Script
              </>
            )}
          </BlockyButton>

          {generateMutation.isError && (
            <div className="flex items-center gap-2 p-3 border-2 border-destructive/30 bg-destructive/10 text-sm">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span>Generation failed. Please try again.</span>
            </div>
          )}
        </div>

        {/* ── Output Panel ─────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab buttons */}
          {generatedCode && (
            <div className="flex gap-1">
              {[
                { id: "generate", label: "Code", icon: Zap },
                { id: "validate", label: "Validate", icon: Shield },
              ].map((tab) => (
                <BlockyButton
                  key={tab.id}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4 mr-1" />
                  {tab.label}
                </BlockyButton>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!generatedCode && !generateMutation.isPending && (
            <BlockyCard className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted flex items-center justify-center border-2 border-border mb-4">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1">No Script Yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Describe what you want and hit Generate. The AI will pick the right script type automatically.
              </p>
            </BlockyCard>
          )}

          {/* Cinematic loading state */}
          {generateMutation.isPending && <GeneratingLoader />}

          {/* Code output */}
          {generatedCode && activeTab === "generate" && (
            <div className="space-y-4">
              <CodeDisplay
                code={generatedCode}
                title={title || "Generated Script"}
                scriptType={scriptType}
              />
              <div className="flex gap-2">
                <BlockyButton
                  variant="primary"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  Save Script
                </BlockyButton>
                <BlockyButton
                  variant="secondary"
                  onClick={() => setActiveTab("validate")}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Validate
                </BlockyButton>
              </div>
            </div>
          )}

          {/* Validate tab */}
          {generatedCode && activeTab === "validate" && (
            <ValidationPanel
              code={generatedCode}
              scriptType={scriptType}
              validationResult={validationResult}
              setValidationResult={setValidationResult}
            />
          )}
        </div>
      </div>
    </div>
  );
}