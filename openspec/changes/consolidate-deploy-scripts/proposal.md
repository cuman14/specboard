## Why

The deployment pipeline has accumulated dead code, stale references, and inconsistencies across scattered files. `scripts/update-sha256-from-artifacts.js` is never invoked but referenced in `AGENTS.md`. `DEPLOYMENT_MODERNIZATION.md` describes an abandoned migration plan. The Homebrew SHA256 regex in `update-sha256.js` is fragile. Deployment-related scripts live at the root of `scripts/` mixed with other utilities. Consolidating and cleaning up reduces maintenance burden and prevents future confusion.

## What Changes

- Move deployment scripts into `scripts/deploy/` subdirectory
- Delete dead script `scripts/update-sha256-from-artifacts.js`
- Delete stale plan document `DEPLOYMENT_MODERNIZATION.md`
- Fix fragile Homebrew SHA256 regex in `update-sha256.js`
- Remove `releaseBody` from tauri-action to preserve release-it's changelog in GitHub Releases
- Update `ubuntu-22.04` to `ubuntu-24.04` in build matrix
- Pin pnpm version to `pnpm@9` in CI workflow
- Update `AGENTS.md` and `.release-it.json` references to new script paths

## Capabilities

### New Capabilities

- `deploy-scripts-organization`: Deployment scripts consolidated under `scripts/deploy/` with clear naming and no dead code

### Modified Capabilities

<!-- No existing specs are being modified — this is infrastructure cleanup, not a behavioral change -->

## Impact

- `scripts/` directory structure: `sync-versions.js` and `update-sha256.js` move to `scripts/deploy/`
- `.release-it.json` hook path updated
- `.github/workflows/release.yml` script path, matrix OS, pnpm version, and tauri-action params updated
- `AGENTS.md` documentation references corrected
- `DEPLOYMENT_MODERNIZATION.md` and `scripts/update-sha256-from-artifacts.js` deleted
- No runtime or user-facing behavior changes
