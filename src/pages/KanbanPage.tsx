import { getArtifactProgress } from "@/lib/utils";
import { useChangesStore } from "@/store/changes.store";
import { useKanbanStore } from "@/store/kanban.store";
import type { Change, KanbanColumn } from "@/types";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertCircle, GripVertical } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const COLUMNS: { id: KanbanColumn; label: string; color: string }[] = [
  { id: "draft", label: "Draft", color: "text-muted-foreground" },
  { id: "in-review", label: "In Review", color: "text-warning" },
  { id: "validated", label: "Validated", color: "text-success" },
];

const KanbanCard = memo(function KanbanCard({
  change,
  isDragging,
}: {
  change: Change;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
              className={`h-1.5 w-1.5 rounded-full ${
                a.status === "ready"
                  ? "bg-success"
                  : a.status === "pending"
                    ? "bg-warning"
                    : a.status === "blocked"
                      ? "bg-destructive"
                      : "bg-surface-highest"
              }`}
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

        {change.status === "blocked" && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-destructive">
            <AlertCircle size={11} strokeWidth={1.5} />
            Blocked
          </div>
        )}
      </div>
    </div>
  );
});

function KanbanColumn({
  column,
  cardIds,
  changes,
}: {
  column: (typeof COLUMNS)[0];
  cardIds: string[];
  changes: Record<string, Change>;
}) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${column.color}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {column.label}
          </span>
        </div>
        <Badge variant="secondary" className="text-[11px]">
          {cardIds.length}
        </Badge>
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
          {cardIds.map((id) => {
            const change = changes[id];
            if (!change) return null;
            return <KanbanCard key={id} change={change} />;
          })}
          {cardIds.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-xs text-border">
              Drop cards here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const { columns, changes, moveCard, loadFromChanges } = useKanbanStore();
  const realChanges = useChangesStore((s) => s.changes);

  useEffect(() => {
    if (realChanges.length > 0) {
      loadFromChanges(realChanges);
    }
  }, [realChanges, loadFromChanges]);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragId(null);
      if (!over) return;

      const changeId = String(active.id);
      const overId = String(over.id);

      const targetColumn = COLUMNS.find(
        (col) =>
          col.id === overId || (columns[col.id] as string[]).includes(overId),
      );

      if (targetColumn) {
        moveCard(changeId, targetColumn.id);
      }
    },
    [columns, moveCard],
  );

  const activeChange = activeDragId ? changes[activeDragId] : null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-5 py-3">
        <h1 className="text-base font-semibold text-foreground">Kanban Board</h1>
        <p className="text-xs text-muted-foreground">
          Drag cards to move changes between stages
        </p>
      </div>

      {/* Board */}
      <div className="flex flex-1 gap-4 overflow-x-auto overflow-y-hidden p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cardIds={columns[col.id]}
              changes={changes}
            />
          ))}

          <DragOverlay>
            {activeChange ? (
              <div className="rotate-2 opacity-90">
                <KanbanCard change={activeChange} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
