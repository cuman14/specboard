/**
 * Tests for the archiveChange action in useChangesStore.
 */

const mockArchiveChangeCmd = jest.fn();
const mockReadWorkspace = jest.fn();
const mockReadArchivedChanges = jest.fn();

jest.mock("@/lib/tauri-commands", () => ({
  archiveChange: mockArchiveChangeCmd,
  readWorkspace: mockReadWorkspace,
  readArchivedChanges: mockReadArchivedChanges,
  isTauri: true,
}));

const mockGetWorkspaceState = jest.fn();

jest.mock("@/store/workspace.store", () => ({
  useWorkspaceStore: {
    getState: () => mockGetWorkspaceState(),
  },
}));

jest.mock("@/lib/mock-data", () => ({
  MOCK_CHANGES: [
    {
      id: "change-a",
      name: "change-a",
      status: "active",
      schema: "spec-driven",
      createdAt: "2026-01-01T00:00:00Z",
      artifacts: [],
      tasksTotal: 3,
      tasksCompleted: 3,
      column: "draft",
    },
    {
      id: "change-b",
      name: "change-b",
      status: "active",
      schema: "spec-driven",
      createdAt: "2026-01-02T00:00:00Z",
      artifacts: [],
      tasksTotal: 5,
      tasksCompleted: 2,
      column: "draft",
    },
  ],
}));

import { useChangesStore } from "@/store/changes.store";

const MOCK_WORKSPACE_PATH = "/test/workspace";

