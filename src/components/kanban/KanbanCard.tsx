import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GripVertical } from "lucide-react";
import { getArtifactProgress } from "@/lib/utils";
import type { Change } from "@/types";

const ARTIFACT_DOT_COLOR: Record<string, string> = {
  ready: "bg-success",
  pending: "bg-warning",
  blocked: "bg-destructive",
  missing: "bg-surface-highest",
};

interface KanbanCardProps {
  change: Change;
  isDragging?: boolean;
}

const KanbanCard = memo(function KanbanCard({ change, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: change.id,
  });
  const { completed, total } = getArtifactProgress(change.artifacts);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group cursor-default rounded border border-border bg-card p-3 transition-colors hover:border-primary"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-sm font-medium text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {change.name}
        </span>
        <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="icon"
          className="mt-0.5 h-5 w-5 shrink-0 cursor-grab text-border opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical size={14} strokeWidth={1.5} />
        </Button>
      </div>

      <div className="mt-2.5">
        <div className="flex items-center gap-1.5">
          {change.artifacts.map((a) => (
            <div
              key={a.name}
              title={`${a.name}: ${a.status}`}
              className={`h-1.5 w-1.5 rounded-full ${ARTIFACT_DOT_COLOR[a.status] ?? "bg-surface-highest"}`}
            />
          ))}
          <span className="ml-1 text-[11px] text-muted-foreground">
            {completed}/{total}
          </span>
        </div>

        {change.tasksTotal > 0 && (
          <div className="mt-1.5">
            <Progress
              value={(change.tasksCompleted / change.tasksTotal) * 100}
              className="h-1"
            />
            <span className="text-[11px] text-muted-foreground">
              {change.tasksCompleted}/{change.tasksTotal} tasks
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export default KanbanCard;
