import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import KanbanCard from "./KanbanCard";
import type { Change } from "@/types";

interface KanbanColumnDef {
  id: string;
  label: string;
  color: string;
}

interface KanbanColumnProps {
  column: KanbanColumnDef;
  cardIds: string[];
  changes: Record<string, Change>;
}

function KanbanColumn({ column, cardIds, changes }: KanbanColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded border border-border bg-card max-h-full">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${column.color}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {column.label}
        </span>
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

export default KanbanColumn;
