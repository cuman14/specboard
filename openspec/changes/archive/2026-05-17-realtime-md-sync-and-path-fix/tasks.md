## 1. Rust Backend — Watcher & Events

- [ ] 1.1 Add `watch_workspace` and `stop_watching` to `invoke_handler` in `src-tauri/src/lib.rs`
- [ ] 1.2 Update `watch_workspace` in `commands.rs` to emit `artifact-changed` event with `{ path }` payload for every `.md` file create/modify event (skip non-md files)
- [ ] 1.3 Fix `scan_artifacts` to detect "specs" artifact by checking if `openspec/specs/` directory contains any `.md` file (recursive), and set its path to the `openspec/specs/` absolute directory

## 2. Frontend State — Changes Store

- [ ] 2.1 Add `refreshChanges(workspacePath: string)` action to `changes.store.ts` that calls `readWorkspace` and updates `changes` without setting `isLoading: true`

## 3. Frontend — ChangeDetail Live Reload

- [ ] 3.1 In `ChangeDetail.tsx`, subscribe to `artifact-changed` via `useTauriEvent`; compare `payload.path` (case-insensitive) with `activeArtifact.path` and reload content if they match
- [ ] 3.2 In `ChangeDetail.tsx`, subscribe to `workspace-changed` via `useTauriEvent` and call `refreshChanges` to keep task counts and artifact statuses current

## 4. Frontend — SpecsExplorer Live Reload

- [ ] 4.1 In `SpecsExplorer.tsx`, subscribe to `workspace-changed` via `useTauriEvent`; on event, re-fetch the spec tree with `readSpecsTree`
- [ ] 4.2 In `SpecsExplorer.tsx`, after tree re-fetch, if `selectedFile` is still present in the new tree, reload its content with `readArtifact`

## 5. Verification

- [ ] 5.1 Confirm that editing `tasks.md` externally causes the Tasks tab in `ChangeDetail` to show updated checked/unchecked state within 2 seconds
- [ ] 5.2 Confirm that a newly created spec file appears in `SpecsExplorer` tree without page refresh
- [ ] 5.3 Confirm that "specs" artifact no longer shows "missing" when `openspec/specs/` contains `.md` files
- [ ] 5.4 Confirm that task completion count in the changes dashboard updates when `tasks.md` is modified
