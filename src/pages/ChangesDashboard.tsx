import ActivityFeed from "@/components/changes/ActivityFeed";
import ChangeRow from "@/components/changes/ChangeRow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChangesStore } from "@/store/changes.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import type { Change } from "@/types";
import {
  Archive,
  CheckCircle2,
  FolderOpen,
  GitBranch,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const FILTER_OPTIONS = ["all", "active", "complete", "archived"] as const;

const STAT_ITEMS = [
  { label: "Active", icon: GitBranch, color: "text-primary", key: "active" },
  {
    label: "Complete",
    icon: CheckCircle2,
    color: "text-success",
    key: "complete",
  },
  {
    label: "Archived",
    icon: Archive,
    color: "text-muted-foreground",
    key: "archived",
  },
] as const;

export default function ChangesDashboard() {
  const navigate = useNavigate();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const useMock = useWorkspaceStore((s) => s.useMock);
  const {
    changes,
    archivedChanges,
    isLoading,
    filter,
    setFilter,
    getFilteredChanges,
    loadChanges,
    loadArchivedChanges,
    refreshAllChanges,
  } = useChangesStore();

  const [pendingArchiveChange, setPendingArchiveChange] =
    useState<Change | null>(null);

  useEffect(() => {
    if (!workspace?.path) return;
    loadChanges(workspace.path);
    loadArchivedChanges(workspace.path);
  }, [workspace?.path, loadChanges, loadArchivedChanges]);

  const filtered = useMemo(() => getFilteredChanges(), [changes, filter]);

  const stats = useMemo(
    () => ({
      active: changes.filter((c) => c.status === "active").length,
      complete: changes.filter((c) => c.status === "complete").length,
      archived: archivedChanges.length,
    }),
    [changes, archivedChanges],
  );

  const handleSync = useCallback(() => {
    if (workspace?.path) refreshAllChanges(workspace.path);
  }, [workspace?.path, refreshAllChanges]);

  function handleChangeWorkspace() {
    navigate("/");
  }

  async function handleConfirmArchive() {
    if (!pendingArchiveChange) return;
    const name = pendingArchiveChange.name;
    setPendingArchiveChange(null);
    try {
      await useChangesStore.getState().archiveChange(name);
    } catch {
      // Error is stored in changes.store.error; UI can display it from there
    }
  }

  function handleArchiveDialogChange(open: boolean) {
    if (!open) setPendingArchiveChange(null);
  }

  function handleNavigateToChange(changeId: string) {
    navigate(`/changes/${changeId}`);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
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
            className="active:scale-95 transition-transform"
          >
            <RefreshCw
              size={13}
              strokeWidth={1.5}
              className={
                isLoading
                  ? "animate-spin"
                  : "transition-transform active:rotate-180"
              }
            />
          </Button>
          <Button
            onClick={handleChangeWorkspace}
            variant="outline"
            size="sm"
            className="active:scale-95 transition-transform"
          >
            <FolderOpen size={14} strokeWidth={1.5} />
            Change workspace
          </Button>
          <Button size="sm" className="active:scale-95 transition-transform">
            <Plus size={14} strokeWidth={1.5} />
            New change
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
            {STAT_ITEMS.map(({ label, icon: Icon, color, key }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-card px-4 py-3"
              >
                <Icon size={18} className={color} strokeWidth={1.5} />
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {stats[key]}
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 border-b border-border px-4 py-2">
            {FILTER_OPTIONS.map((f) => (
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

          <ScrollArea className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <GitBranch size={32} className="text-border" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">
                  No changes found
                </p>
              </div>
            ) : (
              filtered.map((change) => (
                <ChangeRow
                  key={change.id}
                  change={change}
                  onClick={() => handleNavigateToChange(change.id)}
                  onArchive={setPendingArchiveChange}
                />
              ))
            )}
          </ScrollArea>
        </div>

        <ActivityFeed useMock={useMock} />
      </div>

      <AlertDialog
        open={pendingArchiveChange !== null}
        onOpenChange={handleArchiveDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this change?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move{" "}
              <span style={{ fontFamily: "var(--font-mono)" }}>
                {pendingArchiveChange?.name}
              </span>{" "}
              to the archive. This action cannot be undone from the UI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmArchive}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
