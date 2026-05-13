# Contributing to Specboard

## Commit Message Format

This project uses **Conventional Commits** to automate versioning and changelog generation.

Every commit message must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Triggers       | Description                                             |
| ---------- | -------------- | ------------------------------------------------------- |
| `feat`     | **minor** bump | A new feature                                           |
| `fix`      | **patch** bump | A bug fix                                               |
| `perf`     | **patch** bump | A performance improvement                               |
| `revert`   | **patch** bump | Reverts a previous commit                               |
| `docs`     | no release     | Documentation only changes                              |
| `style`    | no release     | Code style changes (formatting, etc.)                   |
| `refactor` | no release     | Code change that neither fixes a bug nor adds a feature |
| `test`     | no release     | Adding or updating tests                                |
| `chore`    | no release     | Maintenance tasks, dependency updates                   |
| `ci`       | no release     | CI/CD configuration changes                             |
| `build`    | no release     | Build system changes                                    |

### Scopes (optional)

`ui`, `core`, `ci`, `docs`, `api`, `store`, `tauri`

### Breaking Changes

To trigger a **major** version bump, add `!` after the type or a `BREAKING CHANGE:` footer:

```
feat!: remove deprecated API endpoint

# OR

feat: redesign workspace API

BREAKING CHANGE: WorkspaceInfo.path is now required and must be absolute
```

### Examples

```bash
# Patch bump (bug fix)
git commit -m "fix: resolve crash when opening empty workspace"

# Minor bump (new feature)
git commit -m "feat(ui): add dark mode toggle to settings"

# Major bump (breaking change)
git commit -m "feat!: replace workspace store with new Zustand slice"

# No release (documentation)
git commit -m "docs: update installation instructions in README"

# No release (maintenance)
git commit -m "chore: update pnpm to v11.1.0"

# No release (refactor)
git commit -m "refactor(core): extract artifact parsing into separate module"

# No release (CI fix)
git commit -m "ci: fix caching strategy in release workflow"
```

## Automated Release Process

When you push changesets to `main`, the following happens automatically:

1. **release-it** analyzes changesets in `.changeset/` directory
2. If a changeset is found:
   - Version is bumped in `package.json`, `Cargo.toml`, `tauri.conf.json`
   - `CHANGELOG.md` is updated
   - A Git tag (`v*`) is created and pushed
3. The **release workflow** triggers and builds installers for all platforms
4. SHA256 hashes are calculated during build
5. Package manifests (scoop, homebrew) are updated with SHA256
6. A GitHub Release is created with the installers attached

## Development Workflow

```bash
# Clone and install
git clone https://github.com/cuman14/specboard.git
cd specboard
pnpm install

# Run in development mode
pnpm tauri dev

# Make your changes
git add .
git commit -m "feat(ui): add new kanban filter"

# Create a changeset for release
pnpm changeset
# Select version bump type (major/minor/patch) and add description

# Commit the changeset
git add .changeset/*.md
git commit -m "chore: add changeset"

# Push triggers the automated release pipeline if applicable
git push origin main
```

## Dry Run

You can preview what version release-it would create before pushing:

```bash
pnpm release-it --dry-run
```

## Manual Release (Emergency)

If the automated process fails, you can still release manually:

```bash
# Sync version files manually
node scripts/sync-versions.js 1.2.3

# Create and push tag
git tag v1.2.3
git push origin v1.2.3
```
