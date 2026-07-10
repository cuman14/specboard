## Why

When OpenSpec artifact files (proposal.md, design.md, specs.md, tasks.md) or spec files are edited externally (by the AI agent or manually), the Specboard UI shows stale content and stale artifact statuses until the user manually restarts or navigates away. Additionally, `scan_artifacts` uses a fixed `.md` suffix path, which doesn't match the `specs/**/*.md` pattern—so "specs" artifacts always show as "missing" even when spec files exist in the `openspec/specs/` tree.

## What Changes

- **Real-time artifact content reload**: When any `.md` file inside `openspec/changes/<change>/` changes on disk, the currently-open artifact tab must reload its content automatically without user interaction.
- **Real-time specs tree reload**: When any `.md` file inside `openspec/specs/` changes, the `SpecsExplorer` file tree and currently-selected file content must refresh automatically.
- **Real-time changes list refresh**: When any file inside `openspec/changes/` changes (new artifact created, task checked), the changes store must reload so task counts and artifact statuses stay current.
- **Task strikethrough display**: Tasks parsed from `tasks.md` already render with `line-through` but the file is never reloaded live—fixing real-time reload surfaces this correctly.
- **Artifact path fix for "specs"**: `scan_artifacts` checks for `specs.md` at the change root, but the actual spec lives at `openspec/specs/<name>/spec.md`. The artifact path stored must reflect a real file so `readArtifact` doesn't show "missing". The status logic must also be updated.

## Capabilities

### New Capabilities

- `realtime-md-watch`: Auto-reload MD content and refresh stores when files change on disk via the existing `watch_workspace` / `workspace-changed` Tauri event pipeline, plus a new granular `artifact-changed` event that carries the changed file path.

### Modified Capabilities

- `validate-command-ui`: No spec-level change; implementation only.
- `features/dashboard`: Task count and artifact status on the dashboard must reflect live state once the changes store auto-refreshes.

## Impact

- `src-tauri/src/commands.rs`: Emit `artifact-changed` event with file path from the existing watcher; fix `scan_artifacts` to correctly detect the "specs" artifact.
- `src-tauri/src/lib.rs`: Register watcher commands properly (already registered; ensure event is emitted).
- `src/pages/ChangeDetail.tsx`: Listen to `artifact-changed` event; if the changed file matches the active artifact path, reload content. Also reload changes store.
- `src/pages/SpecsExplorer.tsx`: Listen to `workspace-changed` or `artifact-changed` to re-fetch tree and reload selected file content.
- `src/store/changes.store.ts`: Expose a `refreshChanges` action that re-runs `readWorkspace` without wiping UI state.
- `src/hooks/useTauriEvent.ts`: Already exists and works; no changes needed.
