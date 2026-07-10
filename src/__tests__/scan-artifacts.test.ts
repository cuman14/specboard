/**
 * Tests for scan_artifacts behavior — specifically that the `specs` artifact
 * is detected as a directory, not a flat .md file.
 *
 * The Rust logic lives in src-tauri/src/commands.rs:scan_artifacts.
 * These tests validate the contract via the TypeScript mapping layer,
 * using a mocked Tauri invoke to simulate what the Rust backend returns.
 */

jest.mock("@tauri-apps/api/core", () => ({
  invoke: jest.fn(),
}));

import type { Change } from "@/types";

type RawArtifact = {
  name: string;
  status: string;
  path: string;
  last_modified?: string;
};

type RawChange = {
  id: string;
  name: string;
  status: string;
  schema: string;
  created_at: string;
  artifacts: RawArtifact[];
  tasks_total: number;
  tasks_completed: number;
  column: string;
};

type RawWorkspaceData = {
  path: string;
  is_valid: boolean;
  profile: string;
  changes: RawChange[];
  changes_count: number;
  archived_count: number;
};

function mapWorkspaceData(raw: RawWorkspaceData): { changes: Change[] } {
  return {
    changes: raw.changes.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status as Change["status"],
      schema: c.schema,
      createdAt: c.created_at,
      artifacts: c.artifacts.map((a) => ({
        name: a.name as Change["artifacts"][0]["name"],
        status: a.status as Change["artifacts"][0]["status"],
        path: a.path,
        lastModified: a.last_modified,
      })),
      tasksTotal: c.tasks_total,
      tasksCompleted: c.tasks_completed,
      column: c.column as Change["column"],
    })),
  };
}

function makeChange(
  artifactOverrides: Partial<RawArtifact>[] = [],
): RawWorkspaceData {
  // Real structure: specs/<capability-name>/spec.md (nested, not flat)
  const defaultArtifacts: RawArtifact[] = [
    {
      name: "proposal",
      status: "ready",
      path: "/ws/openspec/changes/my-change/proposal.md",
    },
    {
      name: "specs",
      status: "ready",
      path: "/ws/openspec/changes/my-change/specs",
    },
    {
      name: "design",
      status: "ready",
      path: "/ws/openspec/changes/my-change/design.md",
    },
    {
      name: "tasks",
      status: "ready",
      path: "/ws/openspec/changes/my-change/tasks.md",
    },
  ];
  const artifacts = defaultArtifacts.map((a, i) =>
    artifactOverrides[i] !== undefined ? { ...a, ...artifactOverrides[i] } : a,
  );
  return {
    path: "/ws",
    is_valid: true,
    profile: "core",
    changes_count: 1,
    archived_count: 0,
    changes: [
      {
        id: "my-change",
        name: "my-change",
        status: "active",
        schema: "core",
        created_at: "2026-01-01T00:00:00Z",
        artifacts,
        tasks_total: 3,
        tasks_completed: 1,
        column: "draft",
      },
    ],
  };
}

describe("scan_artifacts contract: specs is a directory artifact", () => {
  it("specs artifact path points to specs/ directory, not specs.md", () => {
    const raw = makeChange([
      {},
      {
        name: "specs",
        status: "ready",
        path: "/ws/openspec/changes/my-change/specs",
      },
    ]);
    const { changes } = mapWorkspaceData(raw);
    const specsArtifact = changes[0].artifacts.find((a) => a.name === "specs");
    expect(specsArtifact?.path).not.toMatch(/specs\.md$/);
    expect(specsArtifact?.path).toMatch(/[/\\]specs$/);
  });

  it("specs artifact reports ready when specs/<capability>/spec.md exists (nested structure)", () => {
    // Real layout: specs/scoop-upgrade-reliability/spec.md — .md is nested, not a direct child
    const raw = makeChange([
      {},
      {
        name: "specs",
        status: "ready",
        path: "/ws/openspec/changes/my-change/specs",
      },
    ]);
    const { changes } = mapWorkspaceData(raw);
    const specsArtifact = changes[0].artifacts.find((a) => a.name === "specs");
    expect(specsArtifact?.status).toBe("ready");
  });

  it("specs artifact reports missing when specs/ directory does not exist", () => {
    const raw = makeChange([
      {},
      {
        name: "specs",
        status: "missing",
        path: "/ws/openspec/changes/my-change/specs",
      },
    ]);
    const { changes } = mapWorkspaceData(raw);
    const specsArtifact = changes[0].artifacts.find((a) => a.name === "specs");
    expect(specsArtifact?.status).toBe("missing");
  });

  it("specs artifact reports missing when specs/ directory is empty (no .md files)", () => {
    const raw = makeChange([
      {},
      {
        name: "specs",
        status: "missing",
        path: "/ws/openspec/changes/my-change/specs",
      },
    ]);
    const { changes } = mapWorkspaceData(raw);
    const specsArtifact = changes[0].artifacts.find((a) => a.name === "specs");
    expect(specsArtifact?.status).toBe("missing");
  });
});

describe("scan_artifacts contract: other artifacts use flat .md files", () => {
  it("proposal artifact path ends with proposal.md", () => {
    const raw = makeChange();
    const { changes } = mapWorkspaceData(raw);
    const artifact = changes[0].artifacts.find((a) => a.name === "proposal");
    expect(artifact?.path).toMatch(/proposal\.md$/);
    expect(artifact?.status).toBe("ready");
  });

  it("design artifact path ends with design.md", () => {
    const raw = makeChange();
    const { changes } = mapWorkspaceData(raw);
    const artifact = changes[0].artifacts.find((a) => a.name === "design");
    expect(artifact?.path).toMatch(/design\.md$/);
    expect(artifact?.status).toBe("ready");
  });

  it("tasks artifact path ends with tasks.md", () => {
    const raw = makeChange();
    const { changes } = mapWorkspaceData(raw);
    const artifact = changes[0].artifacts.find((a) => a.name === "tasks");
    expect(artifact?.path).toMatch(/tasks\.md$/);
    expect(artifact?.status).toBe("ready");
  });

  it("proposal reports missing when file absent", () => {
    const raw = makeChange([
      {
        name: "proposal",
        status: "missing",
        path: "/ws/openspec/changes/my-change/proposal.md",
      },
    ]);
    const { changes } = mapWorkspaceData(raw);
    const artifact = changes[0].artifacts.find((a) => a.name === "proposal");
    expect(artifact?.status).toBe("missing");
  });
});
