## ADDED Requirements

### Requirement: Tauri watcher emits artifact-changed event with file path
The Rust watcher SHALL emit an `artifact-changed` Tauri event with a JSON payload `{ "path": "<absolute_path>" }` whenever a `.md` file inside `openspec/` is created or modified.

#### Scenario: MD file saved inside change directory
- **WHEN** a `.md` file inside `openspec/changes/<change>/` is written to disk
- **THEN** the Tauri backend emits `artifact-changed` with the absolute path of that file within 2 seconds

#### Scenario: Non-MD file changes are ignored
- **WHEN** a non-`.md` file changes inside the workspace
- **THEN** no `artifact-changed` event is emitted

### Requirement: watch_workspace and stop_watching commands are registered
The Tauri `invoke_handler` SHALL include `watch_workspace` and `stop_watching` so the frontend can call them via `invoke()`.

#### Scenario: Frontend calls watch_workspace
- **WHEN** the frontend invokes `watch_workspace` with a valid workspace path
- **THEN** the command succeeds and the watcher is started

#### Scenario: Frontend calls stop_watching
- **WHEN** the frontend invokes `stop_watching`
- **THEN** the watcher is stopped and no further events are emitted

### Requirement: ChangeDetail auto-reloads artifact content on file change
The `ChangeDetail` page SHALL reload the currently-displayed artifact content without user interaction when the corresponding `.md` file changes on disk.

#### Scenario: Active artifact file is modified
- **WHEN** the user is viewing artifact tab "tasks" and `tasks.md` is modified on disk
- **THEN** the content area reloads within 2 seconds showing the updated content, with tasks checked/unchecked matching the new file state

#### Scenario: Non-active artifact file is modified
- **WHEN** the user is viewing tab "proposal" and `tasks.md` is modified on disk
- **THEN** the proposal content is NOT reloaded (only the changed file's tab triggers reload when it becomes active or if it is the active tab)

#### Scenario: Changes store refreshes on any workspace-changed event
- **WHEN** any file inside the workspace changes
- **THEN** the changes store reloads change list so task counts and artifact statuses are current

### Requirement: SpecsExplorer auto-reloads on workspace change
The `SpecsExplorer` page SHALL re-fetch the spec file tree and reload the currently-selected spec file's content when the workspace changes on disk.

#### Scenario: Spec file is modified
- **WHEN** a `.md` file inside `openspec/specs/` is modified on disk
- **THEN** the spec tree refreshes and the selected file's content reloads within 2 seconds

#### Scenario: No file selected
- **WHEN** the workspace changes and no spec file is selected
- **THEN** only the tree is refreshed; no content reload is attempted

### Requirement: scan_artifacts correctly detects specs artifact
The `scan_artifacts` Rust function SHALL determine the "specs" artifact status based on whether the `openspec/specs/` directory contains at least one `.md` file (recursively), rather than checking for a `specs.md` file at the change root.

#### Scenario: Spec files exist in openspec/specs/
- **WHEN** `openspec/specs/` contains one or more `.md` files
- **THEN** the "specs" artifact has `status: "ready"` and `path` pointing to the `openspec/specs/` directory

#### Scenario: No spec files exist
- **WHEN** `openspec/specs/` is empty or does not exist
- **THEN** the "specs" artifact has `status: "missing"`
