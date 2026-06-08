const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";

import { useMutation } from "@tanstack/react-query";
import { Shield, CheckCircle, AlertTriangle, XCircle, Loader2, ArrowRight } from "lucide-react";
import BlockyButton from "@/components/ui-custom/BlockyButton";
import BlockyCard from "@/components/ui-custom/BlockyCard";

export default function ValidationPanel({ code, scriptType, validationResult, setValidationResult }) {
  const validateMutation = useMutation({
    mutationFn: async () => {
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `You are a Roblox Luau code reviewer. Analyze this ${scriptType} for:
1. Syntax errors
2. Logic bugs
3. Security vulnerabilities (memory leaks, exploitable code, unvalidated RemoteEvents)
4. Performance issues
5. Deprecated API usage
6. Missing error handling
7. Roblox Studio convention violations

Code:
${code}

Be thorough but concise. Only report real issues, not style preferences.`,
        response_json_schema: {
          type: "object",
          properties: {
            is_valid: { type: "boolean", description: "Whether the script passes validation" },
            score: { type: "number", description: "Quality score 0-100" },
            issues: {
              type: "array",
              items: { type: "string" },
              description: "List of actual issues found",
            },
            suggestions: {
              type: "array",
              items: { type: "string" },
              description: "Improvement suggestions",
            },
            security_check: {
              type: "string",
              enum: ["pass", "warning", "fail"],
              description: "Security assessment",
            },
          },
        },
      });
      return result;
    },
    onSuccess: (result) => {
      setValidationResult(result);
    },
  });

  return (
    <div className="space-y-4">
      <BlockyCard animate={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            <h3 className="font-bold">Script Validation</h3>
          </div>
          <BlockyButton
            variant="secondary"
            size="sm"
            onClick={() => validateMutation.mutate()}
            disabled={validateMutation.isPending}
          >
            {validateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-1" />
            )}
            {validationResult ? "Re-Validate" : "Run Validation"}
          </BlockyButton>
        </div>

        {!validationResult && !validateMutation.isPending && (
          <div className="text-center py-8">
            <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Click "Run Validation" to check your script for bugs, security issues, and best practices.
            </p>
          </div>
        )}

        {validateMutation.isPending && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing your script...</p>
          </div>
        )}

        {validationResult && (
          <div className="space-y-4">
            {/* Score */}
            <div className="flex items-center gap-4 p-4 border-2 border-border bg-muted/20">
              <div className="relative">
                <div
                  className={`w-16 h-16 flex items-center justify-center border-4 font-black text-xl ${
                    validationResult.score >= 80
                      ? "border-primary text-primary"
                      : validationResult.score >= 50
                      ? "border-accent text-accent"
                      : "border-destructive text-destructive"
                  }`}
                >
                  {validationResult.score}
                </div>
              </div>
              <div>
                <p className="font-bold">
                  {validationResult.is_valid ? "Script Passed" : "Issues Found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Security: {validationResult.security_check === "pass" && (
                    <span className="text-primary font-semibold">Passed</span>
                  )}
                  {validationResult.security_check === "warning" && (
                    <span className="text-accent font-semibold">Warning</span>
                  )}
                  {validationResult.security_check === "fail" && (
                    <span className="text-destructive font-semibold">Failed</span>
                  )}
                </p>
              </div>
            </div>

            {/* Issues */}
            {validationResult.issues?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-destructive mb-2 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Issues ({validationResult.issues.length})
                </h4>
                <div className="space-y-1.5">
                  {validationResult.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-destructive/5 border border-destructive/20 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {validationResult.suggestions?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5" /> Suggestions ({validationResult.suggestions.length})
                </h4>
                <div className="space-y-1.5">
                  {validationResult.suggestions.map((sug, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-secondary/5 border border-secondary/20 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {validationResult.issues?.length === 0 && validationResult.suggestions?.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-bold text-primary">Perfect Score!</p>
                <p className="text-sm text-muted-foreground">No issues or suggestions found.</p>
              </div>
            )}
          </div>
        )}
      </BlockyCard>
    </div>
  );
}