## Why

The Tauri app window currently shows the default Tauri icon in the Windows taskbar and title bar instead of the Specboard logo. This breaks brand consistency and makes the app harder to identify among open windows.

## What Changes

- Replace the default `icon.ico` in `src-tauri/icons/` with a Specboard-branded `.ico` file generated from the existing `public/logo.png` or `public/logo.svg`
- Update `tauri.conf.json` `bundle.icon` list to reference the correct icon file
- Ensure the window taskbar icon, title bar icon, and tray icon (if used) all show the Specboard logo

## Capabilities

### New Capabilities

<!-- None: this is a pure asset/config replacement -->

### Modified Capabilities

- `architecture`: Window icon configuration in `tauri.conf.json` changes from default Tauri icon to Specboard logo

## Impact

- `src-tauri/icons/icon.ico` — replaced with Specboard-branded icon
- `src-tauri/icons/icon.png` — replaced with Specboard-branded PNG
- `src-tauri/tauri.conf.json` — `bundle.icon` may be updated if file names change
- No API or logic changes; purely visual/asset change
