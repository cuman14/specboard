## ADDED Requirements

### Requirement: Validate button triggers openspec validate
The ChangeDetail page SHALL run `openspec validate <change-name> --json` when the user clicks the Validate button. The command SHALL execute in the workspace root directory.

#### Scenario: User clicks Validate button
- **WHEN** the user clicks the Validate button in ChangeDetail
- **THEN** the system runs `openspec validate <change-name> --json` via IPC

#### Scenario: Button shows loading state during validation
- **WHEN** validation is in progress
- **THEN** the Validate button shows a spinner and is disabled

### Requirement: Validation results render as inline banner
The system SHALL display validation results as an inline banner below the header and above the artifact tabs. The banner SHALL show the overall status (valid/invalid), warning count, error count, and expandable details for each check.

#### Scenario: Valid change with no issues
- **WHEN** validation returns `valid: true` with no warnings
- **THEN** the banner shows a green checkmark and "All checks passed"

#### Scenario: Valid change with warnings
- **WHEN** validation returns `valid: true` with warnings
- **THEN** the banner shows a yellow warning icon, the warning count, and expandable warning details

#### Scenario: Invalid change with errors
- **WHEN** validation returns `valid: false`
- **THEN** the banner shows a red error icon, the error count, and expandable error details

#### Scenario: User dismisses the banner
- **WHEN** the user clicks the close button on the banner
- **THEN** the banner is removed from view

### Requirement: Validation errors are handled gracefully
The system SHALL handle command failures, JSON parse errors, and non-zero exit codes without crashing. The banner SHALL display the error message from stderr when available.

#### Scenario: openspec command fails
- **WHEN** `run_openspec_command` returns a non-zero exit code
- **THEN** the banner shows the stderr output as an error message

#### Scenario: JSON output cannot be parsed
- **WHEN** stdout is not valid JSON
- **THEN** the banner shows the raw stdout as a fallback

### Requirement: Mock validation in web mode
When running outside Tauri, the Validate button SHALL simulate a validation result after a 500ms delay to allow UI testing.

#### Scenario: Web mode validation
- **WHEN** the user clicks Validate in web mode (non-Tauri)
- **THEN** after 500ms a mock validation result is displayed
