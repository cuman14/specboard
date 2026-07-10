## ADDED Requirements

### Requirement: npm package provides specboard CLI command
The system SHALL install a `specboard` executable to the user's PATH when the npm package is installed globally.

#### Scenario: Global install adds command to PATH
- **WHEN** a user executes `npm install -g specboard`
- **THEN** the `specboard` command SHALL be available in the shell

### Requirement: postinstall detects host OS and architecture
The system SHALL detect the host operating system and CPU architecture during the npm postinstall phase.

#### Scenario: Correct platform detection on Linux x64
- **GIVEN** the host is running Linux on x64 architecture
- **WHEN** the postinstall script executes
- **THEN** the system SHALL identify platform as `linux-x64`

#### Scenario: Correct platform detection on macOS ARM64
- **GIVEN** the host is macOS on Apple Silicon (ARM64)
- **WHEN** the postinstall script executes
- **THEN** the system SHALL identify platform as `darwin-arm64`

#### Scenario: Correct platform detection on Windows x64
- **GIVEN** the host is running Windows on x64 architecture
- **WHEN** the postinstall script executes
- **THEN** the system SHALL identify platform as `windows-x64`

### Requirement: postinstall downloads correct binary from GitHub Release
The system SHALL download the platform-appropriate binary from the corresponding GitHub Release.

#### Scenario: Download Linux binary
- **GIVEN** the detected platform is `linux-x64`
- **WHEN** the postinstall script executes
- **THEN** the system SHALL download the `.AppImage` asset from the matching GitHub Release version
- **AND** the downloaded file SHALL be saved to a local cache directory

#### Scenario: Download macOS binary
- **GIVEN** the detected platform is `darwin-arm64`
- **WHEN** the postinstall script executes
- **THEN** the system SHALL download the `.dmg` or `.app` asset from the matching GitHub Release version

#### Scenario: Download Windows binary
- **GIVEN** the detected platform is `windows-x64`
- **WHEN** the postinstall script executes
- **THEN** the system SHALL download the `.msi` or `.exe` asset from the matching GitHub Release version

### Requirement: CLI wrapper delegates to native binary
The system SHALL spawn the downloaded native binary when the `specboard` CLI command is invoked.

#### Scenario: Running specboard launches the application
- **GIVEN** the npm package is installed and postinstall completed successfully
- **WHEN** a user executes `specboard` in the terminal
- **THEN** the native Tauri application SHALL launch

### Requirement: Unsupported platforms fail gracefully
The system SHALL display a helpful error message when installed on an unsupported platform.

#### Scenario: Unsupported platform error
- **GIVEN** the host platform is not in the supported list (Linux x64/arm64, macOS x64/arm64, Windows x64)
- **WHEN** the postinstall script executes
- **THEN** the system SHALL print a clear error message indicating the platform is unsupported
- **AND** provide a link to manual download instructions
- **AND** exit with non-zero status code

### Requirement: npm package size remains under 100KB
The system SHALL keep the published npm package size (excluding downloaded binary) under 100KB.

#### Scenario: Small package size
- **WHEN** the npm package is published
- **THEN** the tarball size SHALL be less than 100KB
- **AND** the package SHALL NOT contain any platform-specific binaries
