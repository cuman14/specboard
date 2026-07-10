# Specboard — AI Agent Context

> **Read this file first.** It gives you full context to work on this project without asking repeated questions.

## What is Specboard?

Specboard is a **desktop GUI application** built with Tauri 2 + React 19 + TypeScript that provides a visual interface for **OpenSpec** or any framework spec — a Spec-Driven Development (SDD) framework for AI coding assistants. It lets developers manage OpenSpec changes, artifacts and specs without touching the terminal.

OpenSpec lives at: `<project-root>/openspec/` with this structure:

```
openspec/
  changes/
    <change-name>/
      proposal.md
      specs.md
      design.md
      tasks.md
  specs/           # accumulated project specs
  archive/         # completed changes
  config.json      # profile: core | expanded
  schemas/         # schema definitions
```

Specboard reads this structure, runs `openspec <command> --json` as subprocesses via Tauri IPC, and watches the filesystem for real-time updates.

---

## Tech Stack

| Layer           | Technology             | Notes                            |
| --------------- | ---------------------- | -------------------------------- |
| Desktop shell   | Tauri 2                | Rust backend, WebView2 frontend  |
| UI Framework    | React 19 + TypeScript  | Hooks-first, no class components |
| Styling         | Tailwind CSS v4        | CSS vars for design tokens       |
| Components      | shadcn/ui (Radix UI)   | Copy-paste, fully owned          |
| State           | Zustand                | Global stores, no Redux          |
| Routing         | React Router v7        | Client-side SPA inside Tauri     |
| Drag & Drop     | @dnd-kit               | Kanban board                     |
| Icons           | Lucide React           | Thin-stroke, consistent          |
| Fonts           | Inter + JetBrains Mono | Inter=UI, JBMono=code/metadata   |
| Package manager | pnpm                   | NOT npm or yarn                  |

---

## Project Structure

```
specboard/
├── agents.md                    # This file
├── DESIGN.md                    # Design system reference
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Router provider
│   ├── router.tsx               # Route definitions
│   ├── index.css                # Tailwind + CSS variables
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx    # 48px utility bar + 240px sidebar + workspace
│   │   │   ├── UtilityBar.tsx   # Vertical icon nav rail
│   │   │   └── Sidebar.tsx      # Contextual secondary nav / tree
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── KanbanCard.tsx   # React.memo applied here
│   │   ├── changes/
│   │   │   ├── ChangeCard.tsx
│   │   │   ├── ArtifactTabs.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── specs/
│   │   │   ├── FileTree.tsx
│   │   │   └── SpecViewer.tsx
│   │   └── ui/                  # shadcn/ui generated components
│   ├── pages/
│   │   ├── OnboardingPage.tsx
│   │   ├── ChangesDashboard.tsx
│   │   ├── ChangeDetail.tsx
│   │   ├── KanbanPage.tsx
│   │   └── SpecsExplorer.tsx
│   ├── store/
│   │   ├── workspace.store.ts   # useWorkspaceStore
│   │   ├── changes.store.ts     # useChangesStore
│   │   └── kanban.store.ts      # useKanbanStore
│   ├── hooks/
│   │   ├── useWorkspace.ts      # Custom hook wrapping workspace store
│   │   ├── useChanges.ts        # Custom hook wrapping changes store
│   │   └── useTauriEvent.ts     # useEffect wrapper for Tauri events
│   ├── lib/
│   │   ├── tauri-commands.ts    # Typed wrappers around invoke()
│   │   ├── mock-data.ts         # Fake OpenSpec data for UI dev
│   │   └── utils.ts             # cn(), formatDate(), etc.
│   └── types/
│       └── index.ts             # All shared TypeScript interfaces
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   └── commands.rs          # All Tauri IPC commands
│   └── tauri.conf.json
└── package.json
```

---

## TypeScript Types

```typescript
// src/types/index.ts

export type ArtifactStatus = "missing" | "pending" | "ready" | "blocked";
export type ChangeStatus = "active" | "complete" | "archived";
export type KanbanColumn = "draft" | "in-review" | "validated";

export interface Artifact {
  name: "proposal" | "specs" | "design" | "tasks";
  status: ArtifactStatus;
  path: string;
  lastModified?: string;
}

export interface Change {
  id: string; // folder name under openspec/changes/
  name: string;
  status: ChangeStatus;
  schema: string;
  createdAt: string;
  artifacts: Artifact[];
  tasksTotal: number;
  tasksCompleted: number;
  column: KanbanColumn;
}

export interface WorkspaceInfo {
  path: string;
  isValid: boolean; // has openspec/ directory
  profile: "core" | "expanded";
  changesCount: number;
  archivedCount: number;
}

export interface SpecFile {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: SpecFile[];
  lastModified?: string;
}
```

