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

const statusColors: Record<string, string> = {
  active: "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/30",
  blocked: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30",
  archived: "text-[#908fa0] bg-[#908fa0]/10 border-[#908fa0]/30",
};

const artifactStatusColors: Record<string, string> = {
  ready: "bg-[#22c55e]",
  pending: "bg-[#f59e0b]",
  blocked: "bg-[#ef4444]",
  missing: "bg-[#2d3449]",
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
      className="group flex cursor-pointer items-center gap-4 border-b border-[#464554]/50 px-4 py-3 transition-colors hover:bg-[#222a3d]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="truncate text-sm font-medium text-[#dae2fd]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.name}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColors[change.status]}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.status}
          </span>
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
          <span className="text-xs text-[#908fa0]">
            {completed}/{total} artifacts
          </span>
          {change.tasksTotal > 0 && (
            <span className="text-xs text-[#908fa0]">
              {change.tasksCompleted}/{change.tasksTotal} tasks
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Progress bar */}
        <div className="w-20">
          <div className="h-1 overflow-hidden rounded-full bg-[#2d3449]">
            <div
              className="h-full rounded-full bg-[#6366f1] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="w-12 text-right text-xs text-[#908fa0]">
          {formatRelativeTime(change.createdAt)}
        </span>
        <ArrowRight
          size={14}
          className="shrink-0 text-[#464554] transition-colors group-hover:text-[#6366f1]"
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

  // React pattern: useMemo for derived / filtered data
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
      <div className="flex items-center justify-between border-b border-[#464554] px-5 py-3">
        <div>
          <h1 className="text-base font-semibold text-[#dae2fd]">Changes</h1>
          <p className="text-xs text-[#908fa0]">
            {workspace?.path ?? "No workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={isLoading}
            title="Sync workspace"
            className="flex items-center gap-1.5 rounded border border-[#464554] bg-transparent px-2.5 py-1.5 text-xs font-medium text-[#c7c4d7] transition-colors hover:border-[#6366f1] hover:text-[#dae2fd] disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              strokeWidth={1.5}
              className={isLoading ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={handleChangeWorkspace}
            className="flex items-center gap-1.5 rounded border border-[#464554] bg-transparent px-3 py-1.5 text-xs font-medium text-[#c7c4d7] transition-colors hover:border-[#6366f1] hover:text-[#dae2fd]"
          >
            <FolderOpen size={14} strokeWidth={1.5} />
            Change workspace
          </button>
          <button className="flex items-center gap-1.5 rounded border border-[#464554] bg-[#6366f1] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#4f46e5]">
            <Plus size={14} strokeWidth={1.5} />
            New change
          </button>
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
                color: "text-[#6366f1]",
              },
              {
                label: "Blocked",
                value: stats.blocked,
                icon: AlertCircle,
                color: "text-[#ef4444]",
              },
              {
                label: "Archived",
                value: stats.archived,
                icon: Archive,
                color: "text-[#908fa0]",
              },
              {
                label: "Complete",
                value: stats.readyToArchive,
                icon: CheckCircle2,
                color: "text-[#22c55e]",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-[#171f33] px-4 py-3"
              >
                <Icon size={18} className={color} strokeWidth={1.5} />
                <div>
                  <div className="text-lg font-semibold text-[#dae2fd]">
                    {value}
                  </div>
                  <div className="text-xs text-[#908fa0]">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-1 border-b border-[#464554] px-4 py-2">
            {(["all", "active", "blocked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-[#6366f1]/20 text-[#6366f1]"
                    : "text-[#908fa0] hover:text-[#c7c4d7]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Changes list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <GitBranch
                  size={32}
                  className="text-[#464554]"
                  strokeWidth={1}
                />
                <p className="text-sm text-[#908fa0]">No changes found</p>
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
          </div>
        </div>

        {/* Activity feed */}
        <div className="flex w-64 flex-col border-l border-[#464554]">
          <div className="flex items-center gap-2 border-b border-[#464554] px-3 py-2.5">
            <Activity size={14} className="text-[#908fa0]" strokeWidth={1.5} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-[#908fa0]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Activity
            </span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.id} className="px-3 py-2.5 hover:bg-[#1c2438]">
                <div className="flex items-start gap-2">
                  <Clock
                    size={11}
                    className="mt-0.5 shrink-0 text-[#908fa0]"
                    strokeWidth={1.5}
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-[#c7c4d7]">
                      <span className="font-medium text-[#dae2fd]">
                        {item.artifactName}
                      </span>{" "}
                      {item.action}
                    </p>
                    <p
                      className="truncate text-[11px] text-[#908fa0]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {item.changeName}
                    </p>
                    <p className="text-[11px] text-[#464554]">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
