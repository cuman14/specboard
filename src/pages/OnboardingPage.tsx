import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, FolderOpen, Clock, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useChangesStore } from "@/store/changes.store";
import { isTauri, openFolderDialog } from "@/lib/tauri-commands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setWorkspace, recentWorkspaces, addRecentWorkspace } = useWorkspaceStore();
  const { loadChanges } = useChangesStore();

  const [manualPath, setManualPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpenFolder() {
    const path = await openFolderDialog();
    if (path) await openWorkspace(path);
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualPath.trim()) await openWorkspace(manualPath.trim());
  }

  async function openWorkspace(path: string) {
    setIsLoading(true);
    setError(null);
    try {
      await setWorkspace(path);
      await loadChanges(path);
      addRecentWorkspace(path);
      navigate("/changes");
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card">
            <Layers size={28} className="text-primary" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">Specboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Visual interface for OpenSpec projects
            </p>
          </div>
        </div>

        {/* Main card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Open workspace</CardTitle>
            <CardDescription>
              Select a folder that contains an <code className="text-primary">openspec/</code> directory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Browse button - Tauri only */}
            {isTauri && (
              <>
                <Button
                  onClick={handleOpenFolder}
                  disabled={isLoading}
                  className="w-full"
                >
                  <FolderOpen size={16} strokeWidth={1.5} />
                  Browse folder…
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">or enter path</span>
                  <Separator className="flex-1" />
                </div>
              </>
            )}

            {/* Manual path input */}
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                type="text"
                value={manualPath}
                onChange={(e) => setManualPath(e.target.value)}
                placeholder="/path/to/project"
                className="flex-1"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                disabled={!manualPath.trim() || isLoading}
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </Button>
            </form>

            {error && (
              <p className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent workspaces */}
        {recentWorkspaces.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-1">
              <Clock size={12} className="text-muted-foreground" strokeWidth={1.5} />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Recent
              </span>
            </div>
            {recentWorkspaces.map((path) => (
              <Button
                key={path}
                variant="outline"
                onClick={() => openWorkspace(path)}
                disabled={isLoading}
                className="w-full justify-start gap-3 px-3 py-2.5 h-auto"
              >
                <FolderOpen size={14} className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <span
                  className="truncate text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {path}
                </span>
              </Button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
