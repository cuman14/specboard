## ADDED Requirements

### Requirement: Workflow triggers on push to main
The system SHALL execute the semantic-release workflow on every push to the `main` branch.

#### Scenario: Push to main triggers workflow
- **WHEN** a commit is pushed to the `main` branch
- **THEN** the semantic-release workflow SHALL start within 60 seconds

### Requirement: Analyze conventional commits for version bump
The system SHALL analyze commit messages since the last tag to determine the next semantic version.

#### Scenario: feat commit triggers minor bump
- **GIVEN** the last tag was `v1.2.3`
- **WHEN** a `feat: add new feature` commit is pushed to main
- **THEN** the next version SHALL be `1.3.0` (minor bump)

#### Scenario: fix commit triggers patch bump
- **GIVEN** the last tag was `v1.2.3`
- **WHEN** a `fix: resolve bug` commit is pushed to main
- **THEN** the next version SHALL be `1.2.4` (patch bump)

#### Scenario: BREAKING CHANGE triggers major bump
- **GIVEN** the last tag was `v1.2.3`
- **WHEN** a commit with `BREAKING CHANGE:` footer or `feat!:` is pushed
- **THEN** the next version SHALL be `2.0.0` (major bump)

### Requirement: Update version in all required files
The system SHALL update the version number in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json` before creating the tag.

#### Scenario: All version files are synchronized
- **WHEN** semantic-release determines the next version
- **THEN** the version SHALL be updated in:
  - `package.json`
  - `src-tauri/Cargo.toml`
  - `src-tauri/tauri.conf.json`
- **AND** all files SHALL have the same version number

### Requirement: Create Git tag automatically
The system SHALL create a Git tag with the format `v{version}` when a version bump is detected.

#### Scenario: Tag created with correct format
- **GIVEN** the next version is determined to be `1.3.0`
- **WHEN** the prepare phase executes
- **THEN** a tag `v1.3.0` SHALL be created
- **AND** the tag SHALL point to the release commit

### Requirement: Push changes back to main
The system SHALL commit version changes and push them back to the `main` branch.

#### Scenario: Version bump commit pushed
- **WHEN** version files are updated
- **THEN** the changes SHALL be committed with message `chore(release): {version} [skip ci]`
- **AND** the commit SHALL be pushed to `main`

### Requirement: Prevent infinite release loops
The system SHALL skip the workflow when the commit message indicates it's an automated release commit.

#### Scenario: Skip workflow for release commits
- **GIVEN** the latest commit message contains `[skip ci]` or `chore(release)`
- **WHEN** the semantic-release workflow starts
- **THEN** the workflow SHALL exit immediately without creating a new release

### Requirement: Generate changelog automatically
The system SHALL generate or update CHANGELOG.md with release notes based on conventional commits.

#### Scenario: Changelog updated with new entry
- **WHEN** a new version is released
- **THEN** CHANGELOG.md SHALL be updated with:
  - Version number and date
  - Categorized changes (Features, Bug Fixes, Breaking Changes)
  - Links to commits and issues

### Requirement: Create GitHub Release with notes
The system SHALL create a GitHub Release with automatically generated release notes.

#### Scenario: GitHub Release created
- **WHEN** the tag is pushed
- **THEN** a GitHub Release SHALL be created
- **AND** the release notes SHALL summarize the changes in this version
