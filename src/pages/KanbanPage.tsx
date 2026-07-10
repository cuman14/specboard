import KanbanCard from "@/components/kanban/KanbanCard";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import { useChangesStore } from "@/store/changes.store";
import { useKanbanStore } from "@/store/kanban.store";
import type { KanbanColumn as KanbanColumnType } from "@/types";
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
import { useCallback, useEffect, useState } from "react";

const COLUMNS: { id: KanbanColumnType; label: string; color: string }[] = [
  { id: "draft", label: "Draft", color: "text-muted-foreground" },
  { id: "in-review", label: "In Review", color: "text-warning" },
  { id: "validated", label: "Validated", color: "text-success" },
];

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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
      <div className="border-b border-border px-5 py-3">
        <h1 className="text-base font-semibold text-foreground">
          Kanban Board
        </h1>
        <p className="text-xs text-muted-foreground">
          Drag cards to move changes between stages
        </p>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto overflow-y-auto p-5 items-start">
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
