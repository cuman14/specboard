## 1. Rust: write_artifact command

- [x] 1.1 Add `write_artifact(path: String, content: String)` async command to `src-tauri/src/commands.rs` that writes `content` to `path` using `fs::write`, returning `Err` with a descriptive message on failure
- [x] 1.2 Register `write_artifact` in the `invoke_handler` in `src-tauri/src/lib.rs`

## 2. Frontend: writeArtifact wrapper

- [x] 2.1 Add `writeArtifact(path: string, content: string): Promise<void>` typed wrapper to `src/lib/tauri-commands.ts` (calls `invoke("write_artifact", { path, content })`)

## 3. TasksView: toggle logic

- [x] 3.1 Add a `filePath?: string` prop to `TasksView` component interface
- [x] 3.2 Add local `localContent` state (initialized from `content` prop, updated on prop change via `useEffect`)
- [x] 3.3 Implement `toggleTask(lineIndex: number, done: boolean)` function that replaces the exact line's `[ ]`/`[x]` marker in `localContent`, sets optimistic state immediately, and calls `writeArtifact(filePath, newContent)` (catching errors silently when Tauri unavailable)
- [x] 3.4 Track the `lineIndex` of each task during `parseTasks` so `toggleTask` can target the correct line; store `lineIndex` on the `Task` interface
- [x] 3.5 Wire `onClick` on each task row (and its completion icon) to call `toggleTask`
- [x] 3.6 Derive `layers`, `totalTasks`, `doneTasks`, `pct` from `localContent` instead of `content` prop so the progress bar updates optimistically

## 4. ChangeDetail: pass filePath

- [x] 4.1 Locate where `TasksView` is rendered in the codebase (likely `ChangeDetail.tsx` or `ArtifactTabs.tsx`) and pass the artifact's `path` field as the `filePath` prop

## 5. Real-time refresh verification

- [x] 5.1 Confirm that `ChangeDetail` already re-reads the artifact file when `artifact-changed` fires for the active tab's path; if not, add the listener and reload logic
- [x] 5.2 Confirm that when `localContent` is updated from the prop (after Tauri re-reads the file), the UI reflects the on-disk state correctly

## 6. Tests

- [x] 6.1 Add Jest unit tests for the updated `parseTasks` function: verify `lineIndex` is correctly assigned to each task
- [x] 6.2 Add Jest unit tests for the toggle line-replacement logic: `[ ]` → `[x]`, `[x]` → `[ ]`, preserving surrounding lines
- [x] 6.3 Add a Jest test verifying that toggling when `filePath` is absent (no Tauri) does not throw
