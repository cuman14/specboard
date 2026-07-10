# Features

## Purpose
Defines dashboard-level features for the change management UI, including row-level actions and their behavior.
## Requirements
### Requirement: Change row shows archive button when all tasks done
The dashboard change list row (`ChangeRow`) SHALL render an Archive button that is only visible and interactive when `tasksCompleted === tasksTotal` and `tasksTotal > 0` for that change.

#### Scenario: Completed change row shows archive button
- **WHEN** a `ChangeRow` is rendered for a change where all tasks are complete
- **THEN** an Archive button is visible in the row's action area

#### Scenario: Incomplete change row hides archive button
- **WHEN** a `ChangeRow` is rendered for a change where tasks are not fully complete
- **THEN** no Archive button is rendered in that row

#### Scenario: Row archive button triggers confirmation
- **WHEN** the user clicks the Archive button on a change row
- **THEN** a confirmation dialog is presented before any CLI command is executed

### Requirement: Change row displays creation date and time
The `ChangeRow` SHALL display both the relative time (e.g., "2 days ago") and the exact creation date/time in ISO format (e.g., "2026-05-20T07:31:53.452Z") for each change. The relative time SHALL be displayed in a larger font above the exact timestamp. The exact timestamp SHALL use a monospace font and a more muted color.

#### Scenario: Active change shows timestamps
- **WHEN** a `ChangeRow` is rendered for an active change
- **THEN** both relative time and exact ISO timestamp are visible in the row's metadata area

#### Scenario: Archived change shows timestamps
- **WHEN** a `ChangeRow` is rendered for an archived change
- **THEN** both relative time and exact ISO timestamp are visible with reduced opacity matching the archived state

### Requirement: Archived changes tab in filter bar
The dashboard SHALL include an "Archived" tab in the filter bar alongside "All" and "Active". When selected, it SHALL display only changes with `status === "archived"`.

#### Scenario: User selects archived tab
- **WHEN** the user clicks the "Archived" filter tab
- **THEN** only archived changes are displayed in the list

#### Scenario: Archived changes count in stats
- **WHEN** the dashboard loads
- **THEN** the "Archived" stat card shows the exact count of archived changes from the workspace

### Requirement: Archived changes visual differentiation
Archived changes in the list SHALL be visually distinct from active changes. The row SHALL have reduced opacity (70%), a semi-transparent background, muted text color, and a checkmark prefix on the status badge (`✓ archived`). The navigation arrow SHALL also be muted. On hover, opacity SHALL return to 100%.

#### Scenario: Archived change row appearance
- **WHEN** an archived change is rendered in the list
- **THEN** the row has reduced opacity, muted text, and a `✓ archived` badge

#### Scenario: Hover restores visibility
- **WHEN** the user hovers over an archived change row
- **THEN** opacity returns to 100% and the row becomes fully readable

### Requirement: Navigation to archived change detail
Users SHALL be able to navigate to the detail view of an archived change by clicking its row. The `ChangeDetail` component SHALL load the change from either the active or archived changes list.

#### Scenario: Click archived change row
- **WHEN** the user clicks on an archived change row
- **THEN** the app navigates to `/changes/<change-id>` and displays the change detail

#### Scenario: Archived change detail loads correctly
- **WHEN** the `ChangeDetail` component mounts with an archived change ID
- **THEN** the change is found in the combined active + archived list and displayed

### Requirement: Change detail shows status badge and timestamps
The `ChangeDetail` metadata bar SHALL display a status badge (colored according to status: active=indigo, archived=muted), the schema name, the creation date/time, and the last modified date/time of the active artifact. Dates SHALL be formatted as "Mon DD, YYYY, HH:MM AM/PM" in a monospace font.

#### Scenario: Active change detail shows metadata
- **WHEN** viewing an active change detail
- **THEN** the metadata bar shows a colored status badge, schema, created date/time, and last modified date/time

#### Scenario: Archived change detail shows metadata
- **WHEN** viewing an archived change detail
- **THEN** the metadata bar shows a muted status badge with `✓ archived` prefix, schema, created date/time, and last modified date/time

