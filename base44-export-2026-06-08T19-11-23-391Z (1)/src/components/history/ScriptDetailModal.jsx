import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileCode, Monitor, Package, Clock } from "lucide-react";
import CodeDisplay from "@/components/ui-custom/CodeDisplay";

const typeIcons = {
  Script: FileCode,
  LocalScript: Monitor,
  ModuleScript: Package,
};

export default function ScriptDetailModal({ script, onClose }) {
  const TypeIcon = typeIcons[script.script_type] || FileCode;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border-2 border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted flex items-center justify-center border-2 border-border">
              <TypeIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="font-black font-heading">{script.title}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Created {format(new Date(script.created_date), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{script.script_type}</Badge>
            <Badge variant="outline">v{script.version || 1}</Badge>
            <Badge variant="outline" className="capitalize">{script.status}</Badge>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{script.description}</p>
          </div>

          <CodeDisplay
            code={script.code || "// No code generated yet"}
            title={script.title}
            scriptType={script.script_type}
          />

          {/* Version history */}
          {script.versions?.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Version History
              </p>
              <div className="space-y-1">
                {script.versions.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border border-border bg-muted/20 text-xs">
                    <span className="font-bold">v{v.version}</span>
                    <span className="text-muted-foreground">{v.description}</span>
                    {v.timestamp && (
                      <span className="text-muted-foreground">
                        {format(new Date(v.timestamp), "MMM d, h:mm a")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation */}
          {script.validation_result && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Last Validation
              </p>
              <div className={`p-3 border-2 ${
                script.validation_result.is_valid
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}>
                <p className="font-bold text-sm">
                  {script.validation_result.is_valid ? "Passed ✓" : "Issues Found"}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}