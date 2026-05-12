## Context

Currently, the release process for Specboard requires several manual steps that are error-prone and inconsistent across team members. The developer must:

1. Manually update version numbers in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`
2. Create a Git tag with the correct format (`v*`)  
3. Push the tag to trigger the GitHub Actions workflow
4. Hope they didn't forget any version file or use the wrong version format

This manual process often leads to:
- Version inconsistencies between files
- Forgotten version bumps
- Inconsistent tag formats
- Unclear when to bump major/minor/patch

The project already has GitHub Actions set up for building Tauri releases, but the triggering mechanism (manual tags) is the bottleneck.

## Goals / Non-Goals

**Goals:**
- Automatically detect version changes from conventional commits on every push to `main`
- Automatically bump version in all required files (`package.json`, `Cargo.toml`, `tauri.conf.json`)
- Automatically create and push Git tags (`v*`) when version changes
- Enforce conventional commit format on all commits to `main`
- Generate CHANGELOG.md automatically from commit history
- Support manual workflow dispatch for edge cases

**Non-Goals:**
- Automatic publishing to npm (manual approval still required)
- Automatic deployment of download page (manual approval still required)  
- Enforcing conventional commits on feature branches (only `main`)
- Auto-merging PRs (out of scope)
- Version bumping on every commit (only when conventional commits indicate a change)

## Decisions

### 1. Use `semantic-release` with custom configuration

**Decision**: Use `semantic-release` Node.js tool with a custom GitHub Actions workflow rather than third-party GitHub Actions.

**Rationale**:
- `semantic-release` is the industry standard for semantic versioning automation
- Full control over the release process
- Can customize which files get version bumps
- Supports plugins for changelog generation

**Alternatives considered**:
- `google-github-actions/release-please` — Good but less flexible for multi-file version bumps
- Custom bash script — More maintenance, less reliable
- `changesets` — Popular but adds complexity with changeset files

**Implementation**:
```yaml
# semantic-release.yml workflow
- Checkout code
- Setup Node.js
- Run semantic-release
  - Analyzes commits since last tag
  - Determines next version (major/minor/patch)
  - Updates package.json, Cargo.toml, tauri.conf.json
  - Generates CHANGELOG.md
  - Creates Git tag
  - Pushes changes back to main
```

### 2. Use `@semantic-release/exec` for multi-file version sync

**Decision**: Use the exec plugin to run custom commands that update `Cargo.toml` and `tauri.conf.json` with the new version.

**Rationale**:
- `semantic-release` only updates `package.json` by default
- Tauri requires version sync across 3 files
- Exec plugin allows running `sed` or custom scripts

**Implementation**:
```javascript
// .releaserc.js
['@semantic-release/exec', {
  prepareCmd: 'node scripts/sync-versions.js ${nextRelease.version}'
}]
```

### 3. Workflow trigger strategy: push to main

**Decision**: Trigger semantic-release workflow on every push to `main`, not on PR merge.

**Rationale**:
- Direct push to `main` or merged PR both result in a push
- Catches all changes without complex event filtering
- Can filter by `if: github.event.head_commit.message != 'chore(release)'` to avoid loops

**Flow**:
```
Push to main → semantic-release workflow → (if version change) → tag created → release workflow triggered
```

### 4. Commitlint enforcement via CI check

**Decision**: Add a separate workflow that checks conventional commit format on PRs and pushes to `main`.

**Rationale**:
- Catches bad commits before they reach main
- Uses `@commitlint/config-conventional` standard
- Runs on PR to give feedback before merge

**Implementation**:
```yaml
# commitlint.yml
on:
  pull_request:
  push:
    branches: [main]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: wagoid/commitlint-github-action@v5
```

### 5. Changelog format: Keep a Changelog

**Decision**: Use `@semantic-release/changelog` with Keep a Changelog format.

**Rationale**:
- Standard format understood by developers
- Groups changes by type (Added, Changed, Fixed, etc.)
- semantic-release can generate this format

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **Infinite release loop** | semantic-release pushes with `[skip ci]` or specific message; workflow filters out `chore(release)` commits |
| **Version bump conflicts** | Only one release workflow runs at a time (GitHub Actions serialization); semantic-release pulls latest before push |
| **Breaking change not detected** | Require `BREAKING CHANGE:` footer or `!` in commit type (`feat!:`); document this in CONTRIBUTING.md |
| **Wrong version bump** | Document conventional commit types clearly; commitlint catches invalid types |
| **Failed mid-release** | semantic-release is atomic; if push fails, tag not created; can retry workflow manually |
| **Force push to main breaks history** | Branch protection rules prevent force pushes; require PR reviews |

## Migration Plan

**Phase 1 - Setup (one-time)**:
1. Add commitlint workflow (starts enforcing immediately)
2. Add semantic-release configuration files
3. Add semantic-release workflow
4. Create `CONTRIBUTING.md` documenting conventional commits
5. Update existing `release.yml` to handle both manual and auto-generated tags

**Phase 2 - Adoption**:
1. Team learns conventional commit format
2. First automated release happens on next `feat:` or `fix:` commit to main
3. Monitor for issues
4. Adjust configuration as needed

**Phase 3 - Cleanup**:
1. Update documentation to reflect new automated process
2. Archive old manual release instructions
3. Consider adding npm publish automation (optional)

**Rollback**:
- Disable semantic-release workflow (delete or rename file)
- Return to manual tag creation
- No code changes required in application

## Open Questions

1. **Should we enable npm auto-publish?** Currently requires manual `npm publish` — should this be automated too?
2. **Pre-release versions?** Do we need `alpha`, `beta`, `rc` release channels? semantic-release supports these via branches.
3. **Squash merging impact?** If we squash PRs, the individual commit messages are lost. Should we require semantic PR titles instead?

## Configuration Files Needed

### `.releaserc.js` (semantic-release config)
```javascript
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ['@semantic-release/exec', {
      prepareCmd: 'node scripts/sync-versions.js ${nextRelease.version}'
    }],
    '@semantic-release/git',
    '@semantic-release/github'
  ]
}
```

### `scripts/sync-versions.js`
Updates `Cargo.toml` and `tauri.conf.json` with the new version from semantic-release.

### `.github/workflows/semantic-release.yml`
Triggers on push to main, runs semantic-release.

### `.github/workflows/commitlint.yml`
Validates conventional commit format on PRs.

### `CONTRIBUTING.md`
Documents the conventional commit format for contributors.
