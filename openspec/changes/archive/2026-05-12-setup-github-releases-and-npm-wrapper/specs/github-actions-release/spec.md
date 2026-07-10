## ADDED Requirements

### Requirement: GitHub Actions workflow triggers on version tags
The system SHALL execute the release workflow when a Git tag matching `v*` is pushed to the repository.

#### Scenario: Tag push triggers workflow
- **WHEN** a developer executes `git tag v0.1.0 && git push --tags`
- **THEN** the GitHub Actions workflow SHALL start within 60 seconds

### Requirement: Matrix builds for all target platforms
The system SHALL execute parallel build jobs for `ubuntu-latest`, `windows-latest`, and `macos-latest` runners.

#### Scenario: All platform builds complete successfully
- **WHEN** the release workflow is triggered
- **THEN** three separate jobs SHALL run in parallel
- **AND** each job SHALL produce platform-specific artifacts

### Requirement: Linux artifacts include deb, rpm, and AppImage
The system SHALL generate `.deb`, `.rpm`, and `.AppImage` files from the Ubuntu runner build.

#### Scenario: Ubuntu build produces expected artifacts
- **WHEN** the ubuntu-latest job completes
- **THEN** the artifacts SHALL include `*.deb`, `*.rpm`, and `*.AppImage` files

### Requirement: Windows artifacts include msi and exe
The system SHALL generate `.msi` and `.exe` installer files from the Windows runner build.

#### Scenario: Windows build produces expected artifacts
- **WHEN** the windows-latest job completes
- **THEN** the artifacts SHALL include `*.msi` and `*.exe` files

### Requirement: macOS artifacts include dmg and app
The system SHALL generate `.dmg` and `.app` bundle from the macOS runner build.

#### Scenario: macOS build produces expected artifacts
- **WHEN** the macos-latest job completes
- **THEN** the artifacts SHALL include `*.dmg` and `*.app` files

### Requirement: Artifacts are uploaded to GitHub Releases
The system SHALL create a new GitHub Release (or update existing draft) with all build artifacts attached.

#### Scenario: Release is created with all artifacts
- **WHEN** all matrix jobs complete successfully
- **THEN** a GitHub Release with tag name matching the pushed tag SHALL exist
- **AND** the Release SHALL contain all platform artifacts as downloadable assets

### Requirement: Workflow uses tauri-apps/tauri-action
The system SHALL use the official `tauri-apps/tauri-action@v0` GitHub Action for builds.

#### Scenario: Official action is used
- **WHEN** inspecting the workflow file
- **THEN** the action `tauri-apps/tauri-action` SHALL be referenced

### Requirement: Workflow completes within 20 minutes
The system SHALL complete the full matrix build and release process within 20 minutes of trigger.

#### Scenario: Reasonable build time
- **WHEN** the workflow is triggered
- **THEN** the status SHALL be "completed" within 20 minutes
