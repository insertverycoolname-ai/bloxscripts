import React, { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import BlockyButton from "./BlockyButton";

export default function CodeDisplay({ code, title = "Generated Script", scriptType = "Script" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.lua`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scriptTypeColors = {
    Script: "bg-primary/20 text-primary border-primary/30",
    LocalScript: "bg-secondary/20 text-secondary border-secondary/30",
    ModuleScript: "bg-accent/20 text-accent border-accent/30",
  };

  return (
    <div className="border-2 border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b-2 border-border">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-muted-foreground">{title}</span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${scriptTypeColors[scriptType]}`}
          >
            {scriptType}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <BlockyButton variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
            {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
            <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
          </BlockyButton>
          <BlockyButton variant="ghost" size="sm" onClick={handleDownload} className="h-7 px-2">
            <Download className="w-3 h-3" />
            <span className="ml-1">.lua</span>
          </BlockyButton>
        </div>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
        <pre className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}