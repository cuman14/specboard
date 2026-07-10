## MODIFIED Requirements

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

#### Scenario: TasksView reflects externally-modified tasks.md within 2 seconds
- **WHEN** an external agent or editor modifies `tasks.md` while the user is on the tasks tab
- **THEN** `TasksView` re-renders with the updated `[x]`/`[ ]` states within 2 seconds, without any user interaction
