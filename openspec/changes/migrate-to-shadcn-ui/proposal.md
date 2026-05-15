## Why

The current UI uses raw Tailwind utility classes scattered across pages and components, leading to duplicated styling patterns, inconsistent interaction states, and no centralized component API. This makes maintenance harder, introduces visual inconsistencies, and requires re-implementing accessibility patterns (focus rings, aria attributes, keyboard navigation) in every component.

## What Changes

- Replace all inline Tailwind button patterns with a shared `Button` component
- Replace status badges with a shared `Badge` component
- Replace manual progress bars with shadcn `Progress` component
- Replace custom artifact tabs with shadcn `Tabs` component
- Replace raw input elements with shadcn `Input` component
- Replace card-like containers with shadcn `Card` component
- Replace manual scroll areas with shadcn `ScrollArea` component
- Replace manual separators with shadcn `Separator` component
- Add `Tooltip` support for UtilityBar icons
- Add `Collapsible` support for SpecsExplorer file tree
- Initialize shadcn/ui configuration (`components.json`) with project design tokens
- Maintain existing dark mode color palette and visual style — no visual redesign

## Capabilities

### New Capabilities

- `shadcn-component-library`: Shared shadcn/ui components (Button, Badge, Progress, Tabs, Input, Card, ScrollArea, Separator, Tooltip, Collapsible) configured with Specboard design tokens
- `design-token-integration`: shadcn CSS variables mapped to existing Specboard color palette (#0b1326 background, #6366f1 primary, etc.)

### Modified Capabilities

<!-- No existing spec requirements change — this is an implementation migration -->

## Impact

- **Affected files**: All page components (`ChangesDashboard.tsx`, `ChangeDetail.tsx`, `KanbanPage.tsx`, `OnboardingPage.tsx`, `SpecsExplorer.tsx`) and layout components (`UtilityBar.tsx`, `Sidebar.tsx`, `SpecsSidebar.tsx`, `TasksView.tsx`)
- **New files**: `src/components/ui/` directory with shadcn components, `components.json` configuration
- **Dependencies**: `class-variance-authority` and `tailwind-merge` already installed; `tailwindcss-animate` may be added
- **No breaking changes**: External behavior, Tauri IPC, and OpenSpec integration remain unchanged
- **Visual style**: Preserved — same dark mode palette, same typography, same radius