---

## Tauri IPC Contract

All commands are in `src-tauri/src/commands.rs` and typed in `src/lib/tauri-commands.ts`.

| Command                | Input                             | Output                          | Description                                        |
| ---------------------- | --------------------------------- | ------------------------------- | -------------------------------------------------- |
| `open_folder_dialog`   | —                                 | `string \| null`                | Native OS folder picker                            |
| `read_workspace`       | `{ path: string }`                | `WorkspaceInfo + Change[]`      | Scan openspec/ structure                           |
| `read_artifact`        | `{ path: string }`                | `string`                        | Read .md file content                              |
| `run_openspec_command` | `{ cmd: string, args: string[] }` | `{ stdout, stderr, exit_code }` | Run openspec CLI subprocess                        |
| `watch_workspace`      | `{ path: string }`                | —                               | Start FS watcher, emits `workspace-changed` events |
| `stop_watching`        | —                                 | —                               | Stop FS watcher                                    |

---

## React Patterns Used (Learning Reference)

| Pattern                    | File                   | Why                                     |
| -------------------------- | ---------------------- | --------------------------------------- |
| `useState` controlled form | `OnboardingPage.tsx`   | Workspace path input                    |
| `useEffect` + cleanup      | `useTauriEvent.ts`     | Subscribe/unsubscribe Tauri events      |
| Lifting state up           | `KanbanBoard.tsx`      | Active drag state shared across columns |
| `useMemo`                  | `ChangesDashboard.tsx` | Filtered + sorted change list           |
| `React.memo`               | `KanbanCard.tsx`       | Prevent re-renders during drag          |
| `useCallback`              | `KanbanBoard.tsx`      | Stable onDragEnd callback               |
| Custom hooks               | `hooks/` folder        | Encapsulate store + IPC logic           |
| Zustand                    | `store/` folder        | Global state without prop drilling      |
| Optimistic UI              | `kanban.store.ts`      | Move card instantly, rollback on error  |
| `React.lazy` + `Suspense`  | `router.tsx`           | Code splitting per route                |

---

## OpenSpec CLI Commands

```bash
openspec new <name> [--schema <schema>]   # Create new change
openspec list --json                       # List all changes as JSON
openspec status --change <name> --json    # Status of a change
openspec validate [--change <name>] --json # Validate artifacts
openspec archive --change <name>          # Archive a completed change
openspec instructions --change <name>     # Show next artifact instructions
```

Expected JSON output shapes are in `src/lib/tauri-commands.ts`.

---

## Design System

See `DESIGN.md` for full reference. Quick summary:

- Background: `#0b1326` | Surface: `#171f33` | Surface high: `#222a3d`
- Primary: `#6366f1` (Indigo) | Secondary: `#0ea5e9` (Sky)
- Text: `#dae2fd` | Muted: `#c7c4d7` | Border: `#464554`
- Radius: `4px` standard | Fonts: Inter + JetBrains Mono
- Dark mode only in Fase 1

---

## Deployment & Versioning

**Current stack:**

- **Release-it** - Automated versioning based on conventional commits
- **@release-it/conventional-changelog** - Changelog generation from conventional commits
- **GitHub Actions** - Unified release workflow with three jobs
- **Custom scripts** - `scripts/deploy/sync-versions.js`, `scripts/deploy/update-sha256.js`
- **Package managers** - Scoop, Homebrew, Flatpak

**Release Workflow (.github/workflows/release.yml):**

The workflow has three jobs:

1. **Job 1 - release (Version & tag):**
   - Runs only if commit is NOT from release bot (`chore(release)`)
   - release-it analyzes commits since last tag
   - Bumps version in package.json, Cargo.toml, tauri.conf.json
   - Updates CHANGELOG.md
   - Creates git tag and publishes GitHub Release (empty)
   - Outputs: `tag` and `released` flags

2. **Job 2 - build (Build binaries):**
   - Depends on release job (only runs if released=true)
   - Matrix of 3 runners: Windows, macOS, Linux
   - Each runner checks out the exact tag (not main)
   - Builds Tauri app with tauri-action
   - Calculates SHA256 of installer
   - Uploads SHA256 as artifact (`sha256.env` format)

3. **Job 3 - update-manifests (Update SHA256 in manifests):**
   - Depends on both release and build jobs
   - Downloads SHA256 artifacts from all platforms
   - Runs `scripts/deploy/update-sha256.js` to update scoop/specboard.json and Casks/specboard.rb
   - Commits and pushes changes with `[skip ci]` to prevent infinite loop

