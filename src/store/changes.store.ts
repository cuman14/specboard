import { MOCK_CHANGES } from "@/lib/mock-data";
import {
  archiveChange as archiveChangeCmd,
  isTauri,
  readArchivedChanges,
  readWorkspace,
} from "@/lib/tauri-commands";
import type { Change } from "@/types";
import { create } from "zustand";
import { useWorkspaceStore } from "./workspace.store";

interface ChangesState {
  changes: Change[];
  archivedChanges: Change[];
  activeChange: Change | null;
  selectedChangeId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: "all" | "active" | "complete" | "archived";
  sortBy: "name" | "createdAt" | "progress";

  loadChanges: (workspacePath: string) => Promise<void>;
  loadArchivedChanges: (workspacePath: string) => Promise<void>;
  refreshAllChanges: (workspacePath: string) => Promise<void>;
  archiveChange: (changeName: string) => Promise<void>;
  setActiveChange: (change: Change | null) => void;
  selectChange: (id: string | null) => void;
  setFilter: (filter: ChangesState["filter"]) => void;
  setSortBy: (sortBy: ChangesState["sortBy"]) => void;
  getFilteredChanges: () => Change[];
}

export const useChangesStore = create<ChangesState>()((set, get) => ({
  changes: [],
  archivedChanges: [],
  activeChange: null,
  selectedChangeId: null,
  isLoading: false,
  error: null,
  filter: "all",
  sortBy: "createdAt",

  loadChanges: async (workspacePath: string) => {
    const state = get();
    if (state.isLoading) return;
    if (state.changes.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      if (!isTauri || useWorkspaceStore.getState().useMock) {
        set((s) => ({
          changes: s.changes.length > 0 ? s.changes : MOCK_CHANGES,
          activeChange: s.activeChange,
          isLoading: false,
        }));
        return;
      }
      const data = await readWorkspace(workspacePath);
      console.log(
        "[loadChanges] raw changes from backend:",
        data.changes.map((c) => ({
          id: c.id,
          status: c.status,
          tasksTotal: c.tasksTotal,
          tasksCompleted: c.tasksCompleted,
        })),
      );
      set((s) => {
        if (data.changes.length === 0) {
          return { ...s, isLoading: false };
        }
        const incoming = new Map(data.changes.map((c) => [c.id, c]));
        const merged = s.changes.map((c) => incoming.get(c.id) ?? c);
        const existingIds = new Set(s.changes.map((c) => c.id));
        for (const c of data.changes) {
          if (!existingIds.has(c.id)) merged.push(c);
        }
        const refreshed = s.activeChange
          ? (incoming.get(s.activeChange.id) ?? s.activeChange)
          : s.activeChange;
        return { changes: merged, activeChange: refreshed, isLoading: false };
      });
    } catch (err) {
      set((s) => ({ ...s, error: String(err), isLoading: false }));
    }
  },

  loadArchivedChanges: async (workspacePath: string) => {
    if (!isTauri || useWorkspaceStore.getState().useMock) return;
    try {
      const archived = await readArchivedChanges(workspacePath);
      set({ archivedChanges: archived });
    } catch {
      // Silently fail — not critical
    }
  },

  refreshAllChanges: async (workspacePath: string) => {
    if (!isTauri || useWorkspaceStore.getState().useMock) {
      console.log(
        "[refreshAllChanges] skipped: isTauri=",
        isTauri,
        "useMock=",
        useWorkspaceStore.getState().useMock,
      );
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const data = await readWorkspace(workspacePath);
      console.log(
        "[refreshAllChanges] got",
        data.changes.length,
        "changes from backend:",
        data.changes.map((c) => c.id),
      );
      const incoming = new Map(data.changes.map((c) => [c.id, c]));
      set((s) => {
        const existingIds = new Set(s.changes.map((c) => c.id));
        // Keep only changes that still exist in the workspace (removes archived)
        const merged = s.changes
          .map((c) => incoming.get(c.id) ?? null)
          .filter((c): c is Change => c !== null);
        console.log(
          "[refreshAllChanges] before:",
          s.changes.length,
          "after filter:",
          merged.length,
        );
        // Add new changes not yet in the store
        for (const c of data.changes) {
          if (!existingIds.has(c.id)) merged.push(c);
        }
        const refreshed = s.activeChange
          ? (incoming.get(s.activeChange.id) ?? s.activeChange)
          : s.activeChange;
        console.log("[refreshAllChanges] final count:", merged.length);
        return { changes: merged, activeChange: refreshed, isLoading: false };
      });
      await get().loadArchivedChanges(workspacePath);
    } catch (err) {
      set((s) => ({ ...s, error: String(err), isLoading: false }));
    }
  },

  setActiveChange: (change: Change | null) => {
    set({ activeChange: change });
  },

archiveChange: async (changeName: string) => {
    const workspacePath = useWorkspaceStore.getState().workspace?.path ?? "";
    if (!isTauri || useWorkspaceStore.getState().useMock) {
      set((s) => ({
        changes: s.changes.filter((c) => c.name !== changeName),
        archivedChanges: [
          ...s.archivedChanges,
          ...s.changes
            .filter((c) => c.name === changeName)
            .map((c) => ({ ...c, status: "archived" as const })),
        ],
        activeChange: null,
      }));
      return;
    }
    try {
      await archiveChangeCmd(changeName, workspacePath);
      set({ changes: [], archivedChanges: [], activeChange: null });
      await get().loadChanges(workspacePath);
      await get().loadArchivedChanges(workspacePath);
    } catch (err) {
      console.error("[archiveChange] error:", err);
      set({ error: String(err) });
      throw err;
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
    const { changes, archivedChanges, filter, sortBy } = get();
    const filtered =
      filter === "archived"
        ? archivedChanges
        : filter === "all"
          ? changes
          : changes.filter((c) => c.status === filter);

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "createdAt")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "progress") {
        const progressA = a.artifacts.filter(
          (art) => art.status === "ready",
        ).length;
        const progressB = b.artifacts.filter(
          (art) => art.status === "ready",
        ).length;
        return progressB - progressA;
      }
      return 0;
    });
  },
}));
