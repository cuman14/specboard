## MODIFIED Requirements

### Requirement: GitHub Actions workflow triggers on version tags
The system SHALL execute the release workflow when a Git tag matching `v*` is pushed to the repository, whether created manually or automatically by semantic-release.

#### Scenario: Manual tag push triggers workflow
- **WHEN** a developer executes `git tag v0.1.0 && git push --tags`
- **THEN** the GitHub Actions workflow SHALL start within 60 seconds

#### Scenario: Auto-generated tag triggers workflow
- **WHEN** semantic-release creates and pushes tag `v1.3.0`
- **THEN** the GitHub Actions workflow SHALL start within 60 seconds

### Requirement: Workflow handles both manual and automated releases
The system SHALL support release triggers from both manual tag creation and semantic-release automation without configuration changes.

#### Scenario: No distinction between tag sources
- **GIVEN** a tag `v1.4.0` exists
- **WHEN** checking the release workflow logs
- **THEN** the workflow SHALL execute identically regardless of whether the tag was manual or automated

## ADDED Requirements

### Requirement: Workflow triggered by semantic-release workflow completion
The system SHALL trigger the release workflow when the semantic-release workflow completes successfully.

#### Scenario: Chain of workflows
- **WHEN** semantic-release workflow creates a new tag and pushes it
- **THEN** the tag push SHALL trigger the release workflow
- **AND** the release workflow SHALL build and publish the new version

### Requirement: Version synchronization before build
The system SHALL ensure all version files are synchronized before starting the Tauri build.

#### Scenario: Consistent versions across files
- **GIVEN** semantic-release updated package.json to version 1.5.0
- **WHEN** the release workflow starts
- **THEN** Cargo.toml and tauri.conf.json SHALL also contain version 1.5.0
- **AND** the built application SHALL report version 1.5.0
