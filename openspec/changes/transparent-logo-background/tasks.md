## 1. Dependencies

- [x] 1.1 Install `sharp` as a devDependency for SVG rasterization with alpha transparency
- [x] 1.2 Install `png-to-ico` as a devDependency for ICO generation with alpha channel
- [x] 1.3 Install `png2icons` as a devDependency for ICNS generation from PNG master

## 2. Icon Generation Script

- [x] 2.1 Create `scripts/deploy/make_icons.mjs` that reads `public/logo.svg` and generates all icon assets
- [x] 2.2 Implement SVG→1024x1024 PNG rasterization using `sharp` with transparent background (`fit: contain`, no background fill)
- [x] 2.3 Implement downscaling from 1024 master to all required PNG sizes (32, 64, 128, 256, 30, 44, 71, 89, 107, 142, 150, 284, 310, 50)
- [x] 2.4 Implement ICO generation from 16, 32, 48, 256 PNGs using `png-to-ico`
- [x] 2.5 Implement ICNS generation from 1024 master using `png2icons`
- [x] 2.6 Write all outputs to `src-tauri/icons/`
- [x] 2.7 Add `"make-icons": "node scripts/deploy/make_icons.mjs"` script to `package.json`

## 3. Verify Source SVG Transparency

- [x] 3.1 Verify `public/logo.svg` has no opaque background rectangle (remove any `<rect>` with solid fill if present)
- [x] 3.2 Confirm the SVG `viewBox` and dimensions are correct for generating a centered logomark

## 4. Generate and Verify Icons

- [x] 4.1 Run `pnpm make-icons` to generate all icon assets
- [x] 4.2 Verify `icon.ico` contains alpha-transparent entries (check 32x32 entry specifically)
- [x] 4.3 Verify `icon.icns` preserves alpha channel
- [x] 4.4 Verify all PNG files have transparent backgrounds (no opaque fill behind logomark)
- [x] 4.5 Verify mobile icon directories (`src-tauri/icons/android/`, `src-tauri/icons/ios/`) are regenerated if they exist

## 5. Visual QA

- [ ] 5.1 Run the app on Windows and verify the taskbar icon shows no opaque background
- [ ] 5.2 Pin the app to the Windows taskbar and verify the shortcut icon has transparent background
- [ ] 5.3 If on macOS, verify dock icon renders with transparent background