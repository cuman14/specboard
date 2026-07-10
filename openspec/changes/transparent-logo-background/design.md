## Context

Specboard's current icon assets in `src-tauri/icons/` have opaque backgrounds. The source logo (`public/logo.svg`) is an SVG with multiple colored path shapes on no explicit background, but the generated PNG, ICO, and ICNS files render with a solid fill behind the logo. This causes visual problems:

- **Windows taskbar**: shows a colored square instead of the logo alone
- **macOS dock**: same opaque square appearance
- **Desktop shortcuts**: icon appears with visible background fill

The source SVG (`public/logo.svg`) already has no background rectangle — the transparency issue was introduced during the icon generation/export process, not in the source artwork.

The project uses Tauri 2's bundler which expects icons listed in `tauri.conf.json` → `bundle.icon` array:
- `icons/icon.ico` (Windows)
- `icons/icon.icns` (macOS)
- `icons/icon.png` (Linux/fallback)
- Various `icons/Square*.png` and `icons/32x32.png`, `128x128.png`, etc.

There is no `make_icon.ps1` in the repository currently (the one referenced in AGENTS.md was deleted or never committed). Icons must be regenerated using a tool that preserves alpha transparency.

## Goals / Non-Goals

**Goals:**
- Regenerate all platform icon assets from `public/logo.svg` with transparent (alpha) backgrounds
- Ensure the `.ico` file contains at least a 32x32 entry with alpha transparency (required by WebView2/Tauri on Windows)
- Ensure the `.icns` file preserves alpha across all icon resolutions
- Ensure all PNG sizes render without visible background fill
- Provide a reproducible icon generation script (`make_icon.ps1`) so this can be re-run in CI or locally
- Verify visual correctness on Windows taskbar and macOS dock

**Non-Goals:**
- Changing the logo design itself (logomark stays the same)
- Replacing the SVG source artwork
- Adding new icon sizes beyond what Tauri requires
- Supporting light/dark mode adaptive icons (deferred)
- Modifying `tauri.conf.json` icon paths (they already reference the correct files)

## Decisions

### 1. Use `sharp` + `png-to-ico` for icon generation (Node.js)

**Options considered:**
- A) ImageMagick CLI (`convert`) — requires system install, cross-platform issues
- B) `sharp` (Node.js) for SVG→PNG + `png-to-ico` for ICO — pure JS, runs in CI
- C) `@aspect-build/ico` — limited size control
- D) Manual generation via GUI tools — not reproducible

**Decision:** Option B. `sharp` already handles SVG rasterization with alpha transparency correctly. `png-to-ico` produces valid multi-size ICO files with alpha. Both are npm packages that run anywhere Node runs, including CI. This avoids requiring ImageMagick or platform-specific tools.

### 2. For macOS ICNS — use `png2icons` or `icnsutil`

**Decision:** Use `png2icons` npm package. It takes a single high-res PNG (1024x1024 or 2048x2048) and generates the complete ICNS file with all required icon resolutions, preserving alpha transparency.

### 3. Source approach: SVG → 1024 PNG → all formats

**Decision:** Generate from SVG at 1024x1024 first (large master PNG with transparency), then downscale to all required sizes. This ensures consistent quality across all resolutions and avoids scaling artifacts.

**Sizes required:**
- `32x32.png`, `128x128.png`, `128x128@2x.png` (256x256)
- `Square30x30Logo.png` through `Square310x310Logo.png` (Windows tiles)
- `StoreLogo.png` (50x50)
- `icon.png` (512x512, Tauri default)
- `icon.ico` (multi-size: 16, 32, 48, 256)
- `icon.icns` (all macOS sizes from 1024 master)

### 4. Script location and execution

**Decision:** Create `scripts/deploy/make_icons.mjs` (ESM module) following the existing convention of deploy scripts in `scripts/deploy/`. Add a `pnpm make-icons` script to `package.json`.

The script will:
1. Read `public/logo.svg`
2. Use `sharp` to rasterize at 1024x1024 with transparent background
3. Downscale to all required sizes using `sharp`'s `resize` with `fit: contain` and transparent background
4. Generate ICO from 16, 32, 48, 256 PNGs using `png-to-ico`
5. Generate ICNS from the 1024 master using `png2icons`
6. Write all outputs to `src-tauri/icons/`

## Risks / Trade-offs

- **[ICO alpha on older Windows]** → Windows XP doesn't support ICO alpha, but since Tauri requires Windows 10+, this is not a concern. Target is Windows 10+ where ICO alpha transparency is fully supported.
- **[SVG rendering differences]** → `sharp` uses `libvips` which renders SVGs via `librsvg`. Results may differ slightly from browser rendering. Mitigation: visually verify the generated 1024 PNG against browser rendering before proceeding with all sizes.
- **[npm dependency weight]** → Adding `sharp`, `png-to-ico`, and `png2icons` adds ~30MB of dependencies. Mitigation: these are devDependencies only, not shipped in the app bundle.
- **[CI reproducibility]** → The script must produce identical icons given the same SVG input. `sharp` + `libvips` produces deterministic output for a given input. No risk.