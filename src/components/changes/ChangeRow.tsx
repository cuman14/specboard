import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDateTime, formatRelativeTime, getArtifactProgress } from "@/lib/utils";
import type { Change } from "@/types";
import { Archive, ArrowRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active: "text-primary bg-primary/10 border-primary/30",
  complete: "text-success bg-success/10 border-success/30",
  archived: "text-muted-foreground bg-muted-foreground/10 border-muted-foreground/30",
};

const ARTIFACT_DOT_COLORS: Record<string, string> = {
  ready: "bg-success",
  pending: "bg-warning",
  blocked: "bg-destructive",
  missing: "bg-surface-highest",
};

interface ChangeRowProps {
  change: Change;
  onClick: () => void;
  onArchive?: (change: Change) => void;
}

function ChangeRow({ change, onClick, onArchive }: ChangeRowProps) {
  const { completed, total } = getArtifactProgress(change.artifacts);
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const allTasksDone = change.tasksTotal === 0 || change.tasksCompleted === change.tasksTotal;
  const isArchived = change.status === "archived";

  function handleArchiveClick(e: React.MouseEvent) {
    e.stopPropagation();
    onArchive?.(change);
  }

  return (
    <div
      onClick={onClick}
      className={`group flex cursor-pointer items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors ${
        isArchived
          ? "bg-card/50 opacity-70 hover:bg-surface-high hover:opacity-100"
          : "hover:bg-surface-high"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`truncate text-sm font-medium ${isArchived ? "text-muted-foreground" : "text-foreground"}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {change.name}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold ${STATUS_COLORS[change.status]}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {isArchived && "✓ "}
            {change.status}
          </Badge>
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex items-center gap-1">
            {change.artifacts.map((a) => (
              <div
                key={a.name}
                title={`${a.name}: ${a.status}`}
                className={`h-1.5 w-1.5 rounded-full ${ARTIFACT_DOT_COLORS[a.status] ?? "bg-surface-highest"}`}
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
        <div className="w-20">
          <Progress value={pct} className={`h-1 ${isArchived ? "opacity-50" : ""}`} />
        </div>
        <div className="w-20 text-right">
          <span className="block text-xs text-muted-foreground">
            {formatRelativeTime(change.createdAt)}
          </span>
          <span
            className="block text-[10px] text-muted-foreground/60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formatDateTime(change.createdAt)}
          </span>
        </div>
        {!isArchived && allTasksDone && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Archive this change"
            onClick={handleArchiveClick}
          >
            <Archive size={13} strokeWidth={1.5} />
          </Button>
        )}
        {isArchived && (
          <div className="h-7 w-7 flex items-center justify-center text-muted-foreground/50">
            <Archive size={13} strokeWidth={1.5} />
          </div>
        )}
        <ArrowRight
          size={14}
          className={`shrink-0 transition-colors ${
            isArchived
              ? "text-muted-foreground/30 group-hover:text-muted-foreground/60"
              : "text-border group-hover:text-primary"
          }`}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

export default ChangeRow;
