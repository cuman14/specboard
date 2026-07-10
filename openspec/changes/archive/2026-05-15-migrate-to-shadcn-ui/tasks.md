## 1. Git Setup

- [ ] 1.1 Create git branch `migrate-to-shadcn-ui` from current branch

## 2. Setup & Configuration

- [ ] 2.1 Install `tailwindcss-animate` dependency
- [ ] 2.2 Run `pnpm dlx shadcn@latest init` with `--css src/index.css --style new-york` to generate `components.json`
- [ ] 2.3 Configure CSS variables in `src/index.css` mapping shadcn tokens to Specboard palette (#0b1326, #171f33, #6366f1, #464554, etc.)
- [ ] 2.4 Verify `cn()` utility in `src/lib/utils.ts` is compatible with shadcn components

## 3. Add shadcn/ui Components

- [ ] 3.1 Add `Button` component via `pnpm dlx shadcn@latest add button`
- [ ] 3.2 Add `Badge` component via `pnpm dlx shadcn@latest add badge`
- [ ] 3.3 Add `Progress` component via `pnpm dlx shadcn@latest add progress`
- [ ] 3.4 Add `Tabs` component via `pnpm dlx shadcn@latest add tabs`
- [ ] 3.5 Add `Input` component via `pnpm dlx shadcn@latest add input`
- [ ] 3.6 Add `Card` component via `pnpm dlx shadcn@latest add card`
- [ ] 3.7 Add `ScrollArea` component via `pnpm dlx shadcn@latest add scroll-area`
- [ ] 3.8 Add `Separator` component via `pnpm dlx shadcn@latest add separator`
- [ ] 3.9 Add `Tooltip` component via `pnpm dlx shadcn@latest add tooltip`
- [ ] 3.10 Add `Collapsible` component via `pnpm dlx shadcn@latest add collapsible`

## 4. Migrate OnboardingPage

- [ ] 4.1 Replace browse button with `<Button>` component
- [ ] 4.2 Replace manual path input with `<Input>` component
- [ ] 4.3 Replace main card container with `<Card>` component
- [ ] 4.4 Replace recent workspace buttons with `<Button variant="outline">`
- [ ] 4.5 Verify visual match with current appearance

## 5. Migrate ChangesDashboard

- [ ] 5.1 Replace status badges with `<Badge>` component
- [ ] 5.2 Replace manual progress bars with `<Progress>` component
- [ ] 5.3 Replace action buttons (Sync, Change workspace, New change) with `<Button>` variants
- [ ] 5.4 Replace filter bar buttons with `<Button variant="ghost">`
- [ ] 5.5 Replace stat cards with `<Card>` components
- [ ] 5.6 Replace activity feed container with `<ScrollArea>`
- [ ] 5.7 Verify visual match with current appearance

## 6. Migrate ChangeDetail

- [ ] 6.1 Replace custom artifact tabs with `<Tabs>` / `<TabsList>` / `<TabsTrigger>`
- [ ] 6.2 Replace artifact status badges with `<Badge>` component
- [ ] 6.3 Replace progress bar with `<Progress>` component
- [ ] 6.4 Replace Validate/Archive buttons with `<Button>` variants
- [ ] 6.5 Replace back button with `<Button variant="ghost">`
- [ ] 6.6 Replace content area with `<ScrollArea>`
- [ ] 6.7 Verify visual match with current appearance

## 7. Migrate KanbanPage

- [ ] 7.1 Replace artifact status dots with `<Badge>` component
- [ ] 7.2 Replace task progress bar with `<Progress>` component
- [ ] 7.3 Replace drag grip button with `<Button variant="ghost" size="icon">`
- [ ] 7.4 Verify visual match with current appearance

## 8. Migrate SpecsExplorer

- [ ] 8.1 Replace folder expand/collapse with `<Collapsible>` component
- [ ] 8.2 Replace file tree container with `<ScrollArea>`
- [ ] 8.3 Replace file/folder buttons with appropriate interactive elements
- [ ] 8.4 Replace content area with `<ScrollArea>`
- [ ] 8.5 Replace header separator with `<Separator>` component
- [ ] 8.6 Verify visual match with current appearance

## 9. Migrate Layout Components

- [ ] 9.1 Wrap UtilityBar icons with `<Tooltip>` for hover labels
- [ ] 9.2 Replace Sidebar nav items with consistent button/link patterns
- [ ] 9.3 Replace Sidebar borders with `<Separator>` component
- [ ] 9.4 Replace Sidebar overflow container with `<ScrollArea>`
- [ ] 9.5 Replace SpecsSidebar button with `<Button variant="outline">`
- [ ] 9.6 Verify visual match with current appearance

## 10. Migrate TasksView

- [ ] 10.1 Replace manual progress bar with `<Progress>` component
- [ ] 10.2 Replace task status indicators with appropriate styling
- [ ] 10.3 Verify visual match with current appearance

## 11. Cleanup & Verification

- [ ] 11.1 Run `pnpm build` and verify no TypeScript errors
- [ ] 11.2 Run `pnpm dev` and visually verify all pages match original appearance
- [ ] 11.3 Test keyboard navigation on all interactive elements
- [ ] 11.4 Test focus rings on buttons, inputs, and tabs
- [ ] 11.5 Test drag-and-drop on Kanban board still works
- [ ] 11.6 Test collapsible file tree in SpecsExplorer
- [ ] 11.7 Verify tooltips appear on UtilityBar hover
- [ ] 11.8 Remove any unused Radix UI direct imports replaced by shadcn wrappers
