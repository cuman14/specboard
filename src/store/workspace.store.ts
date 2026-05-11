import { MOCK_WORKSPACE } from "@/lib/mock-data";
import { isTauri, readWorkspace } from "@/lib/tauri-commands";
import type { WorkspaceInfo } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  workspace: WorkspaceInfo | null;
  recentWorkspaces: string[];
  isLoading: boolean;
  error: string | null;
  useMock: boolean;

  setWorkspace: (path: string) => Promise<void>;
  clearWorkspace: () => void;
  addRecentWorkspace: (path: string) => void;
  setUseMock: (value: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspace: null,
      recentWorkspaces: [],
      isLoading: false,
      error: null,
      useMock: !isTauri,

      setWorkspace: async (path: string) => {
        set({ isLoading: true, error: null });
        try {
          if (!isTauri || get().useMock) {
            set({
              workspace: MOCK_WORKSPACE,
              isLoading: false,
            });
            get().addRecentWorkspace(path);
            return;
          }
          const data = await readWorkspace(path);
          set({
            workspace: {
              path: data.path,
              isValid: data.isValid,
              profile: data.profile,
              changesCount: data.changesCount,
              archivedCount: data.archivedCount,
            },
            isLoading: false,
          });
          get().addRecentWorkspace(path);
        } catch (err) {
          set({ error: String(err), isLoading: false });
        }
      },

      clearWorkspace: () => {
        set({ workspace: null, error: null });
      },

      addRecentWorkspace: (path: string) => {
        set((state) => ({
          recentWorkspaces: [
            path,
            ...state.recentWorkspaces.filter((p) => p !== path),
          ].slice(0, 5),
        }));
      },

      setUseMock: (value: boolean) => {
        set({ useMock: value });
      },
    }),
    {
      name: "specboard-workspace",
      partialize: (state) => ({
        recentWorkspaces: state.recentWorkspaces,
        useMock: state.useMock,
      }),
    },
  ),
);
