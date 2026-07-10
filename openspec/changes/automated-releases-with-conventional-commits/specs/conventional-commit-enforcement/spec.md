## ADDED Requirements

### Requirement: Validate commit message format on PRs
The system SHALL validate that all commits in a pull request follow the conventional commit format.

#### Scenario: Valid conventional commits pass
- **GIVEN** a PR with commits:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update readme`
- **WHEN** the commitlint workflow runs
- **THEN** the check SHALL pass

#### Scenario: Invalid commit message fails
- **GIVEN** a PR with a commit `added new stuff`
- **WHEN** the commitlint workflow runs
- **THEN** the check SHALL fail
- **AND** an error message SHALL explain the expected format

### Requirement: Validate commit message format on main
The system SHALL validate commit messages on pushes to the `main` branch.

#### Scenario: Direct push to main validated
- **WHEN** a commit is pushed directly to `main`
- **THEN** the commitlint workflow SHALL validate the message
- **AND** if invalid, the workflow SHALL fail (but not block the push)

### Requirement: Support standard conventional commit types
The system SHALL accept these commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`.

#### Scenario: All standard types accepted
- **GIVEN** commits with various types:
  - `feat: new feature`
  - `fix: bug fix`
  - `docs: documentation`
  - `refactor: code refactoring`
  - `test: add tests`
  - `chore: maintenance`
- **WHEN** commitlint validates them
- **THEN** all SHALL pass

### Requirement: Require type and description
The system SHALL reject commits that don't have both a type prefix and a description.

#### Scenario: Missing type rejected
- **GIVEN** a commit message `update files`
- **WHEN** commitlint validates it
- **THEN** the check SHALL fail with "type may not be empty"

#### Scenario: Missing description rejected
- **GIVEN** a commit message `feat:`
- **WHEN** commitlint validates it
- **THEN** the check SHALL fail with "subject may not be empty"

### Requirement: Allow breaking change indicators
The system SHALL recognize `!` after type or `BREAKING CHANGE:` footer as breaking changes.

#### Scenario: Breaking change with exclamation mark
- **GIVEN** a commit `feat!: breaking API change`
- **WHEN** commitlint validates it
- **THEN** the check SHALL pass
- **AND** it SHALL be recognized as a breaking change

#### Scenario: Breaking change with footer
- **GIVEN** a commit with body:
  ```
  feat: new feature
  
  BREAKING CHANGE: removes old API
  ```
- **WHEN** commitlint validates it
- **THEN** the check SHALL pass
- **AND** it SHALL be recognized as a breaking change

### Requirement: Provide clear error messages
The system SHALL provide helpful error messages when commit validation fails.

#### Scenario: Clear error on failure
- **GIVEN** an invalid commit message
- **WHEN** the commitlint check fails
- **THEN** the error message SHALL include:
  - The invalid commit message
  - The specific rule that failed
  - A link to conventional commit documentation

### Requirement: Allow specific scopes
The system SHALL support these optional scopes: `ui`, `core`, `ci`, `docs`, `api`, `store`, `tauri`.

#### Scenario: Scoped commits accepted
- **GIVEN** commits:
  - `feat(ui): add button component`
  - `fix(core): resolve state bug`
  - `docs(api): update endpoints`
- **WHEN** commitlint validates them
- **THEN** all SHALL pass
