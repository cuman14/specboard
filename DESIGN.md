# Specboard Design System

> Reference for all visual decisions. Keep this in sync with `src/index.css` and `tailwind.config.ts`.

---

## Color Palette

### Base Surfaces (dark mode only in Fase 1)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0b1326` | App background, deepest level |
| `--color-surface` | `#171f33` | Panels, cards, sidebar |
| `--color-surface-high` | `#222a3d` | Hover states, elevated cards |
| `--color-surface-highest` | `#2d3449` | Modals, popovers |

### Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#6366f1` | CTA buttons, active states, focus rings |
| `--color-primary-dim` | `#4f46e5` | Primary hover state |
| `--color-secondary` | `#0ea5e9` | Secondary highlights, status indicators |

### Text

| Token | Hex | Usage |
|---|---|---|
| `--color-text` | `#dae2fd` | Primary text, headings |
| `--color-text-muted` | `#c7c4d7` | Secondary text, metadata |
| `--color-text-subtle` | `#908fa0` | Placeholders, disabled |

### Borders

| Token | Hex | Usage |
|---|---|---|
| `--color-border` | `#464554` | Default component borders |
| `--color-border-subtle` | `#2d3449` | Low-emphasis separators |
| `--color-border-active` | `#6366f1` | Active/focused panel border |

### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#22c55e` | Ready artifact, validated state |
| `--color-warning` | `#f59e0b` | Pending artifact, warnings |
| `--color-error` | `#ef4444` | Blocked artifact, critical errors |
| `--color-info` | `#0ea5e9` | Info badges, suggestions |

---

## Typography

Two font families with strict functional split:

### Inter — UI Chrome
Used for all navigation, labels, buttons, body text.

| Scale | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-lg` | 30px | 600 | 36px | Page titles |
| `headline-md` | 20px | 600 | 28px | Section headers |
| `body-base` | 14px | 400 | 20px | Default body text |
| `body-sm` | 12px | 400 | 18px | Dense lists, table rows |

### JetBrains Mono — Technical Data
Used for file paths, artifact content, code, metadata tags.

| Scale | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `code-base` | 13px | 400 | 20px | Spec content, markdown |
| `code-sm` | 11px | 400 | 16px | Metadata, timestamps |
| `label-caps` | 10px | 600 | 12px | Table headers, category tags |

---

## Spacing System

Base unit: **4px**. All spacing values are multiples of 4px.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Micro gaps (icon + text) |
| `--space-2` | 8px | Compact padding (dense list rows) |
| `--space-3` | 12px | Standard gutter between elements |
| `--space-4` | 16px | Standard padding for panels/cards |
| `--space-6` | 24px | Section separation |
| `--space-8` | 32px | Large section breaks |

### Layout Constants

| Token | Value |
|---|---|
| `--utility-bar-width` | 48px |
| `--sidebar-width` | 240px |
| `--card-radius` | 4px |

---

## Layout Architecture

```
┌────────────────────────────────────────────────────────────┐
│  48px UtilityBar  │  240px Sidebar  │  Workspace (fluid)   │
│  (vertical icons) │  (tree / nav)   │  (main content)      │
│                   │                 │                      │
│  [Changes icon]   │  Context-aware  │  Page component      │
│  [Specs icon]     │  secondary nav  │  renders here        │
│  [Kanban icon]    │  or file tree   │                      │
│  [Settings icon]  │                 │                      │
└────────────────────────────────────────────────────────────┘
```

### Depth / Elevation

No shadows. Use **tonal layering + borders**:

| Level | Surface | Border | Usage |
|---|---|---|---|
| 0 (Base) | `#0b1326` | none | App shell background |
| 1 (Panels) | `#171f33` | `1px #464554` | Cards, sidebar |
| 2 (Elevated) | `#222a3d` | `1px #464554` | Hover states, active rows |
| 3 (Floating) | `#2d3449` | `1px #6366f1` | Modals, active panels |

---

## Component Patterns

### Utility Bar
- Width: 48px, full height
- Background: `#0b1326` with right border `1px #464554`
- Icon buttons: 40px × 40px, centered
- Active state: left 2px accent bar in `#6366f1` + icon color `#6366f1`
- Inactive: icon color `#908fa0`, hover `#c7c4d7`

### Sidebar
- Width: 240px, full height
- Background: `#171f33` with right border `1px #464554`
- List rows: 32px height, 8px vertical padding, 12px horizontal
- Active row: `bg #222a3d` + left 2px bar `#6366f1`
- Hover: `bg #1c2438`

### Cards (Change Cards)
- Background: `#171f33`, border `1px #464554`, radius 4px
- Header: font `body-base` 600, color `#dae2fd`
- Subtext: `body-sm`, color `#c7c4d7`
- Hover: border `#6366f1`

### Buttons

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `#6366f1` | `#fff` | none |
| Ghost | transparent | `#dae2fd` | `1px #464554` |
| Destructive | `#ef4444` | `#fff` | none |

Hover: darken 10%. Active: scale(0.98). Radius: 4px.

### Badges / Status Chips
- Shape: pill (9999px radius)
- Font: `label-caps` (JetBrains Mono, 10px, 600, 0.05em spacing)
- Sizes: small (4px v-pad, 8px h-pad)

| Status | Background | Text |
|---|---|---|
| ready | `rgba(34,197,94,0.15)` | `#22c55e` |
| pending | `rgba(245,158,11,0.15)` | `#f59e0b` |
| blocked | `rgba(239,68,68,0.15)` | `#ef4444` |
| missing | `rgba(144,143,160,0.15)` | `#908fa0` |

### Artifact Progress Bar
- Track: `#2d3449`
- Fill: `#6366f1`
- Height: 4px, radius full
- Show fraction text `X/4` next to bar in `body-sm` muted

### Tabs (Artifact tabs in Change Detail)
- Underline style (not pill)
- Active: `#6366f1` 2px underline, text `#dae2fd`
- Inactive: no underline, text `#908fa0`

### Icons
- Library: Lucide React
- Stroke width: 1.5px
- Size: 16px default, 20px for utility bar

---

## Tailwind Custom Theme Extensions

```typescript
// tailwind.config.ts additions
colors: {
  bg: '#0b1326',
  surface: '#171f33',
  'surface-high': '#222a3d',
  'surface-highest': '#2d3449',
  primary: '#6366f1',
  'primary-dim': '#4f46e5',
  secondary: '#0ea5e9',
  text: '#dae2fd',
  'text-muted': '#c7c4d7',
  'text-subtle': '#908fa0',
  border: '#464554',
  'border-subtle': '#2d3449',
  'border-active': '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}
```

---

## shadcn/ui Conventions

- All shadcn components live in `src/components/ui/`
- Override CSS variables in `src/index.css` `:root` to match this palette
- Do NOT use default shadcn light theme colors anywhere
- Preferred components: `Button`, `Badge`, `Card`, `Tabs`, `Dialog`, `Input`, `ScrollArea`, `Separator`, `Progress`, `Tooltip`, `Table`

---

*Specboard Design System v1.0 · Fase 1 · Mayo 2026*