**Important rules:**

- Use `@release-it/conventional-changelog` NOT `@release-it-plugins/lerna-changelog`
- Scripts read version from package.json (no command line arguments)
- SHA256 calculated from CI artifacts (not downloaded from internet)
- Update manifests commit uses `[skip ci]` to prevent release loop
- Release job uses `RELEASE_TOKEN` secret for git operations
- Build job uses `GITHUB_TOKEN` for GitHub Release assets
- Git push uses simple format without refspec to avoid push failures
- Use HEAD:main reference instead of bare main for git operations
- `pnpm release-it --ci` works without a package.json script entry — pnpm v9+ falls back to `pnpm exec` when no matching script is found
- tauri-action does NOT set `releaseBody` — release-it's generated changelog must be preserved in GitHub Releases
- pnpm is pinned to `@9` in CI (not `@latest`) to avoid breaking changes
- Linux build runner uses `ubuntu-24.04` (not `ubuntu-22.04`)
- Homebrew SHA256/URL updates in `update-sha256.js` target the `on_arm` block specifically (not first match)
- `pnpm-workspace.yaml` MUST include `packages` field (required by pnpm)
- `scripts/deploy/` is the single location for all deployment-related scripts

**pnpm security (.npmrc):**

- `strict-peer-dependencies=true` — fail on unmet peer dependencies
- `prefer-frozen-lockfile=true` — prevent silent lockfile modifications
- `save-exact=true` — pin exact versions (no `^` or `~`)
- `side-effects-cache=false` — disable side-effects cache to prevent cache poisoning
- `node-linker=isolated` was removed — it broke `@tailwindcss/vite` resolution of `tailwindcss-animate`
- CI runs `pnpm audit --prod --audit-level=moderate` on every release

**Release pipeline decisions:**

| Decision                                                     | Reason                                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| No `releaseBody` in tauri-action                             | Preserves release-it's full changelog in GitHub Releases                                          |
| `ubuntu-24.04` over `ubuntu-22.04`                           | LTS 2022 is aging; 2024 is current                                                                |
| pnpm pinned to `@9`                                          | Prevents unexpected breaking changes from latest                                                  |
| Homebrew regex scoped to `on_arm`                            | Prevents matching wrong `sha256` entries if bottle block is added                                 |
| `scripts/deploy/` consolidation                              | All deploy scripts in one place; no dead code at root                                             |
| Deploy scripts use `path.resolve(__dirname, "../..")`        | Scripts moved from `scripts/` to `scripts/deploy/`, so root is two levels up                      |
| `pnpm-workspace.yaml` MUST include `packages` field          | pnpm fails with "packages field missing or empty" without it                                      |
| `pnpm-lock.yaml` must be regenerated after workspace changes | CI fails with `ERR_PNPM_OUTDATED_LOCKFILE` if lockfile doesn't match workspace package.json files |
| `pnpm audit` in CI                                           | Catches known vulnerabilities before release                                                      |
| No `minimumReleaseAge` equivalent                            | pnpm has no native property for this; supply chain age checks require external tooling            |

**Note:** When modifying deployment/versioning infrastructure, always consult AGENTS.md first for the current workflow rules.

---

## Fase 1 Scope (MVP)

**In scope:**

- Open workspace folder + detect `openspec/` structure
- Dashboard: change cards, summary stats, activity feed
- Change detail: artifact tabs (Proposal/Specs/Design/Tasks), validate, archive
- Kanban board: drag-and-drop columns (Draft/In Review/Validated)
- Specs explorer: file tree + markdown viewer (read-only)
- File watcher: auto-refresh on FS changes
- Mock data mode: UI works without OpenSpec CLI

**Deferred (Fase 2+):**

- Markdown editor
- Integrated terminal
- Metrics dashboard
- Spec delta comparator
- Multi-project support
- Git integration

---

## Known Issues & Rules

> **Always follow these rules to avoid regressions.**

### No scripts when functionality already exists

Before creating a new script, check if pnpm, Node.js, or an existing tool already provides the needed functionality. Examples:

- **Don't create** a script to check dependency age — pnpm has no native `minimumReleaseAge` property, but `pnpm audit` covers vulnerability scanning
- **Don't create** a script to list files — use `ls`, `Get-ChildItem`, or `glob` patterns
- **Don't create** a script to run a CLI tool — use `pnpm exec <tool>` directly

