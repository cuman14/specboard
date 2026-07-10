import { SpecboardWordmark } from "@/components/SpecboardWordmark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MOCK_CHANGES, MOCK_WORKSPACE } from "@/lib/mock-data";
import { isTauri, openFolderDialog } from "@/lib/tauri-commands";
import { useChangesStore } from "@/store/changes.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { ArrowRight, Clock, FolderOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setWorkspace, recentWorkspaces, addRecentWorkspace } =
    useWorkspaceStore();
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

  async function openDemo() {
    setIsLoading(true);
    setError(null);
    try {
      await setWorkspace(MOCK_WORKSPACE.path);
      useWorkspaceStore.setState({ recentWorkspaces: [MOCK_WORKSPACE.path] });
      useChangesStore.setState({ changes: MOCK_CHANGES });
      navigate("/changes");
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="Specboard" className="size-32" />
          <SpecboardWordmark className="h-7 w-auto" />
          <span
            className="text-xs text-text-subtle"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            v{__APP_VERSION__}
          </span>
        </div>

        {/* Main card */}
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text">
              Open workspace
            </CardTitle>
            <CardDescription className="text-text-subtle">
              Select a folder that contains an{" "}
              <code className="text-primary">openspec/</code> directory
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
                  <span className="text-xs text-text-subtle">
                    or enter path
                  </span>
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

        {/* Demo mode */}
        <Button
          variant="ghost"
          onClick={openDemo}
          disabled={isLoading}
          className="w-full gap-2 text-text-subtle hover:text-text hover:bg-surface-high"
        >
          <Sparkles size={16} strokeWidth={1.5} />
          Try demo mode
        </Button>

        {/* Recent workspaces */}
        {recentWorkspaces.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-1">
              <Clock size={12} className="text-text-subtle" strokeWidth={1.5} />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest text-text-subtle"
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
                className="w-full justify-start gap-3 px-3 py-2.5 h-auto bg-surface border-border hover:border-primary hover:bg-surface-high"
              >
                <FolderOpen
                  size={14}
                  className="shrink-0 text-text-subtle"
                  strokeWidth={1.5}
                />
                <span
                  className="truncate text-xs text-text-muted"
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
