import type { Change, KanbanColumn } from "@/types";
import { create } from "zustand";

interface KanbanState {
  columns: Record<KanbanColumn, string[]>;
  changes: Record<string, Change>;

  loadFromChanges: (changes: Change[]) => void;
  moveCard: (changeId: string, toColumn: KanbanColumn) => void;
}

function buildColumns(changes: Change[]): {
  columns: Record<KanbanColumn, string[]>;
  changesMap: Record<string, Change>;
} {
  const columns: Record<KanbanColumn, string[]> = {
    draft: [],
    "in-review": [],
    validated: [],
  };
  const changesMap: Record<string, Change> = {};

  for (const change of changes) {
    changesMap[change.id] = change;
    columns[change.column].push(change.id);
  }

  return { columns, changesMap };
}

const empty = buildColumns([]);

export const useKanbanStore = create<KanbanState>()((set) => ({
  columns: empty.columns,
  changes: empty.changesMap,

  loadFromChanges: (changes: Change[]) => {
    const { columns, changesMap } = buildColumns(changes);
    set({ columns, changes: changesMap });
  },

  moveCard: (changeId: string, toColumn: KanbanColumn) => {
    set((state) => {
      const previousChange = state.changes[changeId];
      if (!previousChange) return state;

      const fromColumn = previousChange.column;
      if (fromColumn === toColumn) return state;

      const newColumns = {
        ...state.columns,
        [fromColumn]: state.columns[fromColumn].filter((id) => id !== changeId),
        [toColumn]: [...state.columns[toColumn], changeId],
      };

      const updatedChange: Change = { ...previousChange, column: toColumn };

      return {
        columns: newColumns,
        changes: { ...state.changes, [changeId]: updatedChange },
      };
    });
  },
}));
