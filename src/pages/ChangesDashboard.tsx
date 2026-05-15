import { MOCK_ACTIVITY } from "@/lib/mock-data";
import {
  onWorkspaceChanged,
  stopWatching,
  watchWorkspace,
} from "@/lib/tauri-commands";
import { formatRelativeTime, getArtifactProgress } from "@/lib/utils";
import { useChangesStore } from "@/store/changes.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { Change } from "@/types";
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderOpen,
  GitBranch,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const statusColors: Record<string, string> = {
  active: "text-primary bg-primary/10 border-primary/30",
  blocked: "text-destructive bg-destructive/10 border-destructive/30",
  archived: "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/30",
};

const artifactStatusColors: Record<string, string> = {
  ready: "bg-success",
  pending: "bg-warning",
  blocked: "bg-destructive",
  missing: "bg-surface-highest",
};

function ChangeRow({
  change,
  onClick,
}: {
  change: Change;
  onClick: () => void;
}) {
  const { completed, total } = getArtifactProgress(change.artifacts);
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors hover:bg-surface-high"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="truncate text-sm font-medium text-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.name}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold ${statusColors[change.status]}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.status}
          </Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          {/* Artifact dots */}
          <div className="flex items-center gap-1">
            {change.artifacts.map((a) => (
              <div
                key={a.name}
                title={`${a.name}: ${a.status}`}
                className={`h-1.5 w-1.5 rounded-full ${artifactStatusColors[a.status]}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {completed}/{total} artifacts
          </span>
          {change.tasksTotal > 0 && (
            <span className="text-xs text-muted-foreground">
              {change.tasksCompleted}/{change.tasksTotal} tasks
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Progress bar */}
        <div className="w-20">
          <Progress value={pct} className="h-1" />
        </div>
        <span className="w-12 text-right text-xs text-muted-foreground">
          {formatRelativeTime(change.createdAt)}
        </span>
        <ArrowRight
          size={14}
          className="shrink-0 text-border transition-colors group-hover:text-primary"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

export default function ChangesDashboard() {
  const navigate = useNavigate();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const {
    changes,
    isLoading,
    filter,
    setFilter,
    getFilteredChanges,
    loadChanges,
  } = useChangesStore();

  const handleSync = useCallback(() => {
    if (workspace?.path) loadChanges(workspace.path);
  }, [workspace?.path, loadChanges]);

  // Load on mount and watch for filesystem changes
  useEffect(() => {
    if (!workspace?.path) return;
    loadChanges(workspace.path);

    let unlisten: (() => void) | null = null;
    watchWorkspace(workspace.path).catch(() => {});
    onWorkspaceChanged(handleSync)
      .then((fn) => {
        unlisten = fn;
      })
      .catch(() => {});

    return () => {
      unlisten?.();
      stopWatching().catch(() => {});
    };
  }, [workspace?.path, loadChanges, handleSync]);

  const filtered = useMemo(() => getFilteredChanges(), [changes, filter]);

  const stats = useMemo(
    () => ({
      active: changes.filter((c) => c.status === "active").length,
      blocked: changes.filter((c) => c.status === "blocked").length,
      archived: workspace?.archivedCount ?? 0,
      readyToArchive: changes.filter((c) =>
        c.artifacts.every((a) => a.status === "ready"),
      ).length,
    }),
    [changes, workspace],
  );

  const handleChangeWorkspace = () => {
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h1 className="text-base font-semibold text-foreground">Changes</h1>
          <p className="text-xs text-muted-foreground">
            {workspace?.path ?? "No workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSync}
            disabled={isLoading}
            variant="outline"
            size="sm"
            title="Sync workspace"
          >
            <RefreshCw
              size={13}
              strokeWidth={1.5}
              className={isLoading ? "animate-spin" : ""}
            />
          </Button>
          <Button
            onClick={handleChangeWorkspace}
            variant="outline"
            size="sm"
          >
            <FolderOpen size={14} strokeWidth={1.5} />
            Change workspace
          </Button>
          <Button size="sm">
            <Plus size={14} strokeWidth={1.5} />
            New change
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-px border-b border-[#464554] bg-[#464554]">
            {[
              {
                label: "Active",
                value: stats.active,
                icon: GitBranch,
                color: "text-primary",
              },
              {
                label: "Blocked",
                value: stats.blocked,
                icon: AlertCircle,
                color: "text-destructive",
              },
              {
                label: "Archived",
                value: stats.archived,
                icon: Archive,
                color: "text-muted-foreground",
              },
              {
                label: "Complete",
                value: stats.readyToArchive,
                icon: CheckCircle2,
                color: "text-success",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-[#171f33] px-4 py-3"
              >
                <Icon size={18} className={color} strokeWidth={1.5} />
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-1 border-b border-border px-4 py-2">
            {(["all", "active", "blocked"] as const).map((f) => (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                variant={filter === f ? "secondary" : "ghost"}
                size="sm"
                className="text-xs font-medium capitalize"
              >
                {f}
              </Button>
            ))}
          </div>

          {/* Changes list */}
          <ScrollArea className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <GitBranch
                  size={32}
                  className="text-border"
                  strokeWidth={1}
                />
                <p className="text-sm text-muted-foreground">No changes found</p>
              </div>
            ) : (
              filtered.map((change) => (
                <ChangeRow
                  key={change.id}
                  change={change}
                  onClick={() => navigate(`/changes/${change.id}`)}
                />
              ))
            )}
          </ScrollArea>
        </div>

        {/* Activity feed */}
        <div className="flex w-64 flex-col border-l border-border">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Activity size={14} className="text-muted-foreground" strokeWidth={1.5} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Activity
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-1">
              {MOCK_ACTIVITY.map((item) => (
                <div key={item.id} className="px-3 py-2.5 hover:bg-[#1c2438]">
                  <div className="flex items-start gap-2">
                    <Clock
                      size={11}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {item.artifactName}
                        </span>{" "}
                        {item.action}
                      </p>
                      <p
                        className="truncate text-[11px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.changeName}
                      </p>
                      <p className="text-[11px] text-border">
                        {formatRelativeTime(item.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
