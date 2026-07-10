## Context

`TasksView` (`src/components/changes/TasksView.tsx`) parses `tasks.md` markdown into a structured list and renders it. Currently the component is purely display-only: clicking a task row has no effect, and the component re-renders only when its parent passes new `content` prop. The Tauri FS watcher already emits `artifact-changed` events when `.md` files change, and `ChangeDetail` (the parent) already handles this event to reload the active artifact — so reactive refresh is largely already plumbed.

The missing pieces are:
1. A Rust `write_artifact` command to persist task toggle changes to disk.
2. Wiring the click handler in `TasksView` to produce a new markdown string and call `write_artifact`.

## Goals / Non-Goals

**Goals:**
- Clicking a task row toggles its `[x]`/`[ ]` state and writes the result to `tasks.md` on disk.
- When `tasks.md` changes on disk (by the UI or externally), `TasksView` re-renders with the updated state within 2 seconds.
- Progress bar and layer counters update in sync.

**Non-Goals:**
- Editing task text content inline.
- Reordering tasks.
- Undo/redo history.
- Any change to artifacts other than `tasks.md`.

## Decisions

### D1: Write by modifying the original markdown string (not serialising from parsed state)

**Decision**: `toggleTask` produces a new markdown string by replacing the exact line containing the task rather than serialising from the parsed `Layer[]` structure.

**Rationale**: Reconstructing markdown from parsed state would discard comments, blank lines, and formatting nuances. A targeted line-level replacement (`[ ]` ↔ `[x]`) preserves the file exactly.

**Alternative considered**: Store full parsed state and re-emit markdown. Rejected — lossy and fragile.

---

### D2: `write_artifact` as a new Tauri command (not via `run_openspec_command`)

**Decision**: Add `#[tauri::command] async fn write_artifact(path, content)` to `commands.rs`.

**Rationale**: Writing a file is a simple atomic FS operation; routing it through the openspec CLI subprocess would add latency and unnecessary process overhead. Direct Rust FS write is faster and simpler.

**Alternative considered**: Use `run_openspec_command` with a custom sub-command. Rejected — openspec CLI doesn't expose a write command, and spawning a process for a file write is wasteful.

---

### D3: Pass `filePath` prop to `TasksView`; component calls `writeArtifact` directly

**Decision**: `TasksView` receives an optional `filePath?: string`. When set, clicking a task calls `writeArtifact(filePath, newContent)` internally. When absent, falls back to `onToggle` callback prop (for testing / non-Tauri use).

**Rationale**: Keeps the toggle logic co-located with the parsing/rendering logic. Avoids lifting the markdown string manipulation up to `ChangeDetail`, which doesn't need to know the internal markdown format.

---

### D4: Optimistic UI update

**Decision**: After a click, immediately update the local `content` state (derived from the prop) so the UI responds at 0 ms. The FS watcher will emit `artifact-changed` within ~1 s and re-read the file, which may re-render but with the same content.

**Rationale**: Without optimistic update, the user experiences 1–2 s lag before the toggle visually changes. The optimistic state is discarded once the file read confirms the on-disk state.

## Risks / Trade-offs

- **Concurrent writes**: If an agent writes `tasks.md` at the same moment as the user clicks, the last writer wins. This is acceptable for the current workflow. → No mitigation needed now.
- **Regex line matching**: The replacement uses a regex on the exact line; malformed markdown (e.g., no newline at EOF) could miss the target. → Covered by test cases.
- **Tauri not available (browser dev mode)**: `writeArtifact` throws when Tauri is unavailable; the component must not crash — it should silently no-op. → Catch the error in the click handler.

## Migration Plan

1. Add `write_artifact` command to `commands.rs` and register it in `lib.rs`.
2. Add `writeArtifact` typed wrapper to `tauri-commands.ts`.
3. Update `TasksView` to accept `filePath` prop and toggle handler.
4. Update call sites (`ChangeDetail`) to pass `filePath` from the artifact's `path` field.
5. Confirm real-time refresh already works via existing `artifact-changed` → `readArtifact` path in `ChangeDetail`.

## Open Questions

- None — all decisions are resolved above.
