## Context

Specboard currently renders an Archive button in `ChangeDetail.tsx` header that is always visible but non-functional (no `onClick` handler). The button must be wired to the `openspec archive --change <name>` CLI command via the existing `run_openspec_command` Tauri IPC, and must only be enabled when all tasks for the change are complete.

The `Change` type already tracks `tasksTotal` and `tasksCompleted`. The `ChangesDashboard` `ChangeRow` component has no archive affordance at all.

No dialog component currently exists in `src/components/ui/`.

## Goals / Non-Goals

**Goals:**
- Wire the existing Archive button in `ChangeDetail` to call `archiveChange` only when `tasksCompleted === tasksTotal && tasksTotal > 0`
- Show a confirmation dialog before executing the archive command
- Add an Archive button to `ChangeRow` in `ChangesDashboard` with the same condition
- After successful archiving, reload the changes list and navigate to `/changes`
- Add `archiveChange(name, workspacePath)` typed wrapper to `tauri-commands.ts`
- Add `archiveChange` action to `changes.store.ts`

**Non-Goals:**
- Adding a new Tauri/Rust IPC command (use existing `run_openspec_command`)
- Supporting undo/unarchive from the UI
- Archiving from the Kanban board (separate concern)

## Decisions

**Decision: Use AlertDialog (shadcn/ui) for confirmation**
AlertDialog is the correct Radix UI primitive for destructive confirmations — it is modal, accessible, and blocks background interaction. It must be added via shadcn CLI since it doesn't exist yet. Alternative considered: `window.confirm()` — rejected because it's not styleable and breaks Tauri's native WebView behaviour on some platforms.

**Decision: Button enabled state derived from props, not store**
The enable condition `tasksCompleted === tasksTotal && tasksTotal > 0` is computed locally from the `Change` object already in scope. No extra store selector is needed.

**Decision: Archive action in the store**
`archiveChange` is added to `useChangesStore` rather than called inline in components, for consistency with `loadChanges`. After the CLI call succeeds, it calls `loadChanges` to refresh the full list so counts and status are accurate.

**Decision: Stop FS watcher during archive, restart after**
Archiving moves the change folder; the watcher would fire a spurious `workspace-changed` event. The action calls `stopWatching` before the CLI call and `watchWorkspace` after, matching the existing pattern in `ChangesDashboard`.

## Risks / Trade-offs

- **CLI failure**: If `openspec archive` exits non-zero, the store action throws and the component shows an error toast/alert. No optimistic removal of the change from the list.
- **Race condition**: User could navigate away before the confirmation dialog closes; guarded by checking the component is still mounted before calling `navigate`.
- **No dialog on dashboard row**: The `ChangeRow` archive button opens the same `AlertDialog`. Because `ChangeRow` is a pure presentational component, the archive logic and dialog must be lifted into the parent `ChangesDashboard` (using a `pendingArchive` state).
