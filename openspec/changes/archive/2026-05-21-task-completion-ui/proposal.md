## Why

The `TasksView` component displays tasks parsed from `tasks.md` but is read-only: clicking the completion icon does nothing, and the UI doesn't react when the file changes externally (e.g., an agent marks a task done). This breaks the core SDD workflow where AI agents and humans collaborate on tasks.

## What Changes

- Add click-to-toggle behavior on each task row in `TasksView` — clicking the icon or the row rewrites the task's `[x]`/`[ ]` state in `tasks.md` on disk via a new `write_artifact` Tauri command.
- Wire up real-time reactivity so that when `tasks.md` is rewritten (by the UI or externally), the rendered task list updates immediately without a full page reload.
- Progress bar and layer counters update in sync with task state changes.

## Capabilities

### New Capabilities

- `task-completion-toggle`: User can click a task's completion icon in `TasksView` to toggle its `[x]`/`[ ]` state, which is persisted to the `.md` file on disk via `write_artifact` Tauri IPC command.

### Modified Capabilities

- `realtime-md-watch`: The existing real-time watcher already emits `artifact-changed` events. `TasksView` must subscribe to these events and re-parse the file when the active `tasks.md` changes — currently it only reads the file once on mount.

## Impact

- **`src-tauri/src/commands.rs`**: New `write_artifact` command that accepts `path: String` + `content: String` and atomically writes the file.
- **`src/lib/tauri-commands.ts`**: New `writeArtifact(path, content)` typed wrapper.
- **`src/components/changes/TasksView.tsx`**: Add `onToggle` callback prop + click handler; optionally accept a `filePath` prop to perform the write directly.
- **`src/pages/ChangeDetail.tsx`** (or wherever `TasksView` is rendered): Pass file path and handle toggling + real-time refresh.
