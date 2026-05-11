import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, FolderOpen, Clock, ArrowRight, Zap } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useChangesStore } from "@/store/changes.store";
import { isTauri, openFolderDialog } from "@/lib/tauri-commands";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setWorkspace, recentWorkspaces, addRecentWorkspace } = useWorkspaceStore();
  const { loadChanges } = useChangesStore();

  // React pattern: useState for controlled form input
  const [manualPath, setManualPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpenFolder() {
    if (isTauri) {
      const path = await openFolderDialog();
      if (path) await openWorkspace(path);
    } else {
      await openWorkspace("C:/Projects/my-saas-app");
    }
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
    <div className="flex h-screen w-screen items-center justify-center bg-[#0b1326]">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#464554] bg-[#171f33]">
            <Layers size={28} className="text-[#6366f1]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#dae2fd]">Specboard</h1>
            <p className="mt-1 text-sm text-[#908fa0]">
              Visual interface for OpenSpec projects
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded border border-[#464554] bg-[#171f33] p-6 space-y-5">
          <div>
            <h2 className="text-sm font-medium text-[#dae2fd]">Open workspace</h2>
            <p className="mt-0.5 text-xs text-[#908fa0]">
              Select a folder that contains an <code className="text-[#6366f1]">openspec/</code> directory
            </p>
          </div>

          {/* Browse button */}
          <button
            onClick={handleOpenFolder}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded border border-[#464554] bg-[#6366f1] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4f46e5] disabled:opacity-50"
          >
            <FolderOpen size={16} strokeWidth={1.5} />
            {isTauri ? "Browse folder…" : "Open demo workspace"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#464554]" />
            <span className="text-xs text-[#908fa0]">or enter path</span>
            <div className="h-px flex-1 bg-[#464554]" />
          </div>

          {/* Manual path input */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualPath}
              onChange={(e) => setManualPath(e.target.value)}
              placeholder="/path/to/project"
              className="flex-1 rounded border border-[#464554] bg-[#0b1326] px-3 py-2 text-sm text-[#dae2fd] placeholder-[#908fa0] outline-none transition-colors focus:border-[#6366f1]"
              style={{ fontFamily: "var(--font-mono)" }}
            />
            <button
              type="submit"
              disabled={!manualPath.trim() || isLoading}
              className="flex items-center justify-center rounded border border-[#464554] bg-transparent px-3 py-2 text-[#c7c4d7] transition-colors hover:border-[#6366f1] hover:text-[#dae2fd] disabled:opacity-40"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </form>

          {error && (
            <p className="rounded border border-[#ef4444]/30 bg-[#ef4444]/10 px-3 py-2 text-xs text-[#ef4444]">
              {error}
            </p>
          )}
        </div>

        {/* Recent workspaces */}
        {recentWorkspaces.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-1">
              <Clock size={12} className="text-[#908fa0]" strokeWidth={1.5} />
              <span
                className="text-[10px] font-semibold uppercase tracking-widest text-[#908fa0]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Recent
              </span>
            </div>
            {recentWorkspaces.map((path) => (
              <button
                key={path}
                onClick={() => openWorkspace(path)}
                disabled={isLoading}
                className={cn(
                  "flex w-full items-center gap-3 rounded border border-[#464554] bg-[#171f33] px-3 py-2.5 text-left transition-colors hover:border-[#6366f1] hover:bg-[#222a3d]",
                  "disabled:opacity-50"
                )}
              >
                <FolderOpen size={14} className="shrink-0 text-[#908fa0]" strokeWidth={1.5} />
                <span
                  className="truncate text-xs text-[#c7c4d7]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {path}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Mock mode badge */}
        {!isTauri && (
          <div className="flex items-center justify-center gap-1.5 rounded border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-2">
            <Zap size={12} className="text-[#f59e0b]" strokeWidth={1.5} />
            <span className="text-xs text-[#f59e0b]">
              Running in mock mode — Tauri not detected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