If unsure whether to create a script, **ask first**. The goal is to avoid accumulating dead or redundant scripts like `update-sha256-from-artifacts.js` (which was created but never used).

### Icon `icon.ico` is required for Windows builds

Tauri always requires `src-tauri/icons/icon.ico` even in dev mode (`bundle.active: false`). If deleted, rebuild with:

```powershell
# Run from d:\specboard
powershell -ExecutionPolicy Bypass -File make_icon.ps1
```

The script creates a valid 32x32 indigo ICO using .NET `System.Drawing`.

### No mock data in production pages

- `kanban.store.ts` must start **empty** (`buildColumns([])`), never with `MOCK_CHANGES`
- `SpecsExplorer.tsx` must NOT fall back to `MOCK_SPEC_TREE` — show empty state instead
- `ChangesDashboard.tsx` and `KanbanPage.tsx` must load from real workspace via Tauri IPC

### No hardcoded hex colors in components

All colors MUST use Tailwind CSS utility classes that reference the design tokens defined in `src/index.css`. Never hardcode hex values like `bg-[#0b1326]` or `text-[#908fa0]`.

**Available color tokens** (defined in `@theme` block):

| Token                             | Value     | Usage                            |
| --------------------------------- | --------- | -------------------------------- |
| `bg` / `background`               | `#0b1326` | Page background                  |
| `surface` / `card`                | `#171f33` | Card/surface backgrounds         |
| `surface-high` / `accent`         | `#222a3d` | Elevated surfaces, active states |
| `surface-highest`                 | `#2d3449` | Highest elevation                |
| `primary`                         | `#6366f1` | Primary actions, links           |
| `primary-dim`                     | `#4f46e5` | Primary hover                    |
| `secondary`                       | `#0ea5e9` | Secondary actions                |
| `text` / `foreground`             | `#dae2fd` | Primary text                     |
| `text-muted` / `muted-foreground` | `#908fa0` | Secondary text, labels           |
| `text-subtle`                     | `#c7c4d7` | Tertiary text                    |
| `border`                          | `#464554` | Borders, dividers                |
| `border-subtle`                   | `#2d3449` | Subtle borders                   |
| `success`                         | `#22c55e` | Success states                   |
| `warning`                         | `#f59e0b` | Warning states                   |
| `error` / `destructive`           | `#ef4444` | Error states                     |

**Correct**: `bg-surface text-text border-border`
**Incorrect**: `bg-[#171f33] text-[#dae2fd] border-[#464554]`

### Kanban must sync from ChangesStore

`KanbanPage` must call `loadFromChanges(realChanges)` in a `useEffect` watching `useChangesStore(s => s.changes)`. Otherwise it shows stale mock data.

### `archive` folder is NOT a change (but counts as archived)

`openspec/changes/archive/` contains completed changes with structure `<date-name>/` (e.g. `2026-04-05-heat-confirmation-step-2/`). Each has `proposal.md`, `design.md`, `tasks.md`, `specs/`, `.openspec.yaml` inside.

- Skip it in the active changes list
- Count its subdirectories for `archivedCount`
- `archived_count` reads from `changes_path.join("archive")`, NOT `openspec/archive/`

### Empty change folders must be hidden

Folders inside `openspec/changes/` with no `.md` or `.yaml` files are skipped in `read_workspace`. Filter applied in `commands.rs`.

### Status is computed from task completion

`read_workspace` in `commands.rs` determines change status by counting tasks:
- `tasks_total > 0 && tasks_completed >= tasks_total` → `"complete"`
- Otherwise → `"active"`

This matches the OpenSpec CLI behavior (`openspec list --json`).

### `run_openspec_command` must be cross-platform

On Windows, `openspec` is installed as a `.ps1` PowerShell script (and `.cmd` wrapper) by npm. Rust `Command::new("openspec")` cannot execute `.ps1` files directly.

**Solution**: `commands.rs` uses platform-specific execution:
- **Windows**: `cmd /C openspec` → finds the `.cmd` wrapper
- **macOS/Linux**: `Command::new("openspec")` → executes the shell script directly

**Rule**: NEVER use `Command::new("openspec")` directly on Windows. Always route through the shell.

### `read_artifact` handles directories automatically

If called with a directory path, the Rust command now auto-loads `spec.md` inside it. No need to handle this in the frontend beyond constructing the path.

### Vite MUST ignore `openspec/` folder in its watcher

**Problem:** When `writeArtifact` writes to `openspec/changes/<name>/tasks.md`, Vite's file watcher detects the change and triggers a full page reload. This resets the Zustand store to its initial empty state, causing the user to see "Change not found" or an empty changes list.

