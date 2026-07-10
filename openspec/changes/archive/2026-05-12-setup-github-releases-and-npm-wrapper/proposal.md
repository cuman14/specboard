## Why

Specboard currently requires manual builds for each platform, making distribution friction-heavy for users. Developers need a seamless way to install and run Specboard across Linux, Windows, and macOS without compiling from source. Automating releases and providing multiple distribution channels (GitHub Releases, npm, direct download) will dramatically improve adoption and user experience.

## What Changes

- **Add GitHub Actions workflow** (`.github/workflows/release.yml`) with matrix builds:
  - `ubuntu-latest` → `.deb`, `.rpm`, `.AppImage`
  - `windows-latest` → `.msi`, `.exe`
  - `macos-latest` → `.dmg`, `.app`
  - Auto-uploads to GitHub Releases on `git push --tags v*`
  
- **Create npm wrapper package** (`packages/specboard-npm/`):
  - `postinstall` script detects OS/architecture
  - Downloads correct binary from GitHub Release
  - Wrapper CLI delegates to native executable
  - Published as `specboard` on npm

- **Add download page** to existing Vercel website (`apps/web/src/app/download/`):
  - OS auto-detection
  - Direct links to GitHub Release assets
  - Copy-paste install commands

## Capabilities

### New Capabilities

- `github-actions-release`: Automated cross-platform Tauri builds via GitHub Actions matrix runners. Publishes `.deb`, `.rpm`, `.AppImage`, `.msi`, `.exe`, `.dmg`, `.app` to GitHub Releases on version tags.

- `npm-binary-wrapper`: npm package that wraps the native Tauri binary. Detects host OS/architecture during `postinstall`, downloads the correct artifact from GitHub Releases, and provides a CLI wrapper (`specboard` command).

- `download-page`: Vercel website page (`/download`) with OS detection that presents the correct download button and installation instructions for the visitor's platform.

### Modified Capabilities

_None - this change introduces new distribution infrastructure without modifying existing spec behavior._

## Impact

- **CI/CD**: New `.github/workflows/release.yml` in repository root
- **npm registry**: New package `specboard` (or `@scope/specboard`) published to npm
- **Vercel website**: New `/download` route added to existing web app
- **GitHub Releases**: Repository will have versioned releases with attached binaries
- **No breaking changes** to existing Specboard application code
