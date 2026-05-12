## Context

Specboard is a Tauri 2 desktop application built with Rust (backend) and React 19 + TypeScript (frontend). Currently, distributing Specboard requires developers to:

1. Clone the repository
2. Install Rust toolchain, Node.js, pnpm
3. Run `pnpm tauri build` manually
4. Distribute the resulting binary themselves

This creates friction for end users who just want to install and run the application. Tauri provides official GitHub Actions (`tauri-apps/tauri-action`) that automate cross-platform builds and GitHub Releases publishing.

This design covers three distribution channels:
- **GitHub Actions CI/CD**: Automated builds on version tags
- **npm wrapper**: Pattern used by `esbuild`, `prisma`, `@playwright/test` for binary distribution
- **Vercel download page**: OS-aware landing page for direct downloads

## Goals / Non-Goals

**Goals:**
- Trigger automated cross-platform builds on `git push --tags v*`
- Generate platform-specific installers: `.deb`, `.rpm`, `.AppImage` (Linux), `.msi`, `.exe` (Windows), `.dmg`, `.app` (macOS)
- Auto-publish release artifacts to GitHub Releases
- Provide `npm install -g specboard` installation experience
- Offer OS-detected download page at `/download` on Vercel site
- Support x64 and ARM64 architectures where applicable

**Non-Goals:**
- Homebrew tap (deferred to future phase due to audience being primarily Node developers)
- Windows Store / Mac App Store distribution (out of scope)
- Auto-updater integration (future enhancement)
- Code signing certificates (GitHub Action handles unsigned builds)

## Decisions

### 1. Use `tauri-apps/tauri-action` for CI/CD
**Decision**: Use the official Tauri GitHub Action instead of manual `cargo tauri build` commands.

**Rationale**: 
- Handles matrix builds, artifact upload, and GitHub Releases automatically
- Actively maintained by Tauri team
- Supports `tagName` input for automated versioning

**Alternatives considered**: 
- Manual `cargo tauri build` with custom artifact handling (more complex, more maintenance)
- Third-party actions (less trust, potential drift from Tauri releases)

### 2. npm wrapper: postinstall download pattern
**Decision**: npm package contains only a wrapper script + postinstall downloader, not the binary itself.

**Rationale**:
- Keeps npm package small (~10KB vs 50-150MB)
- Pattern proven by `esbuild`, `prisma`, `@playwright/test`
- Users get the correct binary for their OS/arch automatically
- GitHub Releases serves as the single source of truth for binaries

**Implementation**:
- `postinstall.js`: Detects `process.platform` and `process.arch`, maps to GitHub Release asset name
- Downloads via HTTPS to `node_modules/.bin/specboard-native`
- CLI wrapper `bin/specboard` spawns the native binary with `child_process.spawn()`

**Alternatives considered**:
- Include all binaries in npm package (prohibitive size: 3 platforms × 2 arches × ~50MB = ~300MB)
- Pure JS implementation (impossible for Tauri app which requires native binary)

### 3. Vercel download page: client-side OS detection
**Decision**: Detect OS via `navigator.userAgent` in browser, present appropriate download button.

**Rationale**:
- Simple, no backend required
- Links directly to GitHub Releases assets (no hosting cost)
- Immediate feedback to user

**Implementation**:
- Parse `navigator.platform` and `navigator.userAgent`
- Map to GitHub Release asset URL pattern: `https://github.com/<owner>/<repo>/releases/download/v<version>/specboard_<version>_<target>.<ext>`
- Fallback: Show all download options if detection ambiguous

### 4. Version synchronization strategy
**Decision**: Single source of truth is Git tag. npm package version and release artifacts use the same version.

**Rationale**:
- Prevents version drift between channels
- `package.json` in npm wrapper reads version from env or hardcodes it
- GitHub Action reads version from pushed tag

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| GitHub Actions runner minutes exceed free tier | Monitor usage; builds only on tags, not every push |
| npm postinstall fails behind corporate proxy | Document manual download fallback; support `SPECBOARD_BINARY_PATH` env var |
| GitHub API rate limit during postinstall | Use unauthenticated requests for public releases (60 req/hour/IP sufficient) |
| macOS notarization requires paid Apple Developer account | Unsigned `.dmg`/`.app` works for local distribution; document notarization as optional step |
| Windows SmartScreen warnings on unsigned `.exe` | Document code signing as future enhancement; MSI installer less likely to trigger warnings than raw exe |
| npm package name squatting | Publish early to reserve `specboard` name; consider scoped `@specboard/cli` if unavailable |

## Migration Plan

**Phase 1 - GitHub Actions** (independent):
1. Create `.github/workflows/release.yml`
2. Test with `git tag v0.0.0-test && git push --tags`
3. Verify artifacts appear in GitHub Releases

**Phase 2 - npm wrapper** (depends on Phase 1):
1. Create `packages/specboard-npm/` with `package.json`
2. Implement `postinstall.js` with platform detection
3. Test locally: `npm link` then `specboard`
4. Publish to npm: `npm publish`

**Phase 3 - Download page** (depends on Phase 1):
1. Add `/download` route to Vercel web app
2. Implement OS detection component
3. Add links to GitHub Releases assets
4. Deploy to Vercel

**Rollback**: Delete GitHub workflow file; unpublish npm package (`npm unpublish` within 24h or deprecate); remove `/download` route from web app.

## Open Questions

1. **npm package name**: Is `specboard` available on npm registry? Should we use `@specboard/cli` instead?
2. **Code signing**: Do we want to invest in Apple Developer account ($99/year) and Windows code signing certificate for production releases?
3. **ARM64 support**: macOS ARM64 (Apple Silicon) is straightforward. Windows ARM64 and Linux ARM64 - do we include these in the matrix?
