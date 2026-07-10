## ADDED Requirements

### Requirement: Icon generation script produces transparent-background icons

The script `scripts/deploy/make_icons.mjs` SHALL read the source SVG from `public/logo.svg` and generate all icon assets with transparent (alpha=0) backgrounds.

#### Scenario: Generating all icon sizes from SVG
- **WHEN** the script is executed (`pnpm make-icons`)
- **THEN** it SHALL produce all required PNG files in `src-tauri/icons/` with transparent backgrounds: `32x32.png`, `64x64.png`, `128x128.png`, `128x128@2x.png`, `icon.png`, `StoreLogo.png`, and all `Square*.png` tiles
- **AND** each PNG SHALL have a transparent (alpha=0) background with no opaque fill behind the logomark

#### Scenario: Generating Windows ICO with alpha transparency
- **WHEN** the script generates `icon.ico`
- **THEN** the ICO file SHALL contain multiple size entries (16x16, 32x32, 48x48, 256x256)
- **AND** each entry SHALL preserve alpha channel transparency
- **AND** the 32x32 entry SHALL have a valid alpha channel (required by Tauri/WebView2 on Windows)

#### Scenario: Generating macOS ICNS with alpha transparency
- **WHEN** the script generates `icon.icns`
- **THEN** the ICNS file SHALL contain all required resolution entries
- **AND** each entry SHALL preserve alpha channel transparency
- **AND** the icon SHALL render without visible background fill when displayed in the macOS dock

### Requirement: Source SVG SHALL NOT contain opaque background elements

The `public/logo.svg` source file used for icon generation SHALL have no opaque background rectangle or fill behind the logomark.

#### Scenario: SVG has transparent background
- **WHEN** the source SVG is rasterized
- **THEN** pixels not covered by the logomark paths SHALL have alpha=0 (fully transparent)
- **AND** no solid-color fill rectangle SHALL appear behind the logomark

### Requirement: Taskbar and dock icons render without visible background

After icon replacement, the application icon SHALL render correctly across all platforms without a visible opaque background.

#### Scenario: Windows taskbar icon
- **WHEN** Specboard is running and appears in the Windows taskbar
- **THEN** the taskbar icon SHALL display only the logomark with no visible colored square or background fill

#### Scenario: macOS dock icon
- **WHEN** Specboard is running and appears in the macOS dock
- **THEN** the dock icon SHALL display only the logomark with no visible colored square or background fill

#### Scenario: Desktop shortcut icon
- **WHEN** a desktop shortcut to Specboard is created
- **THEN** the shortcut icon SHALL display only the logomark with transparent background