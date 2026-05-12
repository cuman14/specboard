# Release Process

This document describes how releases are automatically created and published for Specboard.

## Automated Release Workflow

Specboard uses **semantic-release** with GitHub Actions to automatically:

- Analyze conventional commits on every push to `main`
- Determine the next semantic version (major/minor/patch)
- Bump version in all required files
- Generate CHANGELOG.md
- Create and push Git tags
- Trigger Tauri builds for all platforms
- Create GitHub Releases with installers

### Creating a Release

**No manual steps required** — just push conventional commits to `main`:

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
# OR
git commit -m "fix: resolve critical bug"

# Push to main
git push origin main

# That's it! The rest happens automatically:
# 1. commitlint validates the commit format
# 2. semantic-release analyzes commits and bumps version
# 3. Version updated in package.json, Cargo.toml, tauri.conf.json
# 4. CHANGELOG.md generated
# 5. Git tag created (e.g., v1.2.3)
# 6. Release workflow triggered → builds installers
# 7. GitHub Release created with all artifacts
```

### Version Bump Rules

| Commit Type                              | Version Bump              | Example                 |
| ---------------------------------------- | ------------------------- | ----------------------- |
| `feat:`                                  | **minor** (1.2.3 → 1.3.0) | `feat: add dark mode`   |
| `fix:`                                   | **patch** (1.2.3 → 1.2.4) | `fix: resolve crash`    |
| `feat!:`, `BREAKING CHANGE:`             | **major** (1.2.3 → 2.0.0) | `feat!: remove old API` |
| `docs:`, `chore:`, `style:`, `refactor:` | **no release**            | `docs: update README`   |

### Breaking Changes

To trigger a major version bump, use `!` after the type or add a `BREAKING CHANGE:` footer:

```bash
git commit -m "feat!: remove deprecated workspace API"

# OR

git commit -m "feat: redesign workspace API

BREAKING CHANGE: workspace.path is now required"
```

### Manual Release (Emergency)

If the automated process fails, you can still release manually:

```bash
# 1. Sync version files manually
node scripts/sync-versions.js 1.2.3

# 2. Commit and push
git add .
git commit -m "chore: bump version to 1.2.3"
git push origin main

# 3. Create and push tag
git tag v1.2.3
git push origin v1.2.3
```

### Dry Run

Preview what version semantic-release would create before pushing:

```bash
npx semantic-release --dry-run
```

## Release Checklist

### For Automated Releases (Normal Workflow)

- [ ] Commit message follows conventional format (`feat:`, `fix:`, etc.)
- [ ] Commitlint check passes on PR
- [ ] Changes pushed to `main`
- [ ] Semantic-release workflow completed successfully
- [ ] Git tag created automatically (`v*`)
- [ ] Release workflow triggered and completed
- [ ] All platform artifacts present in GitHub Release:
  - [ ] Linux: `.deb`, `.rpm`, `.AppImage`
  - [ ] Windows: `.msi`, `.exe`
  - [ ] macOS: `.dmg`, `.app`
- [ ] CHANGELOG.md updated automatically
- [ ] GitHub Release published (not draft)
- [ ] npm package published (if applicable)
- [ ] Download page deployed (if applicable)

### For Manual Releases (Emergency Only)

- [ ] Version manually synced with `node scripts/sync-versions.js`
- [ ] Version bumped in all files
- [ ] Changelog updated manually (if applicable)
- [ ] Git tag manually pushed (`v*`)
- [ ] GitHub Actions workflow completed successfully
- [ ] All platform artifacts present in GitHub Release
- [ ] GitHub Release published (not draft)

## Version Numbering

Specboard follows [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

## Troubleshooting

### GitHub Actions Failures

Check the workflow logs at: `https://github.com/cuman14/specboard/actions`

Common issues:

- **Missing dependencies**: Ensure all prerequisites are installed in workflow
- **Build errors**: Check that `pnpm tauri build` works locally
- **Artifact upload failures**: Check GitHub token permissions

### npm Publish Failures

- Ensure you are logged in: `npm login`
- Check package name availability: `npm view specboard`
- Verify version is not already published

### Binary Download Issues

If users report download failures through the npm package:

- Verify the GitHub Release exists and assets are attached
- Check that asset names match the pattern in `lib/platform.js`
- Test with `SPECBOARD_BINARY_PATH` override

## Manual Build (Fallback)

If CI/CD is unavailable, you can build locally:

```bash
# Prerequisites
pnpm install

# Build for current platform
pnpm tauri build

# Find installers in:
# src-tauri/target/release/bundle/
```

Upload these manually to GitHub Releases.
