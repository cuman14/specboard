# Deployment & Versioning Modernization Plan

This plan modernizes Specboard's deployment and versioning infrastructure by replacing Semantic Release with Changesets, consolidating CI workflows, and automating package manager submissions.

## Current Setup Analysis

### Existing Stack
- **Semantic Release** - Automated versioning based on conventional commits
- **Commitlint** - Enforces conventional commit format
- **Custom Scripts:**
  - `sync-versions.js` - Syncs version across Cargo.toml, tauri.conf.json, scoop, homebrew
  - `update-sha256.js` - Downloads artifacts and updates SHA256 hashes
- **GitHub Actions:**
  - `semantic-release.yml` - Runs on push to main, analyzes commits, creates releases
  - `release.yml` - Builds Tauri apps for Windows/Mac/Linux on release
- **Package Managers:** Scoop (Windows), Homebrew (macOS), Flatpak (Linux)

### Pain Points
- Two-step release process (semantic-release creates tag → build workflow runs)
- Manual SHA256 calculation after builds complete
- Custom scripts require ongoing maintenance
- Package manifests (scoop/homebrew) updated separately via manual commits
- No automation for submitting to package manager repositories

## Recommended Solution

### Primary Recommendation: Changesets + Release-it + Unified CI

**Changesets** replaces Semantic Release for version management:
- More flexible change tracking with `.changeset/*.md` files
- Better control over release notes and version bumps
- Simplifies managing breaking changes vs features
- Works with existing conventional commits

**Release-it** handles GitHub releases:
- Single-command release process
- Built-in plugins for npm, GitHub, Homebrew, Scoop
- Reduces custom script dependencies
- Better error handling and rollback

**Unified CI Workflow**:
- Combine versioning and build into single workflow
- Generate SHA256 during build step
- Automatic package manager submissions via GitHub Actions

### Why Not Nx/Turborepo?
- Nx and Turborepo are monorepo tools
- Specboard is a single Tauri application
- Would add unnecessary complexity
- No multi-package coordination needed

## Technical Specification

### Phase 1: Install Changesets

```bash
pnpm add @changesets/cli -D
pnpm changeset init
```

Configuration in `.changeset/config.json`:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### Phase 2: Install Release-it

```bash
pnpm add release-it -D
pnpm add @release-it-plugins/lerna-changelog -D
pnpm add @release-it-plugins/workspaces -D
```

Configuration in `.release-it.json`:
```json
{
  "git": {
    "commitMessage": "chore(release): v${version}",
    "tagMatch": "v${version}",
    "tagName": "v${version}"
  },
  "npm": {
    "publish": false
  },
  "github": {
    "release": true,
    "releaseName": "Specboard v${version}",
    "autoGenerate": true,
    "assets": [
      "dist/*.exe",
      "dist/*.dmg",
      "dist/*.AppImage",
      "dist/*.deb"
    ]
  },
  "plugins": {
    "@release-it-plugins/lerna-changelog": {
      "repoUrl": "https://github.com/cuman14/specboard",
      "labels": {
        "feat": ":sparkles: New Features",
        "fix": ":bug: Bug Fixes",
        "docs": ":memo: Documentation",
        "style": ":art: Styles",
        "refactor": ":hammer: Refactor",
        "perf": ":zap: Performance",
        "test": ":white_check_mark: Tests",
        "chore": ":wrench: Chore",
        "ci": ":robot: CI",
        "build": ":construction: Build"
      }
    }
  },
  "hooks": {
    "before:init": [
      "pnpm changeset version",
      "node scripts/sync-versions.js ${version}"
    ],
    "after:release": [
      "node scripts/update-sha256.js ${version}",
      "git add scoop/specboard.json homebrew/specboard.rb",
      "git commit -m \"chore: update SHA256 hashes for v${version}\"",
      "git push"
    ]
  }
}
```

### Phase 3: Simplified sync-versions.js

