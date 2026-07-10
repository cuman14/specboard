## ADDED Requirements

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
