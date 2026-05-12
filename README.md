# Specboard

[![Release](https://github.com/cuman14/specboard/actions/workflows/release.yml/badge.svg)](https://github.com/cuman14/specboard/actions/workflows/release.yml)
[![Commitlint](https://github.com/cuman14/specboard/actions/workflows/commitlint.yml/badge.svg)](https://github.com/cuman14/specboard/actions/workflows/commitlint.yml)

> Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants

[![Commitlint](https://img.shields.io/badge/commitlint-conventional-green.svg)](https://github.com/conventional-changelog/commitlint)

**Status**: Automated releases with semantic-release and conventional commits are now active.

Specboard gives developers a visual interface to manage OpenSpec changes, specs and artifacts without touching the terminal. Built with **Tauri 2 + React 19 + TypeScript**.

---

## Installation

### Windows

**Option 1: Installer (recommended)**
Download from [GitHub Releases](https://github.com/cuman14/specboard/releases/latest)

**Option 2: Scoop**

```powershell
scoop bucket add https://github.com/cuman14/specboard
scoop install specboard
```

### macOS

**Option 1: DMG (recommended)**
Download from [GitHub Releases](https://github.com/cuman14/specboard/releases/latest)

**Option 2: Homebrew**

```bash
brew tap cuman14/specboard
brew install specboard
```

### Linux

**Option 1: AppImage (recommended)**
Download from [GitHub Releases](https://github.com/cuman14/specboard/releases/latest)

**Option 2: Flatpak**

```bash
flatpak install flathub com.specboard.app
```

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

## Features (Fase 1 MVP)

- **Changes Dashboard** — list all active changes with artifact progress and status badges. Auto-refreshes via filesystem watcher.
- **Change Detail** — view proposal, specs, design and tasks artifacts rendered as markdown. Tasks tab shows a card-based checklist with progress bar and layer grouping.
- **Kanban Board** — drag-and-drop changes across Draft / In Review / Validated columns. Syncs from real workspace.
- **Specs Explorer** — file tree of `openspec/specs/` with markdown viewer. Specs are folders containing `spec.md`.
- **File watcher** — auto-refresh on filesystem changes (no manual reload needed).
- **Sync button** — manual refresh with spinner feedback.
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

## Installation

### Option 1: npm (Recommended for Developers)

```bash
npm install -g specboard
specboard
```

The npm package automatically downloads the correct binary for your platform.

### Option 2: Download from Website

Visit [specboard.dev/download](https://specboard.dev/download) to download the installer for your platform.

### Option 3: GitHub Releases

Download directly from [GitHub Releases](https://github.com/cuman14/specboard/releases) for your platform:

- **macOS**: `.dmg` (Intel & Apple Silicon)
- **Windows**: `.msi` or `.exe`
- **Linux**: `.AppImage`, `.deb`, or `.rpm`

### Corporate Proxy / Manual Installation

If `npm install` fails due to network restrictions:

1. Download the appropriate binary from [GitHub Releases](https://github.com/cuman14/specboard/releases)
2. Set the environment variable before installing:
   ```bash
   export SPECBOARD_BINARY_PATH=/path/to/downloaded/specboard
   npm install -g specboard
   ```

Or simply run the downloaded binary directly without npm.

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
    │   │   ├── proposal.md
    │   │   ├── specs.md
    │   │   ├── design.md
    │   │   └── tasks.md
    │   └── archive/
    │       └── <date-name>/    # Completed changes
    ├── specs/
    │   └── <spec-name>/
    │       └── spec.md         # Specs are folders, not files
    └── config.json
```

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
