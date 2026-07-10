import type { Change, WorkspaceInfo, ActivityItem, SpecFile, ValidationOutput } from "@/types";

export const MOCK_WORKSPACE: WorkspaceInfo = {
  path: "D:/specboard",
  isValid: true,
  profile: "core",
  changesCount: 1,
  archivedCount: 3,
};

export const MOCK_CHANGES: Change[] = [
  {
    id: "automated-releases-with-conventional-commits",
    name: "Automated Releases with Conventional Commits",
    status: "active",
    schema: "spec-driven",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/proposal.md", lastModified: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "specs", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/specs/", lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "design", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/design.md", lastModified: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "tasks", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/tasks.md", lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    tasksTotal: 27,
    tasksCompleted: 19,
    column: "validated",
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "proposal",
    action: "created",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "specs",
    action: "created",
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "design",
    action: "created",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "tasks",
    action: "created",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "tasks",
    action: "updated",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "design",
    action: "validated",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "Automated Releases with Conventional Commits",
    artifactName: "specs",
    action: "validated",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_SPEC_TREE: SpecFile[] = [
  {
    name: "architecture",
    path: "/openspec/specs/architecture",
    isDirectory: true,
    children: [
      { name: "api-design.md", path: "/openspec/specs/architecture/api-design.md", isDirectory: false, lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "system-overview.md", path: "/openspec/specs/architecture/system-overview.md", isDirectory: false, lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "design-token-integration",
    path: "/openspec/specs/design-token-integration",
    isDirectory: true,
    children: [
      { name: "spec.md", path: "/openspec/specs/design-token-integration/spec.md", isDirectory: false, lastModified: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "download-page",
    path: "/openspec/specs/download-page",
    isDirectory: true,
    children: [
      { name: "spec.md", path: "/openspec/specs/download-page/spec.md", isDirectory: false, lastModified: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "features",
    path: "/openspec/specs/features",
    isDirectory: true,
    children: [
      { name: "auth.md", path: "/openspec/specs/features/auth.md", isDirectory: false, lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "dashboard.md", path: "/openspec/specs/features/dashboard.md", isDirectory: false, lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "github-actions-release",
    path: "/openspec/specs/github-actions-release",
    isDirectory: true,
    children: [
      { name: "spec.md", path: "/openspec/specs/github-actions-release/spec.md", isDirectory: false, lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "npm-binary-wrapper",
    path: "/openspec/specs/npm-binary-wrapper",
    isDirectory: true,
    children: [
      { name: "spec.md", path: "/openspec/specs/npm-binary-wrapper/spec.md", isDirectory: false, lastModified: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    name: "shadcn-component-library",
    path: "/openspec/specs/shadcn-component-library",
    isDirectory: true,
    children: [
      { name: "spec.md", path: "/openspec/specs/shadcn-component-library/spec.md", isDirectory: false, lastModified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

export const MOCK_ARTIFACT_CONTENT: Record<string, string> = {
  "automated-releases-with-conventional-commits/proposal.md": `## Why

Currently, creating a release requires manual steps: update version numbers in multiple files, create a Git tag, and push it. This is error-prone and inconsistent. Developers often forget to bump versions or create tags with wrong formats. By automating the release process based on conventional commits, we can eliminate manual version management and ensure consistent, semantic versioning that follows the project's commit history automatically.

## What Changes

- **Add semantic-release workflow** — New GitHub Actions workflow that analyzes conventional commits on every push to \`main\`
- **Automatic version bumping** — Detects \`feat:\`, \`fix:\`, and \`BREAKING CHANGE:\` commits to determine next version (minor, patch, major)
- **Automatic Git tag creation** — Creates and pushes version tags (\`v*\`) automatically when version changes
- **Updated release.yml** — Modify existing workflow to trigger on both tags AND semantic-release generated tags
- **Conventional commit enforcement** — Add commitlint to ensure all commits follow the conventional format
- **Automatic changelog generation** — Generate CHANGELOG.md from commit history

## Capabilities

### New Capabilities

- \`semantic-release-automation\`: GitHub Actions workflow that automatically detects version changes from conventional commits, bumps version in all necessary files (package.json, Cargo.toml, tauri.conf.json), creates Git tags, and triggers the Tauri build workflow.

- \`conventional-commit-enforcement\`: commitlint configuration and CI check that ensures all commits follow the conventional commit format (\`feat:\`, \`fix:\`, \`chore:\`, \`docs:\`, etc.)

- \`auto-changelog-generation\`: Automatic generation of CHANGELOG.md following the Keep a Changelog format based on conventional commit history.

### Modified Capabilities

- \`github-actions-release\`: **MODIFIED** — Workflow trigger conditions expanded to support both manual tags and semantic-release generated tags. Adds version synchronization across multiple files before build.

## Impact

- **CI/CD**: New \`.github/workflows/semantic-release.yml\` file; modifications to existing \`release.yml\`
- **Developer workflow**: All commits must now follow conventional commit format
- **Version management**: No more manual version bumps — fully automated
- **Git history**: Cleaner, standardized commit messages
- **Release process**: Push to \`main\` → automatic analysis → automatic tag → automatic build → GitHub Release
- **Documentation**: New CHANGELOG.md auto-generated
- **No breaking changes** to the application itself — only the release process changes
`,

  "automated-releases-with-conventional-commits/specs.md": `# Specs: Automated Releases

## semantic-release-automation

### Requirement: Workflow triggers on push to main
The release workflow MUST trigger automatically when commits are pushed to the main branch.

**Scenario: Push to main triggers analysis**
- Given commits exist on main
- When push occurs
- Then semantic-release analyzes commit history

### Requirement: Version bump follows conventional commits
- \`feat:\` → minor version bump
- \`fix:\` → patch version bump
- \`BREAKING CHANGE:\` → major version bump

## conventional-commit-enforcement

### Requirement: Validate commit messages on PRs
PRs MUST be blocked if any commit message does not follow the conventional commit format.

**Allowed types:** feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
**Allowed scopes:** ui, core, ci, docs, api, store, tauri

## auto-changelog-generation

### Requirement: Categorize changes by type
- \`feat\` → **Added**
- \`fix\` → **Fixed**
- \`BREAKING CHANGE\` → **Changed**
- \`perf\` → **Performance**
- \`refactor\` → **Refactored**
`,

  "automated-releases-with-conventional-commits/design.md": `## Context

Currently, the release process for Specboard requires several manual steps that are error-prone and inconsistent across team members. The developer must:

1. Manually update version numbers in \`package.json\`, \`src-tauri/Cargo.toml\`, and \`src-tauri/tauri.conf.json\`
2. Create a Git tag with the correct format (\`v*\`)
3. Push the tag to trigger the GitHub Actions workflow
4. Hope they didn't forget any version file or use the wrong version format

This manual process often leads to:
- Version inconsistencies between files
- Forgotten version bumps
- Inconsistent tag formats
- Unclear when to bump major/minor/patch

## Goals / Non-Goals

**Goals:**
- Automatically detect version changes from conventional commits on every push to \`main\`
- Automatically bump version in all required files (\`package.json\`, \`Cargo.toml\`, \`tauri.conf.json\`)
- Automatically create and push Git tags (\`v*\`) when version changes
- Enforce conventional commit format on all commits to \`main\`
- Generate CHANGELOG.md automatically from commit history
- Support manual workflow dispatch for edge cases

**Non-Goals:**
- Automatic publishing to npm (manual approval still required)
- Automatic deployment of download page (manual approval still required)
- Enforcing conventional commits on feature branches (only \`main\`)
- Auto-merging PRs (out of scope)

## Decisions

### 1. Use \`semantic-release\` with custom configuration
\`semantic-release\` is the industry standard for semantic versioning automation. Full control over the release process.

### 2. Use \`@semantic-release/exec\` for multi-file version sync
A custom script \`scripts/deploy/sync-versions.js\` updates Cargo.toml and tauri.conf.json when semantic-release bumps package.json.

### 3. Workflow trigger strategy: push to main
Trigger on push to main, NOT on tags. semantic-release creates the tag after analysis.

### 4. Commitlint enforcement via CI
A separate CI job runs commitlint on PRs. Blocks merge if format invalid.

### 5. Changelog format — Keep a Changelog
Follows https://keepachangelog.com with sections: Added, Changed, Deprecated, Removed, Fixed, Security.
`,

  "automated-releases-with-conventional-commits/tasks.md": `## 1. Setup & Configuration

- [x] 1.1 Install semantic-release dependencies: \`npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/exec @semantic-release/git\`
- [x] 1.2 Create \`.releaserc.js\` configuration file with plugins for changelog, exec, git, and github
- [x] 1.3 Create \`scripts/sync-versions.js\` to update \`Cargo.toml\` and \`tauri.conf.json\` from \`package.json\`
- [x] 1.4 Add commitlint dependencies: \`npm install --save-dev @commitlint/config-conventional @commitlint/cli\`
- [x] 1.5 Create \`.commitlintrc.js\` configuration with conventional commit rules
- [x] 1.6 Create \`CONTRIBUTING.md\` documenting conventional commit format and examples

## 2. GitHub Actions Workflows

- [x] 2.1 Create \`.github/workflows/commitlint.yml\` to validate commits on PRs and pushes to main
- [x] 2.2 Create \`.github/workflows/semantic-release.yml\` triggered on push to main
- [x] 2.3 Add \`[skip ci]\` filter to semantic-release workflow to prevent infinite loops
- [x] 2.4 Update existing \`.github/workflows/release.yml\` to support both manual and auto-generated tags
- [ ] 2.5 Test workflow syntax with \`act\` or push to feature branch

## 3. Version Synchronization

- [x] 3.1 Implement \`scripts/sync-versions.js\` to read version from args and update \`Cargo.toml\`
- [x] 3.2 Implement version update logic for \`tauri.conf.json\` (JSON manipulation)
- [x] 3.3 Test sync script locally: \`node scripts/sync-versions.js 1.2.3\`
- [x] 3.4 Verify all three files have consistent versions after script runs
- [x] 3.5 Add error handling to sync script (file not found, invalid version format)

## 4. Testing & Validation

- [ ] 4.1 Create test commits following conventional format and verify commitlint passes
- [ ] 4.2 Create intentionally bad commits and verify commitlint fails with clear errors
- [ ] 4.3 Run semantic-release in dry-run mode: \`npx semantic-release --dry-run\`
- [ ] 4.4 Verify semantic-release correctly analyzes commits and suggests next version
- [ ] 4.5 Test the complete flow on a test branch with fake commits
- [ ] 4.6 Verify \`[skip ci]\` commit message prevents workflow trigger

## 5. Documentation & Rollout

- [x] 5.1 Update \`README.md\` with new automated release process (replace manual steps)
- [x] 5.2 Update \`RELEASE.md\` with semantic-release workflow documentation
- [x] 5.3 Add commit message guidelines to developer documentation
- [ ] 5.4 Notify team about new conventional commit requirement
- [ ] 5.5 Enable branch protection requiring commitlint check to pass on PRs
- [ ] 5.6 Monitor first automated release for issues

## 6. Monitoring & Cleanup

- [ ] 6.1 Verify CHANGELOG.md is generated correctly on first release
- [ ] 6.2 Check that GitHub Releases include proper release notes
- [ ] 6.3 Confirm version tags are created with correct format (\`v*\`)
- [ ] 6.4 Verify infinite loop protection works (no duplicate releases)
- [ ] 6.5 Remove any test tags and releases created during testing
`,
};

export const MOCK_VALIDATION_RESULT: ValidationOutput = {
  version: "1.0.0",
  results: {
    changes: [
      {
        name: "automated-releases-with-conventional-commits",
        valid: true,
        warnings: [
          "tasks.md: 8 tasks remaining — consider completing before archive",
        ],
        checks: [
          { file: "proposal.md", valid: true, warnings: [], errors: [] },
          { file: "design.md", valid: true, warnings: [], errors: [] },
          { file: "tasks.md", valid: true, warnings: ["8 tasks remaining"], errors: [] },
        ],
      },
    ],
  },
  summary: {
    total: 3,
    valid: 3,
    invalid: 0,
  },
};

export const MOCK_VALIDATION_RESULT_WITH_ERRORS: ValidationOutput = {
  version: "1.0.0",
  results: {
    changes: [
      {
        name: "example-change",
        valid: false,
        warnings: [],
        errors: [
          "proposal.md: missing 'Capabilities' section",
          "specs/example/spec.md: requirement has no scenario",
        ],
        checks: [
          { file: "proposal.md", valid: false, warnings: [], errors: ["missing 'Capabilities' section"] },
          { file: "specs/example/spec.md", valid: false, warnings: [], errors: ["requirement has no scenario"] },
        ],
      },
    ],
  },
  summary: {
    total: 2,
    valid: 0,
    invalid: 2,
  },
};
