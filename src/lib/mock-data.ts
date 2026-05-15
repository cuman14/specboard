import type { Change, WorkspaceInfo, ActivityItem, SpecFile } from "@/types";

export const MOCK_WORKSPACE: WorkspaceInfo = {
  path: "D:/specboard",
  isValid: true,
  profile: "core",
  changesCount: 2,
  archivedCount: 2,
};

export const MOCK_CHANGES: Change[] = [
  {
    id: "automated-releases-with-conventional-commits",
    name: "automated-releases-with-conventional-commits",
    status: "active",
    schema: "spec-driven",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/proposal.md", lastModified: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "specs", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/specs.md", lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "design", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/design.md", lastModified: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "tasks", status: "ready", path: "/openspec/changes/automated-releases-with-conventional-commits/tasks.md", lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    tasksTotal: 18,
    tasksCompleted: 12,
    column: "in-review",
  },
  {
    id: "migrate-to-shadcn-ui",
    name: "migrate-to-shadcn-ui",
    status: "active",
    schema: "spec-driven",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    artifacts: [
      { name: "proposal", status: "ready", path: "/openspec/changes/migrate-to-shadcn-ui/proposal.md", lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { name: "specs", status: "ready", path: "/openspec/changes/migrate-to-shadcn-ui/specs.md", lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { name: "design", status: "pending", path: "/openspec/changes/migrate-to-shadcn-ui/design.md" },
      { name: "tasks", status: "pending", path: "/openspec/changes/migrate-to-shadcn-ui/tasks.md" },
    ],
    tasksTotal: 11,
    tasksCompleted: 3,
    column: "draft",
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    changeId: "migrate-to-shadcn-ui",
    changeName: "migrate-to-shadcn-ui",
    artifactName: "proposal",
    action: "created",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    changeId: "migrate-to-shadcn-ui",
    changeName: "migrate-to-shadcn-ui",
    artifactName: "specs",
    action: "created",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "automated-releases-with-conventional-commits",
    artifactName: "tasks",
    action: "updated",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "automated-releases-with-conventional-commits",
    artifactName: "design",
    action: "validated",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    changeId: "automated-releases-with-conventional-commits",
    changeName: "automated-releases-with-conventional-commits",
    artifactName: "specs",
    action: "updated",
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
];

export const MOCK_ARTIFACT_CONTENT: Record<string, string> = {
  "automated-releases-with-conventional-commits/proposal.md": `# Proposal: Automated Releases with Conventional Commits

## Summary
Automate the release process using conventional commits, semantic versioning, and auto-generated changelogs.

## Motivation
Manual releases are error-prone and time-consuming. Version bumps across package.json, Cargo.toml, and tauri.conf.json must stay in sync.

## Approach
- Enforce conventional commit format via CI (commitlint)
- Use semantic-release to analyze commits and determine version bump
- Sync versions across all config files via \`@semantic-release/exec\`
- Auto-generate changelog in "Keep a Changelog" format
- Create GitHub Release with full changelog body

## New Capabilities
- \`semantic-release-automation\` — workflow triggers on push to main
- \`conventional-commit-enforcement\` — PR and main branch validation
- \`auto-changelog-generation\` — categorized changelog with compare links

## Success Criteria
- [ ] Push to main triggers automatic version analysis
- [ ] Version bumped correctly in package.json, Cargo.toml, tauri.conf.json
- [ ] Git tag created and pushed automatically
- [ ] GitHub Release created with full changelog body
- [ ] No infinite release loops (chore commits excluded)
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

  "automated-releases-with-conventional-commits/design.md": `# Design: Automated Releases

## Decision 1: Use semantic-release with custom configuration
semantic-release provides the core automation pipeline. We configure it via \`.releaserc.json\`.

## Decision 2: Use @semantic-release/exec for multi-file version sync
A custom script \`scripts/deploy/sync-versions.js\` updates Cargo.toml and tauri.conf.json when semantic-release bumps package.json.

## Decision 3: Workflow trigger strategy
Trigger on push to main, NOT on tags. semantic-release creates the tag after analysis.

## Decision 4: Commitlint enforcement via CI
A separate CI job runs commitlint on PRs. Blocks merge if format invalid.

## Decision 5: Changelog format — Keep a Changelog
Follows https://keepachangelog.com with sections: Added, Changed, Deprecated, Removed, Fixed, Security.

## Migration Plan
| Phase | Action |
|-------|--------|
| 1 | Add commitlint CI, \`.releaserc.json\`, sync-versions script |
| 2 | Update release.yml to use semantic-release output |
| 3 | Remove manual version bumping from workflow |
`,

  "automated-releases-with-conventional-commits/tasks.md": `# Tasks: Automated Releases

## 1. Setup & Configuration
- [x] Install commitlint, semantic-release, and plugins
- [x] Create \`.releaserc.json\` with custom configuration
- [x] Create \`scripts/deploy/sync-versions.js\` for version sync
- [x] Add commitlint config to package.json

## 2. CI Workflow Updates
- [x] Add commitlint job to PR checks
- [x] Update release.yml to trigger on push to main
- [x] Configure semantic-release step with RELEASE_TOKEN
- [x] Remove manual version bump logic

## 3. Build Job Integration
- [x] Build job depends on release job
- [x] Checkout the exact tag created by semantic-release
- [x] Upload SHA256 as artifact for manifest updates

## 4. Testing & Validation
- [ ] Test release flow on a feature branch
- [ ] Verify version sync across all 3 files
- [ ] Confirm no infinite loop from changelog commit

## 5. Documentation
- [ ] Update AGENTS.md with release workflow rules
- [ ] Document conventional commit format in CONTRIBUTING.md

## 6. Monitoring
- [ ] Add workflow status badge to README
- [ ] Set up Slack notification on release failure
`,

  "migrate-to-shadcn-ui/proposal.md": `# Proposal: Migrate to shadcn/ui Components

## Summary
Replace raw Tailwind/Radix implementations with shadcn/ui component primitives for improved consistency, accessibility, and maintainability.

## Motivation
Current UI uses scattered Tailwind utility classes with manual Radix integration. shadcn/ui provides a consistent component API while keeping full control over styling.

## Components to Add
- Button (all variants: default, destructive, outline, secondary, ghost, link)
- Badge (default, secondary, destructive, outline)
- Progress (for task completion bars)
- Tabs (artifact tab navigation)
- Input (workspace path, search)
- Card (stat cards, change cards)
- ScrollArea (sidebar content)
- Separator (section dividers)
- Tooltip (icon labels)
- Collapsible (spec file tree)

## Success Criteria
- [ ] All pages use shadcn primitives instead of raw Radix
- [ ] Dark mode palette preserved exactly
- [ ] No visual redesign or layout changes
- [ ] Keyboard navigation and ARIA attributes intact
- [ ] Zero TypeScript/build errors after migration
`,

  "migrate-to-shadcn-ui/specs.md": `# Specs: shadcn/ui Migration

## shadcn-component-library

### Requirement: Button component
All action buttons MUST use the shadcn Button primitive with appropriate variant.

**Variants used:**
- \`default\` — primary actions (Browse folder, Validate, Archive)
- \`outline\` — secondary actions (recent workspace buttons, sync)
- \`ghost\` — utility bar icons, tab triggers
- \`destructive\` — delete/cancel actions

### Requirement: Tabs component
Artifact navigation MUST use shadcn Tabs with bottom-border indicator pattern.

### Requirement: Progress component
Task completion bars MUST use shadcn Progress with indigo fill.

## design-token-integration

### Requirement: CSS variable design token system
All colors MUST be defined as CSS variables in \`@theme\` block for Tailwind v4.

**Required tokens:**
- \`--background\`, \`--foreground\`
- \`--card\`, \`--card-foreground\`
- \`--primary\`, \`--primary-foreground\`
- \`--muted\`, \`--muted-foreground\`
- \`--border\`, \`--input\`, \`--ring\`
`,

  "migrate-to-shadcn-ui/design.md": `# Design: shadcn/ui Migration

## Decision 1: Use shadcn/ui CLI for component generation
Initialize with \`pnpm dlx shadcn@latest init\` and add components individually.

## Decision 2: Map CSS variables to existing Specboard tokens
| shadcn Token | Specboard Value |
|--------------|-----------------|
| --background | #0b1326 |
| --card | #171f33 |
| --primary | #6366f1 |
| --foreground | #dae2fd |
| --muted-foreground | #908fa0 |
| --border | #464554 |

## Decision 3: Migrate file-by-file, not all-at-once
Start with OnboardingPage (simplest), progress to complex pages.

## Decision 4: Keep existing cn() utility
The cn() helper from clsx + tailwind-merge is already correct.

## Migration Order
1. OnboardingPage
2. ChangesDashboard
3. ChangeDetail
4. KanbanPage
5. SpecsExplorer
6. Layout components (UtilityBar, Sidebar)
7. Shared components (TasksView)
`,

  "migrate-to-shadcn-ui/tasks.md": `# Tasks: shadcn/ui Migration

## 1. Git Setup
- [ ] Create branch \`migrate-to-shadcn-ui\`

## 2. Setup & Configuration
- [ ] Initialize shadcn/ui with \`pnpm dlx shadcn@latest init\`
- [ ] Configure components.json with tailwindcss v4 settings
- [ ] Add CSS variables to \`@theme\` block in index.css

## 3. Add shadcn/ui Components
- [ ] Button
- [ ] Badge
- [ ] Progress
- [ ] Tabs
- [ ] Input
- [ ] Card
- [ ] ScrollArea
- [ ] Separator
- [ ] Tooltip
- [ ] Collapsible

## 4. Migrate OnboardingPage
- [ ] Replace form with shadcn Input + Button
- [ ] Wrap in Card component

## 5. Migrate ChangesDashboard
- [ ] Stat cards → Card
- [ ] Status badges → Badge
- [ ] Header buttons → Button variants

## 6. Migrate ChangeDetail
- [ ] Artifact tabs → Tabs component
- [ ] Validation buttons → Button variants
- [ ] Task progress → Progress component

## 7. Migrate KanbanPage
- [ ] Column headers → Card
- [ ] Status indicators → Badge

## 8. Migrate SpecsExplorer
- [ ] File tree → Collapsible
- [ ] Browse button → Button

## 9. Migrate Layout Components
- [ ] Utility bar → Tooltip provider
- [ ] Sidebar → ScrollArea + Separator

## 10. Migrate TasksView
- [ ] Progress bars → Progress component
- [ ] Task items → Card

## 11. Cleanup & Verification
- [ ] Remove unused Radix imports
- [ ] Run \`pnpm build\` — zero errors
- [ ] Test keyboard navigation
- [ ] Verify dark mode colors match
`,
};
