# Specboard — AI Agent Context

> **Read this file first.** It gives you full context to work on this project without asking repeated questions.

## What is Specboard?

Specboard is a **desktop GUI application** built with Tauri 2 + React 19 + TypeScript that provides a visual interface for **OpenSpec** — a Spec-Driven Development (SDD) framework for AI coding assistants. It lets developers manage OpenSpec changes, artifacts and specs without touching the terminal.

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
export type ChangeStatus = "active" | "archived" | "blocked";
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
- **Custom scripts** - `sync-versions.js`, `update-sha256-from-artifacts.js`
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
   - Runs `update-sha256-from-artifacts.js` to update scoop/specboard.json and homebrew/specboard.rb
   - Commits and pushes changes with `[skip ci]` to prevent infinite loop

**Important rules:**

- Use `@release-it/conventional-changelog` NOT `@release-it-plugins/lerna-changelog`
- Scripts read version from package.json (no command line arguments)
- SHA256 calculated from CI artifacts (not downloaded from internet)
- Update manifests commit uses `[skip ci]` to prevent release loop
- Release job uses `RELEASE_TOKEN` secret for git operations
- Build job uses `GITHUB_TOKEN` for GitHub Release assets

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

### Kanban must sync from ChangesStore

`KanbanPage` must call `loadFromChanges(realChanges)` in a `useEffect` watching `useChangesStore(s => s.changes)`. Otherwise it shows stale mock data.

### `archive` folder is NOT a change (but counts as archived)

`openspec/changes/archive/` contains completed changes with structure `<date-name>/` (e.g. `2026-04-05-heat-confirmation-step-2/`). Each has `proposal.md`, `design.md`, `tasks.md`, `specs/`, `.openspec.yaml` inside.

- Skip it in the active changes list
- Count its subdirectories for `archivedCount`
- `archived_count` reads from `changes_path.join("archive")`, NOT `openspec/archive/`

### Empty change folders must be hidden

Folders inside `openspec/changes/` with no `.md` or `.yaml` files are skipped in `read_workspace`. Filter applied in `commands.rs`.

### `read_artifact` handles directories automatically

If called with a directory path, the Rust command now auto-loads `spec.md` inside it. No need to handle this in the frontend beyond constructing the path.

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
