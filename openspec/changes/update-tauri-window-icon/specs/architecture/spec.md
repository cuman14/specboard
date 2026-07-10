## MODIFIED Requirements

### Requirement: Window icon uses Specboard branding
The Tauri application window SHALL display the Specboard logo as its icon in the OS window title bar, taskbar, and Alt+Tab switcher on Windows.

#### Scenario: Window icon shows Specboard logo on Windows
- **WHEN** the Specboard desktop app is running on Windows
- **THEN** the taskbar button SHALL display the Specboard logo (not the default Tauri icon)

#### Scenario: Title bar icon shows Specboard logo
- **WHEN** the Specboard main window is visible
- **THEN** the window title bar icon SHALL display the Specboard logo