function seedStore(
  changes = [
    { id: "change-a", name: "change-a" },
    { id: "change-b", name: "change-b" },
  ],
) {
  useChangesStore.setState({
    changes: changes.map((c) => ({
      ...c,
      status: "active" as const,
      schema: "spec-driven",
      createdAt: "2026-01-01T00:00:00Z",
      artifacts: [],
      tasksTotal: 3,
      tasksCompleted: 3,
      column: "draft" as const,
    })),
    isLoading: false,
    error: null,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetWorkspaceState.mockReturnValue({
    workspace: { path: MOCK_WORKSPACE_PATH },
    useMock: false,
  });
  mockReadArchivedChanges.mockResolvedValue([]);
  seedStore();
});

describe("archiveChange: success path", () => {
  it("calls archiveChange IPC with the correct changeName and workspacePath", async () => {
    mockArchiveChangeCmd.mockResolvedValue({
      stdout: "",
      stderr: "",
      exitCode: 0,
    });
    mockReadWorkspace.mockResolvedValue({
      path: MOCK_WORKSPACE_PATH,
      isValid: true,
      profile: "core",
      changes: [],
      changesCount: 0,
      archivedCount: 1,
    });

    await useChangesStore.getState().archiveChange("change-a");

    expect(mockArchiveChangeCmd).toHaveBeenCalledWith(
      "change-a",
      MOCK_WORKSPACE_PATH,
    );
  });

  it("calls loadChanges (readWorkspace) after a successful archive", async () => {
    mockArchiveChangeCmd.mockResolvedValue({
      stdout: "",
      stderr: "",
      exitCode: 0,
    });
    mockReadWorkspace.mockResolvedValue({
      path: MOCK_WORKSPACE_PATH,
      isValid: true,
      profile: "core",
      changes: [],
      changesCount: 0,
      archivedCount: 1,
    });

    await useChangesStore.getState().archiveChange("change-a");

    expect(mockReadWorkspace).toHaveBeenCalledWith(MOCK_WORKSPACE_PATH);
  });

  it("removes the archived change from changes after a successful archive", async () => {
    mockArchiveChangeCmd.mockResolvedValue({
      stdout: "",
      stderr: "",
      exitCode: 0,
    });
    mockReadWorkspace.mockResolvedValue({
      path: MOCK_WORKSPACE_PATH,
      isValid: true,
      profile: "core",
      changes: [
        {
          id: "change-b",
          name: "change-b",
          status: "active",
          schema: "spec-driven",
          createdAt: "2026-01-02T00:00:00Z",
          artifacts: [],
          tasksTotal: 5,
          tasksCompleted: 2,
          column: "draft",
        },
      ],
      changesCount: 1,
      archivedCount: 1,
    });

    await useChangesStore.getState().archiveChange("change-a");

    const { changes } = useChangesStore.getState();
    expect(changes.find((c) => c.id === "change-a")).toBeUndefined();
    expect(changes.find((c) => c.id === "change-b")).toBeDefined();
  });

  it("populates archivedChanges after a successful archive", async () => {
    const archivedChange = {
      id: "change-a",
      name: "change-a",
      status: "archived" as const,
      schema: "spec-driven",
      createdAt: "2026-01-01T00:00:00Z",
      artifacts: [],
      tasksTotal: 3,
      tasksCompleted: 3,
      column: "draft" as const,
    };
    mockArchiveChangeCmd.mockResolvedValue({
      stdout: "",
      stderr: "",
      exitCode: 0,
    });
    mockReadWorkspace.mockResolvedValue({
      path: MOCK_WORKSPACE_PATH,
      isValid: true,
      profile: "core",
      changes: [],
      changesCount: 0,
      archivedCount: 1,
    });
    mockReadArchivedChanges.mockResolvedValue([archivedChange]);

    await useChangesStore.getState().archiveChange("change-a");

    const { archivedChanges } = useChangesStore.getState();
    expect(archivedChanges).toHaveLength(1);
    expect(archivedChanges[0].id).toBe("change-a");
  });
});

describe("archiveChange: failure path", () => {
  it("propagates the error thrown by archiveChange IPC", async () => {
    mockArchiveChangeCmd.mockRejectedValue(
      new Error("Archive failed with exit code 1"),
    );

    await expect(
      useChangesStore.getState().archiveChange("change-a"),
    ).rejects.toThrow("Archive failed with exit code 1");
  });

  it("does not call loadChanges when archive IPC throws", async () => {
    mockArchiveChangeCmd.mockRejectedValue(new Error("failed"));

    await expect(
      useChangesStore.getState().archiveChange("change-a"),
    ).rejects.toThrow();

    expect(mockReadWorkspace).not.toHaveBeenCalled();
  });
});

describe("getFilteredChanges", () => {
  it("filter=all excludes archived changes", () => {
    useChangesStore.setState({
      changes: [
        {
          id: "change-a",
          name: "change-a",
          status: "active" as const,
          schema: "spec-driven",
          createdAt: "2026-01-01T00:00:00Z",
          artifacts: [],
          tasksTotal: 3,
          tasksCompleted: 3,
          column: "draft" as const,
        },
      ],
      archivedChanges: [
        {
          id: "change-z",
          name: "change-z",
          status: "archived" as const,
          schema: "spec-driven",
          createdAt: "2025-01-01T00:00:00Z",
          artifacts: [],
          tasksTotal: 2,
          tasksCompleted: 2,
          column: "draft" as const,
        },
      ],
      filter: "all",
    });

    const result = useChangesStore.getState().getFilteredChanges();
    expect(result.find((c) => c.id === "change-z")).toBeUndefined();
    expect(result.find((c) => c.id === "change-a")).toBeDefined();
  });

  it("filter=archived shows only archived changes", () => {
    useChangesStore.setState({
      changes: [
        {
          id: "change-a",
          name: "change-a",
          status: "active" as const,
          schema: "spec-driven",
          createdAt: "2026-01-01T00:00:00Z",
          artifacts: [],
          tasksTotal: 3,
          tasksCompleted: 3,
          column: "draft" as const,
        },
      ],
      archivedChanges: [
        {
          id: "change-z",
          name: "change-z",
          status: "archived" as const,
          schema: "spec-driven",
          createdAt: "2025-01-01T00:00:00Z",
          artifacts: [],
          tasksTotal: 2,
          tasksCompleted: 2,
          column: "draft" as const,
        },
      ],
      filter: "archived",
    });

    const result = useChangesStore.getState().getFilteredChanges();
    expect(result.find((c) => c.id === "change-z")).toBeDefined();
    expect(result.find((c) => c.id === "change-a")).toBeUndefined();
  });
});

describe("archiveChange: mock mode", () => {
  beforeEach(() => {
    mockGetWorkspaceState.mockReturnValue({
      workspace: { path: MOCK_WORKSPACE_PATH },
      useMock: true,
    });
  });

  it("removes the archived change from the local list without calling IPC", async () => {
    await useChangesStore.getState().archiveChange("change-a");

    const remaining = useChangesStore.getState().changes;
    expect(remaining.find((c) => c.name === "change-a")).toBeUndefined();
    expect(mockArchiveChangeCmd).not.toHaveBeenCalled();
  });

  it("keeps other changes intact after archiving one", async () => {
    await useChangesStore.getState().archiveChange("change-a");

    const remaining = useChangesStore.getState().changes;
    expect(remaining.find((c) => c.name === "change-b")).toBeDefined();
  });
});
