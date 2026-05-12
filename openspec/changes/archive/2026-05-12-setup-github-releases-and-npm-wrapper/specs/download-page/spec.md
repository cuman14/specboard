## ADDED Requirements

### Requirement: Download page accessible at /download route
The system SHALL provide a download page accessible via the `/download` URL path on the Vercel website.

#### Scenario: Page loads at correct URL
- **WHEN** a user navigates to `https://<site>/download`
- **THEN** the download page SHALL render without errors
- **AND** the page SHALL display a download interface

### Requirement: Page detects visitor's operating system
The system SHALL detect the visitor's operating system via browser user agent and present the appropriate download option.

#### Scenario: macOS user sees macOS download
- **GIVEN** the visitor's user agent indicates macOS
- **WHEN** the download page loads
- **THEN** the primary download button SHALL be for the macOS version

#### Scenario: Windows user sees Windows download
- **GIVEN** the visitor's user agent indicates Windows
- **WHEN** the download page loads
- **THEN** the primary download button SHALL be for the Windows version

#### Scenario: Linux user sees Linux download
- **GIVEN** the visitor's user agent indicates Linux
- **WHEN** the download page loads
- **THEN** the primary download button SHALL be for the Linux version

### Requirement: Download links point to GitHub Releases
The system SHALL generate download URLs that point directly to the corresponding assets on GitHub Releases.

#### Scenario: URL points to correct release asset
- **GIVEN** the latest release is `v0.1.0`
- **WHEN** the download button is clicked
- **THEN** the browser SHALL navigate to the asset URL on GitHub Releases
- **AND** the URL SHALL follow the pattern: `https://github.com/<owner>/<repo>/releases/download/v<version>/<asset-name>`

### Requirement: Page displays installation instructions
The system SHALL show platform-specific installation instructions alongside the download button.

#### Scenario: npm install command shown
- **GIVEN** the visitor is on any platform
- **WHEN** the download page renders
- **THEN** the npm install command `npm install -g specboard` SHALL be displayed

#### Scenario: Platform-specific install instructions
- **GIVEN** the visitor's OS is detected as macOS
- **WHEN** the download page renders
- **THEN** instructions for installing the `.dmg` SHALL be displayed

### Requirement: Fallback shows all platforms when detection is ambiguous
The system SHALL display download options for all platforms when OS detection is inconclusive.

#### Scenario: Unknown user agent shows all options
- **GIVEN** the user agent does not match known patterns
- **WHEN** the download page loads
- **THEN** download buttons for all three platforms SHALL be displayed
- **AND** each button SHALL be clearly labeled with the platform name

### Requirement: Page shows current version number
The system SHALL display the latest released version number on the download page.

#### Scenario: Version is visible
- **GIVEN** the latest release is `v0.1.0`
- **WHEN** the download page loads
- **THEN** the text SHALL include the version number `v0.1.0` prominently displayed

### Requirement: Copy-to-clipboard for install commands
The system SHALL provide a copy-to-clipboard button for npm install commands.

#### Scenario: User copies install command
- **WHEN** a user clicks the copy button next to the npm install command
- **THEN** the command `npm install -g specboard` SHALL be copied to the clipboard
- **AND** visual feedback SHALL indicate the copy succeeded
