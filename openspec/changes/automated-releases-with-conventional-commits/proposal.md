## Why

Currently, creating a release requires manual steps: update version numbers in multiple files, create a Git tag, and push it. This is error-prone and inconsistent. Developers often forget to bump versions or create tags with wrong formats. By automating the release process based on conventional commits, we can eliminate manual version management and ensure consistent, semantic versioning that follows the project's commit history automatically.

## What Changes

- **Add semantic-release workflow** — New GitHub Actions workflow that analyzes conventional commits on every push to `main`
- **Automatic version bumping** — Detects `feat:`, `fix:`, and `BREAKING CHANGE:` commits to determine next version (minor, patch, major)
- **Automatic Git tag creation** — Creates and pushes version tags (`v*`) automatically when version changes
- **Updated release.yml** — Modify existing workflow to trigger on both tags AND semantic-release generated tags
- **Conventional commit enforcement** — Add commitlint to ensure all commits follow the conventional format
- **Automatic changelog generation** — Generate CHANGELOG.md from commit history

## Capabilities

### New Capabilities

- `semantic-release-automation`: GitHub Actions workflow that automatically detects version changes from conventional commits, bumps version in all necessary files (package.json, Cargo.toml, tauri.conf.json), creates Git tags, and triggers the Tauri build workflow.

- `conventional-commit-enforcement`: commitlint configuration and CI check that ensures all commits follow the conventional commit format (`feat:`, `fix:`, `chore:`, `docs:`, etc.)

- `auto-changelog-generation`: Automatic generation of CHANGELOG.md following the Keep a Changelog format based on conventional commit history.

### Modified Capabilities

- `github-actions-release`: **MODIFIED** — Workflow trigger conditions expanded to support both manual tags and semantic-release generated tags. Adds version synchronization across multiple files before build.

## Impact

- **CI/CD**: New `.github/workflows/semantic-release.yml` file; modifications to existing `release.yml`
- **Developer workflow**: All commits must now follow conventional commit format
- **Version management**: No more manual version bumps — fully automated
- **Git history**: Cleaner, standardized commit messages
- **Release process**: Push to `main` → automatic analysis → automatic tag → automatic build → GitHub Release
- **Documentation**: New CHANGELOG.md auto-generated
- **No breaking changes** to the application itself — only the release process changes