Remove SHA256 calculation (handled during build):
```javascript
// scripts/sync-versions.js (simplified)
import fs from "fs";
import path from "path";

const version = process.argv[2];
const root = path.resolve(process.cwd());

// Update Cargo.toml
const cargoPath = path.join(root, "src-tauri", "Cargo.toml");
const cargoContent = fs.readFileSync(cargoPath, "utf8");
const updatedCargo = cargoContent.replace(/^version\s*=\s*"[^"]+"/m, `version = "${version}"`);
fs.writeFileSync(cargoPath, updatedCargo, "utf8");

// Update tauri.conf.json
const tauriConfPath = path.join(root, "src-tauri", "tauri.conf.json");
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf8"));
tauriConf.version = version;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + "\n", "utf8");

// Update scoop/specboard.json (URL only, no SHA256)
const scoopPath = path.join(root, "scoop", "specboard.json");
const scoopManifest = JSON.parse(fs.readFileSync(scoopPath, "utf8"));
scoopManifest.version = version;
scoopManifest.architecture["64bit"].url = `https://github.com/cuman14/specboard/releases/download/v${version}/specboard_${version}_x64-setup.exe`;
fs.writeFileSync(scoopPath, JSON.stringify(scoopManifest, null, 2) + "\n", "utf8");

// Update homebrew/specboard.rb (URL only, no SHA256)
const homebrewPath = path.join(root, "homebrew", "specboard.rb");
const homebrewContent = fs.readFileSync(homebrewPath, "utf8");
const updatedHomebrew = homebrewContent
  .replace(/url "https:\/\/github\.com\/cuman14\/specboard\/releases\/download\/v[^"]+"/, 
          `url "https://github.com/cuman14/specboard/releases/download/v${version}/specboard_${version}_x64.dmg"`)
  .replace(/specboard_[^_]+_x64\.dmg/, `specboard_${version}_x64.dmg`);
