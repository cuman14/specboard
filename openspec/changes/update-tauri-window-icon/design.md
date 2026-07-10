## Context

Tauri 2 uses `src-tauri/icons/` as the source for all platform icons. The `bundle.icon` array in `tauri.conf.json` lists the icon files used at build time. At runtime on Windows, Tauri derives the window icon (taskbar + title bar) from `icon.ico`.

Currently `icon.ico` and `icon.png` are the default Tauri icons shipped with the scaffold. The Specboard logo already exists as `public/logo.png` and `public/logo.svg`. A branded `.ico` (`logo_specboard.ico`) exists in `src-tauri/icons/` but is not referenced in `tauri.conf.json`.

## Goals / Non-Goals

**Goals:**
- Windows taskbar and title-bar show the Specboard logo instead of the Tauri default
- All icon sizes (32×32, 128×128, 256×256) in the `.ico` are Specboard-branded

**Non-Goals:**
- macOS `.icns` update (separate concern)
- Linux icon update (separate concern)
- Any change to in-app UI rendering

## Decisions

### Use the existing `logo_specboard.ico`

`src-tauri/icons/logo_specboard.ico` already contains the Specboard logo in multi-resolution format. Regenerating it from scratch is unnecessary.

**Decision**: Copy/rename `logo_specboard.ico` → `icon.ico` (overwrite the default) rather than changing the `bundle.icon` references in `tauri.conf.json`. This is the minimal change: one file replacement, zero config changes.

**Alternative considered**: Update `bundle.icon` to point at `logo_specboard.ico` — rejected because it would require touching all downstream CI/packaging references that assume `icons/icon.ico`.

### No tooling required at dev time

The replacement is a binary asset swap. No build-script or Tauri plugin changes are needed.

## Risks / Trade-offs

- [Risk] Overwriting `icon.ico` is irreversible without git history → Mitigation: git tracks it; recoverable with `git checkout`.
- [Risk] `logo_specboard.ico` may not include all required sizes (16×16, 32×32, 48×48, 256×256) → Mitigation: verify with an `.ico` inspector before committing; regenerate with `magick` if needed.

## Migration Plan

1. Verify `logo_specboard.ico` contains the required icon sizes.
2. Copy `src-tauri/icons/logo_specboard.ico` over `src-tauri/icons/icon.ico`.
3. Rebuild the Tauri app (`pnpm tauri dev` or `pnpm tauri build`).
4. Confirm the window icon and taskbar icon show the Specboard logo on Windows.

Rollback: `git checkout src-tauri/icons/icon.ico`