**Solution:** `vite.config.ts` MUST include `**/openspec/**` in the `server.watch.ignored` array:

```typescript
server: {
  watch: {
    ignored: ["**/src-tauri/**", "**/openspec/**", "**/node_modules/**"],
  },
}
```

**Rule:** NEVER remove `**/openspec/**` from Vite's ignored list. Any file write to the openspec directory must NOT trigger a page reload.

### Task completion must refresh the store

When a task is toggled in `TasksView`, the file is written via `writeArtifact`. The store's `activeChange` must be refreshed to reflect the new `tasksCompleted` count. Use the `refreshAllChanges` store action after a successful write:

```typescript
writeArtifact(filePath, newContent).then(() => {
  refreshAllChanges(workspacePath);
});
```

### Archived changes are loaded separately

The `read_archived_changes` Rust command reads from `openspec/changes/archive/` and returns changes with `status: "archived"`. The store has a dedicated `archivedChanges` array and `loadArchivedChanges` action. The `getFilteredChanges` method combines both arrays when filter is "all".

### Archive must reload from scratch

When `archiveChange` succeeds, the store clears `changes: []` and calls `loadChanges` + `loadArchivedChanges` to reload from the backend. This ensures the archived change is removed from the active list and appears in the archived list. Using `refreshAllChanges` with merge logic would keep stale data.

### Status badge colors must be consistent

Status badges use the same color tokens across all components:
- `active`: `text-primary bg-primary/10 border-primary/30` (indigo)
- `complete`: `text-success bg-success/10 border-success/30` (green)
- `archived`: `text-muted-foreground bg-muted-foreground/10 border-muted-foreground/30` (muted)

Archived badges include a `✓ ` prefix.

### Date/time formatting uses `formatDateTime`

The `formatDateTime` utility formats ISO dates as "Mon DD, YYYY, HH:MM AM/PM". Use it in metadata bars and detail views. `formatRelativeTime` is used for list views showing "2h ago", "3d ago", etc.

---

## Git Workflow

### NEVER commit without explicit permission

**Do NOT run `git commit`, `git push`, or any git operation that modifies history unless the user explicitly says so.**

- You may edit files, run builds, and test locally
- When you finish a task, show the changes and wait for the user to say "commit" or "push"
- This rule overrides any other instruction in this file

### Create branch before applying a spec

Before implementing any spec, proposal, or change, **always create a git branch** named after the spec:

```bash
git checkout -b <spec-name>
```

- Use the exact change/spec folder name (kebab-case)
- Do this before writing any code or modifying files
- Ensure the branch is created from the current working branch (usually `main`)

---

## Discovery: Specs Structure

> **Critical**: In OpenSpec, specs are **folders**, not direct files.

```
openspec/specs/
├── heat-confirmation-summary/
│   └── spec.md
├── movement-navigation/
│   └── spec.md
├── movement-rep-input/
│   └── spec.md
└── rep-counter-ui/
│   └── spec.md
```

**Implementation note**: When user clicks a spec folder in SpecsExplorer, the app must:

1. Detect it's a directory (not a file)
2. Look for `spec.md` inside that directory
3. Load the content of `spec.md`, not the folder itself

---

## KISS Methodology (Keep It Simple, Stupid)

> **Always prefer simplicity over cleverness.** When multiple approaches solve a problem, choose the simplest one.

### Rules

1. **No over-engineering**: Don't add abstractions, layers, or patterns until they're proven necessary. A 10-line function is better than a 50-line "extensible" one.
2. **No premature optimization**: Don't optimize code that hasn't been measured as slow. Correctness first, then simplicity, then performance only if needed.
3. **Minimal state**: Prefer fewer state variables. If derived state can replace stored state, derive it. If local state is sufficient, don't use global state.
4. **Straightforward control flow**: Prefer linear flows over branching. Avoid deeply nested conditionals. Early returns and guard clauses over wrapping logic in `else` blocks.
5. **One way to do things**: If two code paths do the same thing with different implementations, unify them. Don't maintain parallel patterns.
6. **Delete dead code**: If code is unreachable, unused, or commented out, remove it. Don't keep "just in case" code.
7. **Avoid defensive redundancy**: Don't duplicate checks "just to be safe." If a guard exists upstream, don't add the same guard downstream. Trust the data flow.
8. **Debug logs are temporary**: `console.log` statements added for debugging must be removed before committing. Production code stays clean.
9. **Fix root causes, not symptoms**: If a button doesn't work, find why the data is wrong — don't patch the UI to hide the bug.
