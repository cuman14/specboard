import { create } from "zustand";
import type { Change } from "@/types";
import { MOCK_CHANGES } from "@/lib/mock-data";
import { isTauri, readWorkspace } from "@/lib/tauri-commands";

interface ChangesState {
  changes: Change[];
  selectedChangeId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: "all" | "active" | "blocked" | "archived";
  sortBy: "name" | "createdAt" | "progress";

  loadChanges: (workspacePath: string) => Promise<void>;
  selectChange: (id: string | null) => void;
  setFilter: (filter: ChangesState["filter"]) => void;
  setSortBy: (sortBy: ChangesState["sortBy"]) => void;
  getFilteredChanges: () => Change[];
}

export const useChangesStore = create<ChangesState>()((set, get) => ({
  changes: [],
  selectedChangeId: null,
  isLoading: false,
  error: null,
  filter: "all",
  sortBy: "createdAt",

  loadChanges: async (workspacePath: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!isTauri) {
        set({ changes: MOCK_CHANGES, isLoading: false });
        return;
      }
      const data = await readWorkspace(workspacePath);
      set({ changes: data.changes, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false, changes: MOCK_CHANGES });
    }
  },

  selectChange: (id: string | null) => {
    set({ selectedChangeId: id });
  },

  setFilter: (filter) => {
    set({ filter });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  getFilteredChanges: () => {
    const { changes, filter, sortBy } = get();
    let filtered = filter === "all" ? changes : changes.filter((c) => c.status === filter);

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "createdAt")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "progress") {
        const progressA = a.artifacts.filter((art) => art.status === "ready").length;
        const progressB = b.artifacts.filter((art) => art.status === "ready").length;
        return progressB - progressA;
      }
      return 0;
    });
  },
}));
