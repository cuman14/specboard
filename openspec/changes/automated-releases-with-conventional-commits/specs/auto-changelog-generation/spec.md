## ADDED Requirements

### Requirement: Generate changelog on each release
The system SHALL generate or update the CHANGELOG.md file on every automated release.

#### Scenario: Changelog created on first release
- **GIVEN** no CHANGELOG.md exists
- **WHEN** the first automated release occurs
- **THEN** CHANGELOG.md SHALL be created with the initial release entry

#### Scenario: Changelog updated on subsequent releases
- **GIVEN** CHANGELOG.md exists with previous entries
- **WHEN** a new release occurs
- **THEN** the new entry SHALL be prepended to the top of the file

### Requirement: Follow Keep a Changelog format
The system SHALL generate changelog entries following the Keep a Changelog format.

#### Scenario: Proper format with sections
- **WHEN** a release entry is generated
- **THEN** it SHALL include:
  - Version header with date (e.g., `## [1.2.3] - 2024-01-15`)
  - "Added" section for new features
  - "Changed" section for modifications
  - "Fixed" section for bug fixes
  - "Removed" section for deprecations
  - "Security" section for security fixes (if applicable)

### Requirement: Categorize changes by type
The system SHALL categorize changes based on conventional commit types.

#### Scenario: feat commits go to Added
- **GIVEN** a release with commits:
  - `feat: add kanban board`
  - `feat: implement drag and drop`
- **WHEN** the changelog is generated
- **THEN** these SHALL appear under "Added" section

#### Scenario: fix commits go to Fixed
- **GIVEN** a release with commits:
  - `fix: resolve memory leak`
  - `fix: correct button alignment`
- **WHEN** the changelog is generated
- **THEN** these SHALL appear under "Fixed" section

#### Scenario: BREAKING CHANGE commits go to Changed
- **GIVEN** a release with commits:
  - `feat!: change API response format`
  - `fix!: remove deprecated method`
- **WHEN** the changelog is generated
- **THEN** these SHALL appear under "Changed" section
- **AND** they SHALL be marked as breaking changes

### Requirement: Include commit links
The system SHALL include links to individual commits in the changelog.

#### Scenario: Commit hashes linked
- **WHEN** viewing a changelog entry
- **THEN** each change SHALL include a link to its commit
- **AND** clicking the link SHALL navigate to GitHub commit view

### Requirement: Compare links between versions
The system SHALL include a compare link between versions at the bottom of CHANGELOG.md.

#### Scenario: Version comparison available
- **GIVEN** versions 1.2.3 and 1.2.4 exist
- **WHEN** viewing the changelog
- **THEN** a link SHALL exist to compare changes between these versions
- **AND** the link SHALL follow the pattern: `https://github.com/{owner}/{repo}/compare/v{old}...v{new}`

### Requirement: Handle empty sections gracefully
The system SHALL omit sections that have no entries rather than showing empty headers.

#### Scenario: No security fixes
- **GIVEN** a release with no security-related commits
- **WHEN** the changelog is generated
- **THEN** the "Security" section SHALL not appear

### Requirement: Preserve manual changelog entries
The system SHALL not overwrite manually added entries in CHANGELOG.md.

#### Scenario: Manual entry preserved
- **GIVEN** a manually added security advisory in CHANGELOG.md
- **WHEN** a new automated release occurs
- **THEN** the manual entry SHALL remain in place
- **AND** the automated entry SHALL be prepended above it
