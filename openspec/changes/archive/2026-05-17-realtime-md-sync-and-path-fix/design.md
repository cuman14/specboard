## Context

Specboard watches the workspace via a `notify`-based Tauri watcher that already emits a `workspace-changed` event on any file change. However this event carries no payload—the frontend has no way to know *which* file changed, so it can't selectively reload content. Additionally, `scan_artifacts` only checks for `specs.md` at the change directory root; it never looks in `openspec/specs/`, causing the "specs" artifact to permanently show as "missing".

Current state:
- `watch_workspace` / `stop_watching` commands exist in `lib.rs` but are NOT registered in the `invoke_handler`.
- The watcher emits `workspace-changed` (no payload) via `app.emit`.
- `ChangeDetail.tsx` loads artifact content once on mount / tab switch; never reloads.
- `SpecsExplorer.tsx` loads the tree once on mount; never reloads.
- `scan_artifacts` checks `<change_dir>/specs.md` — this file doesn't exist; specs live at `openspec/specs/<name>/spec.md`.

## Goals / Non-Goals

**Goals:**
- Emit a fine-grained `artifact-changed` Tauri event carrying the absolute file path of the changed `.md` file.
- Register `watch_workspace` and `stop_watching` in the `invoke_handler`.
- Auto-reload artifact content in `ChangeDetail` when the active artifact's file changes.
- Auto-refresh the changes list (task counts, artifact statuses) when any change directory file is modified.
- Auto-reload spec tree and selected spec content in `SpecsExplorer` when specs change.
- Fix `scan_artifacts` to correctly detect the "specs" artifact by checking the `openspec/specs/` directory.

**Non-Goals:**
- Editing artifacts from within Specboard.
- Two-way sync / conflict resolution.
- Watching non-`.md` files.

## Decisions

### 1. Use `artifact-changed` event with file path payload (not just `workspace-changed`)

`workspace-changed` has no payload, so the frontend would have to reload *everything* on every keystroke in any file. Instead, emit `artifact-changed { path: String }` specifically for `.md` file changes. The frontend matches the path against the active artifact's stored path and reloads only if it matches. For changes-list refresh and tree refresh, subscribe to `workspace-changed` (already emitted on any change) — this is coarse but acceptable since the tree/list load is cheap.

Alternative considered: debounce `workspace-changed` and reload everything. Rejected: causes flickering of the current artifact content view.

### 2. Fix `scan_artifacts` for "specs" artifact

The "specs" artifact in OpenSpec does not produce `specs.md` at the change root; specs go into `openspec/specs/<name>/spec.md`. The `scan_artifacts` function should set the "specs" artifact as:
- **status**: `"ready"` if `openspec/specs/` directory is non-empty (contains at least one `.md` file)
- **path**: the `openspec/specs/` absolute directory path (so `readArtifact` on a directory falls back to `spec.md` or lists children — already handled in `read_artifact`)

Alternative: store a glob pattern. Rejected: `readArtifact` doesn't support globs.

### 3. Register watch commands in `invoke_handler`

`watch_workspace` and `stop_watching` are defined in `commands.rs` but missing from `lib.rs`'s `generate_handler!`. They must be added.

### 4. Frontend subscription pattern

`ChangeDetail` adds a `useTauriEvent("artifact-changed", ...)` listener. The callback checks if `payload.path` matches `activeArtifact.path` (case-insensitive on Windows). If yes, it calls `readArtifact` and updates `content`. Additionally listens to `workspace-changed` to trigger `loadChanges` (refreshes task counts).

`SpecsExplorer` listens to `workspace-changed` to re-fetch the tree. If `selectedFile` is still in the new tree, reload its content.

### 5. `refreshChanges` action in changes store

Add a lightweight `refreshChanges(workspacePath)` that calls `readWorkspace` and merges results without setting `isLoading: true` (avoids content flash).

## Risks / Trade-offs

- **High-frequency saves** (e.g. agent writing large files): The debounce in `notify` is 2s by default in the existing watcher setup. If not debounced, multiple rapid reloads may cause flickering. Mitigation: Check if existing watcher already debounces; if not, add a 300ms debounce in the Rust watcher callback.
- **Path comparison on Windows**: Paths from Rust use `\` separators; paths stored in artifacts may differ. Mitigation: Normalize both sides to lowercase before comparing.
- **`watch_workspace` / `stop_watching` not registered**: Currently these commands silently fail when called from the frontend. Fixing this is required for watch to work at all.
- **Specs artifact path**: Storing the `openspec/specs/` directory path means `readArtifact` on that path returns `spec.md` content only if a top-level `spec.md` exists. For directory listings, the user navigates `SpecsExplorer`. This is acceptable for now.

## Migration Plan

1. Add `watch_workspace` and `stop_watching` to `invoke_handler` in `lib.rs`.
2. Update `watch_workspace` in `commands.rs` to emit `artifact-changed` events with the file path for `.md` changes.
3. Fix `scan_artifacts` for the "specs" artifact.
4. Add `refreshChanges` to `changes.store.ts`.
5. Update `ChangeDetail.tsx` to subscribe to `artifact-changed` and `workspace-changed`.
6. Update `SpecsExplorer.tsx` to subscribe to `workspace-changed`.

No migration/rollback risk: all changes are additive to the existing watcher infrastructure.

## Open Questions

- Should task checkboxes in `TasksView` be clickable (write back to `tasks.md`)? Out of scope for this change but enabled naturally once live reload works.