fs.writeFileSync(homebrewPath, updatedHomebrew, "utf8");
```

### Phase 4: Unified GitHub Actions Workflow

Replace `semantic-release.yml` and `release.yml` with single `release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main
  workflow_dispatch:
    inputs:
      version:
        description: "Version to release (e.g. 1.2.3)"
        required: true

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    if: |
      !contains(github.event.head_commit.message, '[skip ci]') &&
      !startsWith(github.event.head_commit.message, 'chore(release)')
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile --ignore-scripts

      - name: Create changeset if version provided
        if: github.event.inputs.version
        run: |
          echo "${{ github.event.inputs.version }}" | pnpm changeset
          git add .changeset
          git commit -m "chore: add changeset for ${{ github.event.inputs.version }}"

      - name: Version and release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_OPTIONS: "--max-old-space-size=4096"
        run: pnpm release-it

  build:
    needs: release
    permissions:
      contents: write
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: "ubuntu-22.04"
            args: ""
          - platform: "windows-latest"
            args: ""
          - platform: "macos-latest"
            args: ""
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: setup node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: install Rust stable
        uses: dtolnay/rust-toolchain@stable

      - name: install dependencies (ubuntu only)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

      - name: install frontend dependencies
        run: npm install -g pnpm && pnpm install --frozen-lockfile --ignore-scripts

      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: "Specboard ${{ github.ref_name }}"
          releaseBody: "See the CHANGELOG.md for details."
          releaseDraft: false
          prerelease: false
          args: ${{ matrix.args }}

      - name: Calculate SHA256
        run: |
          sha256sum dist/* > dist/sha256sum.txt

      - name: Upload SHA256
        uses: actions/upload-artifact@v4
        with:
          name: sha256-${{ matrix.platform }}
          path: dist/sha256sum.txt

  update-sha256:
    needs: [release, build]
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Download SHA256 artifacts
        uses: actions/download-artifact@v4
        with:
          path: sha256-artifacts

      - name: Update manifests with SHA256
        run: node scripts/update-sha256-from-artifacts.js sha256-artifacts

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add scoop/specboard.json homebrew/specboard.rb
          git commit -m "chore: update SHA256 hashes for ${{ github.ref_name }}"
          git push origin main
```

### Phase 5: Automated Package Manager Submissions

#### Homebrew Auto-Submission
Create `.github/workflows/homebrew.yml`:
```yaml
name: Submit to Homebrew

on:
  release:
    types: [published]

permissions:
  contents: read

jobs:
  homebrew:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Bump Homebrew formula
        uses: mislav/bump-homebrew-formula-action@v2
        with:
          formula-name: specboard
          formula-path: homebrew/specboard.rb
          commit-message: "Update specboard to version {{version}}"
          download-url: https://github.com/cuman14/specboard/releases/download/v{{version}}/specboard_{{version}}_x64.dmg
        env:
          GITHUB_TOKEN: ${{ secrets.HOMEBREW_TAP_TOKEN }}
```

#### Scoop Auto-Submission
Create `.github/workflows/scoop.yml`:
```yaml
name: Submit to Scoop

on:
  release:
    types: [published]

permissions:
  contents: read

jobs:
  scoop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update Scoop bucket
        uses: MinoruSekine/scoop-update-action@v1
        with:
          bucket: cuman14/scoop-bucket
          path: scoop/specboard.json
        env:
          GITHUB_TOKEN: ${{ secrets.SCOOP_BUCKET_TOKEN }}
```

## Migration Steps

### Step 1: Install Dependencies
```bash
pnpm add @changesets/cli release-it @release-it-plugins/lerna-changelog -D
pnpm changeset init
```

### Step 2: Update Configuration Files
- Create `.changeset/config.json`
- Create `.release-it.json`
- Update `package.json` scripts:
  ```json
  {
    "scripts": {
      "changeset": "changeset",
      "version": "changeset version",
      "release": "release-it"
    }
  }
  ```

### Step 3: Simplify Custom Scripts
- Update `sync-versions.js` to remove SHA256 calculation
- Create `update-sha256-from-artifacts.js` to read from CI artifacts

### Step 4: Replace GitHub Actions Workflows
- Delete `semantic-release.yml`
- Replace `release.yml` with unified workflow
- Add `homebrew.yml` and `scoop.yml` for auto-submissions

### Step 5: Remove Old Dependencies
```bash
pnpm remove @semantic-release/changelog @semantic-release/exec @semantic-release/git semantic-release
pnpm remove @commitlint/cli @commitlint/config-conventional
```

### Step 6: Update Documentation
- Update `RELEASE.md` with new release process
- Update `CONTRIBUTING.md` with Changesets workflow

## New Release Workflow

### For Developers
```bash
# Make changes
git commit -m "feat: add new feature"

# Create changeset
pnpm changeset
# Select version bump type and add description

# Commit changeset
git add .changeset/*.md
git commit -m "chore: add changeset"

# Push to main
git push origin main
```

### For CI/CD
1. Changeset detects version bump needed
2. Release-it versions the project
3. sync-versions.js updates all manifests
4. Build workflow creates release artifacts
5. SHA256 calculated during build
6. Package managers auto-submitted

## Benefits

1. **Simplified Workflow** - Single CI workflow instead of two
2. **Better Change Tracking** - Changesets provide explicit change documentation
3. **Reduced Maintenance** - Less custom script code
4. **Faster Releases** - SHA256 calculated during build, not after
5. **Automated Submissions** - Package managers updated automatically
6. **Better Rollback** - Release-it has built-in rollback support
7. **Clearer Release Notes** - Changesets generate better changelogs

## Rollback Plan

If issues arise:
1. Delete the GitHub release
2. Revert the version commit: `git revert HEAD`
3. Push to main
4. Release-it will handle the rollback automatically

## Cost Considerations

- All tools are open source (MIT/Apache)
- No additional CI costs (same GitHub Actions usage)
- Potential reduction in CI runtime due to unified workflow
