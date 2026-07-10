## ADDED Requirements

### Requirement: Archive button is enabled only when all tasks are complete
The system SHALL render an "Archive" button for a change that is enabled (interactive) only when `tasksCompleted === tasksTotal` and `tasksTotal > 0`. When the condition is not met, the button SHALL be visually disabled and non-interactive.

#### Scenario: All tasks complete — button enabled
- **WHEN** a change has `tasksTotal > 0` and `tasksCompleted === tasksTotal`
- **THEN** the Archive button is rendered in an enabled state

#### Scenario: Tasks incomplete — button disabled
- **WHEN** a change has `tasksCompleted < tasksTotal`
- **THEN** the Archive button is rendered in a disabled state

#### Scenario: No tasks defined — button disabled
- **WHEN** a change has `tasksTotal === 0`
- **THEN** the Archive button is rendered in a disabled state

### Requirement: Archive action requires confirmation
The system SHALL display a confirmation dialog before executing the archive command. The dialog SHALL describe the irreversible nature of archiving and present "Confirm" and "Cancel" actions.

#### Scenario: User confirms archive
- **WHEN** the user clicks the enabled Archive button and confirms in the dialog
- **THEN** the system executes `openspec archive --change <name>` via `run_openspec_command`

#### Scenario: User cancels archive
- **WHEN** the user clicks the enabled Archive button and cancels in the dialog
- **THEN** no command is executed and the change remains in its current state

### Requirement: Successful archive refreshes state and navigates away
After a successful archive command (exit code 0), the system SHALL reload the changes list and navigate the user to the `/changes` route.

#### Scenario: Archive succeeds
- **WHEN** `openspec archive --change <name>` exits with code 0
- **THEN** `loadChanges` is called to refresh the store and the user is navigated to `/changes`

### Requirement: Archive failure shows error feedback
When the archive command exits with a non-zero code or throws, the system SHALL display an error message to the user without navigating away.

#### Scenario: Archive command fails
- **WHEN** `openspec archive --change <name>` exits with a non-zero code
- **THEN** an error message is shown in the UI and the change remains in its current state
