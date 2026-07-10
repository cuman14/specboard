# task-completion-toggle Specification

## Purpose
TBD - created by archiving change task-completion-ui. Update Purpose after archive.
## Requirements
### Requirement: write_artifact Tauri command persists file content
The Tauri backend SHALL expose a `write_artifact` command that accepts `path: String` and `content: String` and writes the content to the file at `path`, creating parent directories if needed.

#### Scenario: Write succeeds for existing file
- **WHEN** the frontend invokes `write_artifact` with a valid path and new content
- **THEN** the file at that path contains the new content and the command returns `Ok(())`

#### Scenario: Write creates file if it does not exist
- **WHEN** the frontend invokes `write_artifact` with a path to a non-existent file whose parent directory exists
- **THEN** the file is created with the given content and the command returns `Ok(())`

#### Scenario: Write fails on permission error
- **WHEN** the frontend invokes `write_artifact` with a path the process cannot write to
- **THEN** the command returns an `Err` with a descriptive message

---

### Requirement: TasksView toggles task completion on click
The `TasksView` component SHALL toggle a task's `[x]`/`[ ]` state in the markdown source and persist the change to disk when the user clicks the task row or its completion icon.

#### Scenario: User clicks an incomplete task
- **WHEN** a task row with `[ ]` is clicked
- **THEN** the task's checkbox becomes `[x]` in the UI immediately and `tasks.md` on disk is updated with `[x]` on the corresponding line within 500 ms

#### Scenario: User clicks a completed task
- **WHEN** a task row with `[x]` is clicked
- **THEN** the task's checkbox becomes `[ ]` in the UI immediately and `tasks.md` on disk is updated with `[ ]` on the corresponding line within 500 ms

#### Scenario: Toggle when Tauri is not available
- **WHEN** the component is rendered outside the Tauri shell (browser dev mode) and a task is clicked
- **THEN** the toggle is a no-op (no error is thrown, UI does not crash)

#### Scenario: Toggle updates progress bar immediately
- **WHEN** a task is toggled
- **THEN** the progress bar percentage and `X / Y tasks completed` counter update in the same render frame as the optimistic UI update

