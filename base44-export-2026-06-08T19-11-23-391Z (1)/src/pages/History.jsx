const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { History as HistoryIcon, Search, Star, Trash2, FileCode, Monitor, Package, Loader2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import BlockyCard from "@/components/ui-custom/BlockyCard";
import BlockyButton from "@/components/ui-custom/BlockyButton";
import ScriptDetailModal from "@/components/history/ScriptDetailModal";

const typeIcons = {
  Script: FileCode,
  LocalScript: Monitor,
  ModuleScript: Package,
};

const statusColors = {
  draft: "bg-muted text-muted-foreground border-border",
  generated: "bg-primary/10 text-primary border-primary/20",
  polished: "bg-accent/10 text-accent border-accent/20",
  validated: "bg-secondary/10 text-secondary border-secondary/20",
};

export default function History() {
  const [search, setSearch] = useState("");
  const [selectedScript, setSelectedScript] = useState(null);
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ["scripts"],
    queryFn: () => db.entities.Script.list("-created_date", 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Script.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const toggleFavorite = useMutation({
    mutationFn: ({ id, is_favorite }) =>
      db.entities.Script.update(id, { is_favorite: !is_favorite }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  const filtered = scripts.filter((s) => {
    const matchesSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "favorites" && s.is_favorite) ||
      s.script_type === filter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: "all", label: "All" },
    { id: "favorites", label: "Favorites" },
    { id: "Script", label: "Server" },
    { id: "LocalScript", label: "Local" },
    { id: "ModuleScript", label: "Module" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading mb-1">
            SCRIPT <span className="text-secondary">HISTORY</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {scripts.length} script{scripts.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scripts..."
            className="pl-9 border-2 border-border bg-muted/30"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {filters.map((f) => (
          <BlockyButton
            key={f.id}
            variant={filter === f.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </BlockyButton>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <BlockyCard className="text-center py-16">
          <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-1">No Scripts Found</h3>
          <p className="text-sm text-muted-foreground">
            {scripts.length === 0
              ? "Generate your first script to see it here."
              : "No scripts match your search."}
          </p>
        </BlockyCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((script) => {
            const TypeIcon = typeIcons[script.script_type] || FileCode;
            return (
              <BlockyCard key={script.id} className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted flex items-center justify-center border border-border">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm line-clamp-1">{script.title}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(script.created_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite.mutate({ id: script.id, is_favorite: script.is_favorite })}
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        script.is_favorite ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[32px]">
                  {script.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`text-[10px] border ${statusColors[script.status]}`}>
                    {script.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    v{script.version || 1}
                  </Badge>
                </div>

                <div className="flex gap-1">
                  <BlockyButton
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedScript(script)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </BlockyButton>
                  <BlockyButton
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(script.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </BlockyButton>
                </div>
              </BlockyCard>
            );
          })}
        </div>
      )}

      {selectedScript && (
        <ScriptDetailModal
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
        />
      )}
    </div>
  );
}