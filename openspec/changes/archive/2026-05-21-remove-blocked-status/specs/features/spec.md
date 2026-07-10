## MODIFIED Requirements

### Requirement: Archived changes tab in filter bar
The dashboard SHALL include an "Archived" tab in the filter bar alongside "All" and "Active". When selected, it SHALL display only changes with `status === "archived"`.

#### Scenario: User selects archived tab
- **WHEN** the user clicks the "Archived" filter tab
- **THEN** only archived changes are displayed in the list

#### Scenario: Archived changes count in stats
- **WHEN** the dashboard loads
- **THEN** the "Archived" stat card shows the exact count of archived changes from the workspace

### Requirement: Change detail shows status badge and timestamps
The `ChangeDetail` metadata bar SHALL display a status badge (colored according to status: active=indigo, archived=muted), the schema name, the creation date/time, and the last modified date/time of the active artifact. Dates SHALL be formatted as "Mon DD, YYYY, HH:MM AM/PM" in a monospace font.

#### Scenario: Active change detail shows metadata
- **WHEN** viewing an active change detail
- **THEN** the metadata bar shows a colored status badge, schema, created date/time, and last modified date/time

#### Scenario: Archived change detail shows metadata
- **WHEN** viewing an archived change detail
- **THEN** the metadata bar shows a muted status badge with `✓ archived` prefix, schema, created date/time, and last modified date/time
