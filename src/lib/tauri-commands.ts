import type {
  Change,
  SpecFile,
  ValidationOutput,
  WorkspaceInfo,
} from "@/types";

let isTauri = false;
try {
  isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
} catch {
  isTauri = false;
}

async function invoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T> {
  if (!isTauri) {
    throw new Error(`Tauri not available: ${cmd}`);
  }
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(cmd, args);
}

export interface WorkspaceData {
  path: string;
  isValid: boolean;
  profile: "core" | "expanded";
  changes: Change[];
  changesCount: number;
  archivedCount: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function openFolderDialog(): Promise<string | null> {
  return invoke<string | null>("open_folder_dialog");
}

export async function readWorkspace(path: string): Promise<WorkspaceData> {
  const raw = await invoke<{
    path: string;
    is_valid: boolean;
    profile: string;
    changes: Array<{
      id: string;
      name: string;
      status: string;
      schema: string;
      created_at: string;
      artifacts: Array<{
        name: string;
        status: string;
        path: string;
        last_modified?: string;
      }>;
      tasks_total: number;
      tasks_completed: number;
      column: string;
    }>;
    changes_count: number;
    archived_count: number;
  }>("read_workspace", { path });

  return {
    path: raw.path,
    isValid: raw.is_valid,
    profile: raw.profile as "core" | "expanded",
    changesCount: raw.changes_count,
    archivedCount: raw.archived_count,
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

export async function readArtifact(path: string): Promise<string> {
  return invoke<string>("read_artifact", { path });
}

export async function runOpenspecCommand(
  cmd: string,
  args: string[],
  cwd?: string,
): Promise<CommandResult> {
  const raw = await invoke<{
    stdout: string;
    stderr: string;
    exit_code: number;
  }>("run_openspec_command", { cmd, args, cwd });
  return { stdout: raw.stdout, stderr: raw.stderr, exitCode: raw.exit_code };
}

export async function readSpecsTree(
  workspacePath: string,
): Promise<SpecFile[]> {
  return invoke<SpecFile[]>("read_specs_tree", { workspacePath });
}

export async function openInExplorer(path: string): Promise<void> {
  return invoke<void>("open_in_explorer", { path });
}

export async function writeArtifact(
  path: string,
  content: string,
): Promise<void> {
  return invoke<void>("write_artifact", { path, content });
}

export interface TaskInfo {
  id: string;
  label: string;
  done: boolean;
  line_index: number;
  layer?: string;
}

export interface TasksData {
  tasks: TaskInfo[];
  total: number;
  completed: number;
}

export async function readTasks(path: string): Promise<TasksData> {
  return invoke<TasksData>("read_tasks", { path });
}

export async function readArchivedChanges(path: string): Promise<Change[]> {
  const raw = await invoke<
    {
      id: string;
      name: string;
      status: string;
      schema: string;
      created_at: string;
      artifacts: Array<{
        name: string;
        status: string;
        path: string;
        last_modified?: string;
      }>;
      tasks_total: number;
      tasks_completed: number;
      column: string;
    }[]
  >("read_archived_changes", { path });

  return raw.map((c) => ({
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
  }));
}

export async function watchWorkspace(path: string): Promise<void> {
  return invoke<void>("watch_workspace", { path });
}

export async function stopWatching(): Promise<void> {
  return invoke<void>("stop_watching");
}

export async function onWorkspaceChanged(
  callback: () => void,
): Promise<() => void> {
  if (!isTauri) return () => {};
  const { listen } = await import("@tauri-apps/api/event");
  const unlisten = await listen("workspace-changed", callback);
  return unlisten;
}

export async function archiveChange(
  changeName: string,
  workspacePath: string,
): Promise<CommandResult> {
  const result = await runOpenspecCommand(
    "archive",
    [changeName, "-y"],
    workspacePath,
  );
  if (result.exitCode !== 0 || result.stdout.includes("Aborted")) {
    throw new Error(
      result.stderr || result.stdout || `Archive failed with exit code ${result.exitCode}`,
    );
  }
  return result;
}

export async function validateChange(
  changeName: string,
  cwd: string,
): Promise<ValidationOutput> {
  const result = await runOpenspecCommand(
    "validate",
    [changeName, "--json"],
    cwd,
  );
  if (result.exitCode !== 0) {
    throw new Error(
      result.stderr || `Validation failed with exit code ${result.exitCode}`,
    );
  }
  try {
    return JSON.parse(result.stdout) as ValidationOutput;
  } catch {
    throw new Error(`Failed to parse validation output: ${result.stdout}`);
  }
}

export { isTauri };

export interface WorkspaceInfoResult extends WorkspaceInfo {}
