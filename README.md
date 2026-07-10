<div align="center">
  <img src="public/logo.png" alt="Specboard" width="80" />
  <h1>Specboard</h1>
  <p>Visual GUI for <a href="https://github.com/cuman14/openspec">OpenSpec</a> — Spec-Driven Development for AI coding assistants</p>

[![Release](https://github.com/cuman14/specboard/actions/workflows/release.yml/badge.svg)](https://github.com/cuman14/specboard/actions/workflows/release.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

</div>

---

Specboard gives developers a visual interface to manage OpenSpec changes, specs and artifacts without touching the terminal. Built with **Tauri 2 + React 19 + TypeScript**.

---

## Installation

### Windows

**Option 1: Installer (recommended)**
Download from [GitHub Releases](https://github.com/cuman14/specboard/releases/latest)

- Note: First-time users may see SmartScreen warning. Click "More info" → "Run anyway"

**Option 2: Scoop**

```powershell
scoop bucket add specboard https://github.com/cuman14/specboard
scoop install specboard
```

- Status: Available
- **Note for existing users:** If you previously installed Specboard via direct download (not Scoop), uninstall it first from Windows Settings before running `scoop install`. Once installed via Scoop, `scoop update specboard` will handle future upgrades automatically.

### macOS

**Option 1: DMG (recommended)**
Download from [GitHub Releases](https://github.com/cuman14/specboard/releases/latest)

**Option 2: Homebrew**

```bash
brew tap cuman14/specboard
brew install --cask specboard
```

- Status: Available (Cask in `Casks/` directory)

> **Nota para macOS:** Como este proyecto es open source y no pagamos los $99 anuales de Apple Developer, los binarios de macOS **no están firmados digitalmente**. Gatekeeper bloqueará el primer arranque. Puedes solucionarlo con:
>
> ```bash
> xattr -cr /Applications/Specboard.app
> ```
>
> O simplemente haz clic derecho → "Abrir" la primera vez.

### Linux

**Option 1: AppImage (recommended)**
Download from [GitHub Releases](https://github.com/cuman14/specboard/releases/latest)

**Option 2: Flatpak**

```bash
# After Flathub approval (see FLATPUB_SETUP.md)
flatpak install flathub com.specboard.app
```

- Status: Pending Flathub approval (see FLATPUB_SETUP.md for steps)

**Option 3: Package Manager**

```bash
# Debian/Ubuntu
wget https://github.com/cuman14/specboard/releases/download/v1.1.0/specboard_1.1.0_amd64.deb
sudo dpkg -i specboard_1.1.0_amd64.deb

# Fedora/RHEL
wget https://github.com/cuman14/specboard/releases/download/v1.1.0/specboard_1.1.0_x86_64.rpm
sudo dnf install specboard_1.1.0_x86_64.rpm
```

---

## Screenshots

> _Changes Dashboard, Kanban Board, Specs Explorer and Change Detail with Tasks view._

---

## Features

- **Changes Dashboard** — list all active changes with artifact status dots, task progress, and relative timestamps. Manual sync button with spinner feedback.
- **Change Detail** — tabbed view of all artifacts (proposal, design, specs, tasks) rendered as markdown. Tasks tab parses `tasks.md` into a card-based checklist with progress bar, layer grouping, and live task counts.
- **Artifact validation** — run `openspec validate` directly from the UI and see results inline.
- **Kanban Board** — drag-and-drop changes across Draft / In Review / Validated columns.
- **Specs Explorer** — file tree of `openspec/specs/` with inline markdown viewer.
- **Workspace picker** — native OS folder dialog to open any OpenSpec project.
- **Change workspace** — switch to a different project folder at any time.

---

## Tech Stack

| Layer           | Technology                                |
| --------------- | ----------------------------------------- |
| Desktop shell   | Tauri 2 (Rust backend, WebView2 frontend) |
| UI Framework    | React 19 + TypeScript                     |
| Styling         | Tailwind CSS v4                           |
| Components      | shadcn/ui (Radix UI)                      |
| State           | Zustand                                   |
| Routing         | React Router v7                           |
| Drag & Drop     | @dnd-kit                                  |
| Icons           | Lucide React                              |
| Markdown        | react-markdown                            |
| Fonts           | Inter + JetBrains Mono                    |
| Package manager | pnpm                                      |

---

## Prerequisites (Development)

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 8+
- [Rust](https://www.rust-lang.org/tools/install) 1.77+
- [Tauri prerequisites for Windows](https://tauri.app/start/prerequisites/) (WebView2, Build Tools)

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/cuman14/specboard.git
cd specboard

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

> **Windows note:** If `icon.ico` is missing, regenerate it before running:
>
> ```powershell
> powershell -ExecutionPolicy Bypass -File make_icon.ps1
> ```

### Build for production

```bash
pnpm tauri build
```

The installer will be in `src-tauri/target/release/bundle/`.

---

## Project Structure

```
specboard/
├── src/                        # React frontend
│   ├── components/
│   │   ├── changes/
│   │   │   └── TasksView.tsx   # Task cards parser & renderer
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── UtilityBar.tsx
│   ├── pages/
│   │   ├── OnboardingPage.tsx
│   │   ├── ChangesDashboard.tsx
│   │   ├── ChangeDetail.tsx
│   │   ├── KanbanPage.tsx
│   │   └── SpecsExplorer.tsx
│   ├── store/                  # Zustand stores
│   ├── lib/                    # Tauri commands, utils, mock data
│   └── types/                  # Shared TypeScript interfaces
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   └── commands.rs         # All Tauri IPC commands
│   ├── capabilities/
│   │   └── default.json        # App permissions
│   └── tauri.conf.json
├── AGENTS.md                   # AI agent context & rules
└── DESIGN.md                   # Design system reference
```

---

## OpenSpec Workspace Structure

Specboard expects a project with the following layout:

```
<project>/
└── openspec/
    ├── changes/
    │   ├── <change-name>/
    │   │   ├── proposal.md      # Why: motivation and scope
    │   │   ├── design.md        # How: technical decisions
    │   │   ├── specs/           # What: capability specs
    │   │   │   └── <name>/
    │   │   │       └── spec.md
    │   │   └── tasks.md         # Checklist of implementation tasks
    │   └── archive/
    │       └── YYYY-MM-DD-<name>/   # Completed changes
    ├── specs/
    │   └── <capability>/
    │       └── spec.md          # Accumulated project specs
    └── config.yaml
```

---

## OpenSpec CLI Commands

Specboard invokes the `openspec` CLI in the background. These are the commands currently wired up:

| Command                             | When it runs                                       |
| ----------------------------------- | -------------------------------------------------- |
| `openspec validate <change> --json` | When the user clicks **Validate** in Change Detail |

Specboard also reads the workspace structure directly (without CLI) for:

| Operation                | How                                                         |
| ------------------------ | ----------------------------------------------------------- |
| Scan changes & artifacts | Reads `openspec/changes/` directory tree                    |
| Read artifact content    | Reads `.md` files directly from disk                        |
| Read specs tree          | Reads `openspec/specs/` directory tree                      |
| Watch for file changes   | Native filesystem watcher (emits `workspace-changed` event) |
| Open folder in Explorer  | OS shell command                                            |

> **Note:** Commands like `openspec new`, `openspec archive`, and `openspec instructions` are run manually in the terminal. Specboard automatically reflects the results via the filesystem watcher.

---

## Design System

Dark mode only. Key tokens:

| Token            | Value     |
| ---------------- | --------- |
| Background       | `#0b1326` |
| Surface          | `#171f33` |
| Surface high     | `#222a3d` |
| Primary (Indigo) | `#6366f1` |
| Secondary (Sky)  | `#0ea5e9` |
| Text             | `#dae2fd` |
| Text muted       | `#c7c4d7` |
| Border           | `#464554` |

See [`DESIGN.md`](./DESIGN.md) for the full reference.

---

## Roadmap (Fase 2+)

- [ ] Markdown editor for artifacts
- [ ] Integrated terminal
- [ ] Metrics dashboard
- [ ] Spec delta comparator
- [ ] Multi-project support
- [ ] Git integration

---

## License

MIT
