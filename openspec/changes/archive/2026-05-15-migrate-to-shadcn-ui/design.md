## Context

Specboard currently implements all UI using raw Tailwind utility classes directly in JSX. There are no reusable UI primitives — buttons, badges, progress bars, tabs, inputs, cards, scroll areas, separators, tooltips, and collapsibles are each re-implemented with inline classes wherever needed. This leads to:

- Duplicated Tailwind class strings across 10+ component files
- Inconsistent interaction states (hover, pressed, disabled, focus)
- Accessibility patterns (aria attributes, keyboard navigation) re-implemented manually
- No single source of truth for component variants

The project already has Radix UI primitives installed (`@radix-ui/react-dialog`, `select`, `tabs`, `tooltip`, `separator`, `scroll-area`, `slot`, `label`, `dropdown-menu`, `progress`, `icons`) along with `class-variance-authority`, `clsx`, and `tailwind-merge` — the exact dependencies shadcn/ui requires.

## Goals / Non-Goals

**Goals:**

- Centralize all UI primitives into `src/components/ui/` using shadcn/ui
- Map shadcn CSS variables to existing Specboard design tokens (dark mode palette)
- Preserve current visual appearance — no redesign
- Improve accessibility through shadcn's built-in aria/keyboard support
- Reduce duplicated Tailwind classes across pages

**Non-Goals:**

- No visual redesign or style changes
- No new features or functionality
- No changes to Tauri IPC, OpenSpec integration, or business logic
- No migration to light mode
- No changes to layout structure or navigation patterns

## Decisions

### 1. Use shadcn/ui CLI for component generation

**Decision**: Use `pnpm dlx shadcn@latest add` to generate components rather than manual copy-paste.

**Rationale**: CLI ensures correct dependency resolution, proper CSS variable mapping, and consistent component structure. Manual copy-paste is error-prone and misses subtle details.

**Alternatives considered**:
- Manual copy from shadcn docs — fragile, easy to miss updates
- Full shadcn npm package — not how shadcn works (it's copy-to-own)

### 2. Map CSS variables to existing Specboard tokens

**Decision**: Configure shadcn's CSS variables to match the existing color palette rather than adopting shadcn defaults.

**Mapping**:
| shadcn variable | Specboard value |
|----------------|-----------------|
| `--background` | `#0b1326` |
| `--foreground` | `#dae2fd` |
| `--card` | `#171f33` |
| `--card-foreground` | `#dae2fd` |
| `--primary` | `#6366f1` |
| `--primary-foreground` | `#ffffff` |
| `--secondary` | `#222a3d` |
| `--secondary-foreground` | `#dae2fd` |
| `--muted` | `#222a3d` |
| `--muted-foreground` | `#908fa0` |
| `--accent` | `#222a3d` |
| `--accent-foreground` | `#dae2fd` |
| `--destructive` | `#ef4444` |
| `--destructive-foreground` | `#ffffff` |
| `--border` | `#464554` |
| `--input` | `#464554` |
| `--ring` | `#6366f1` |
| `--radius` | `0.25rem` (4px) |

### 3. Migrate file-by-file, not all-at-once

**Decision**: Replace components in each page/layout file individually rather than a bulk find-and-replace.

**Rationale**: Each file has unique patterns that need careful translation. File-by-file allows incremental testing and rollback.

**Order**: OnboardingPage → ChangesDashboard → ChangeDetail → KanbanPage → SpecsExplorer → Layout components → TasksView → SpecsSidebar

### 4. Keep existing `cn()` utility

**Decision**: Retain the existing `cn()` function in `src/lib/utils.ts` rather than replacing it.

**Rationale**: shadcn components expect a `cn` utility. The existing implementation using `clsx` + `tailwind-merge` is correct and already installed.

### 5. Add `tailwindcss-animate` plugin

**Decision**: Install `tailwindcss-animate` for shadcn animation utilities.

**Rationale**: Required by several shadcn components for transitions and micro-interactions.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Visual regression — shadcn defaults may not match current appearance | CSS variable mapping ensures same colors; manual review each file |
| Bundle size increase from new component files | shadcn components are tree-shakeable; only imported components included |
| Breaking existing hover/focus states | shadcn includes proper state variants; verify each component |
| Tailwind v4 compatibility with shadcn CLI | shadcn supports Tailwind v4; use `--css` flag to point to correct CSS file |
| Radix dependency conflicts | shadcn uses same Radix versions; no conflict expected |
