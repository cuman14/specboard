## 1. Verify Icon Asset

- [x] 1.1 Inspect `src-tauri/icons/logo_specboard.ico` to confirm it contains sizes 16×16, 32×32, 48×48, and 256×256
- [x] 1.2 If any required size is missing, regenerate the `.ico` from `public/logo.png` using ImageMagick (`magick convert logo.png -define icon:auto-resize=256,128,48,32,16 icon.ico`)

## 2. Replace Window Icon

- [x] 2.1 Copy `src-tauri/icons/logo_specboard.ico` over `src-tauri/icons/icon.ico` (overwrite the default Tauri icon)
- [x] 2.2 Verify `src-tauri/tauri.conf.json` `bundle.icon` still references `icons/icon.ico` (no config change needed)

## 3. Verify

- [x] 3.1 Run `pnpm tauri dev` and confirm the Windows taskbar icon shows the Specboard logo
- [x] 3.2 Confirm the window title bar icon shows the Specboard logo
- [x] 3.3 Confirm Alt+Tab switcher shows the Specboard logo
