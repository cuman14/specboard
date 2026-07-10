## Why

The current Specboard icons (`.ico`, `.icns`, `.png`) have an opaque background that causes visual issues on both Windows and macOS: the taskbar/icon shows a colored square instead of the logo alone, and the window title bar and shortcut icons display an unnatural solid fill. A transparent background is the standard for application icons across all platforms and ensures the logo renders cleanly against any surface color.

## What Changes

- Regenerate all icon assets in `src-tauri/icons/` with transparent backgrounds: `icon.ico`, `icon.icns`, `icon.png`, all `Square*.png`, `32x32.png`, `64x64.png`, `128x128.png`, `128x128@2x.png`, `StoreLogo.png`, and mobile icon variants under `android/` and `ios/`
- Update the icon generation script (`make_icon.ps1` or equivalent) to produce transparent-background icons from a source SVG/PNG
- Ensure the Windows `.ico` contains a 32x32 entry with alpha transparency (required by Tauri/WebView2)
- Verify macOS `.icns` preserves alpha channel across all icon resolutions
- Confirm the taskbar (Windows), dock (macOS), and launcher (Linux) icons render without visible background fill

## Capabilities

### New Capabilities

- `transparent-icon-generation`: capability to generate all platform icons from a source image with transparent background, ensuring correct alpha handling per format (ICO with alpha, ICNS with alpha, PNG with alpha)

### Modified Capabilities

## Impact

- `src-tauri/icons/` — all icon files replaced
- `make_icon.ps1` or any icon generation script — must produce transparent output
- `tauri.conf.json` — no changes needed (already references correct icon paths)
- Visual QA needed on Windows taskbar, macOS dock, and Linux launcher