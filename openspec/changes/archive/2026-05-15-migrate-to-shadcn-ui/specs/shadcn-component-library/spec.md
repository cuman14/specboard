## ADDED Requirements

### Requirement: shadcn/ui component library initialization
The project SHALL initialize shadcn/ui with a `components.json` configuration file that maps component paths, style preferences, and CSS variable usage. The configuration MUST target Tailwind CSS v4, use the `new-york` style variant, and set the components directory to `src/components/ui`.

#### Scenario: CLI initialization succeeds
- **WHEN** `pnpm dlx shadcn@latest init` is executed
- **THEN** `components.json` is created at project root with correct paths and style configuration

### Requirement: Button component
The system SHALL provide a `Button` component in `src/components/ui/button.tsx` using `class-variance-authority` with variants for `default`, `destructive`, `outline`, `secondary`, `ghost`, and `link`. The component MUST support `size` variants (`default`, `sm`, `lg`, `icon`) and accept all standard HTML button attributes via `React.ButtonHTMLAttributes`.

#### Scenario: Button renders with default variant
- **WHEN** `<Button>Click me</Button>` is rendered
- **THEN** it displays with indigo (#6366f1) background, white text, and 4px border radius

#### Scenario: Destructive button renders with red styling
- **WHEN** `<Button variant="destructive">Delete</Button>` is rendered
- **THEN** it displays with red (#ef4444) background and white text

#### Scenario: Icon button renders as square
- **WHEN** `<Button size="icon"><Icon /></Button>` is rendered
- **THEN** it renders as a square button with centered icon content

### Requirement: Badge component
The system SHALL provide a `Badge` component in `src/components/ui/badge.tsx` with variants for `default`, `secondary`, `destructive`, and `outline`. The component MUST render as an inline-flex element with rounded-full border and small padding.

#### Scenario: Default badge renders
- **WHEN** `<Badge>Active</Badge>` is rendered
- **THEN** it displays with indigo (#6366f1) background, white text, and rounded-full shape

#### Scenario: Outline badge renders with border only
- **WHEN** `<Badge variant="outline">Pending</Badge>` is rendered
- **THEN** it displays with transparent background, border color matching current text color

### Requirement: Progress component
The system SHALL provide a `Progress` component in `src/components/ui/progress.tsx` based on `@radix-ui/react-progress`. The component MUST accept a `value` prop (0-100) and render a horizontal bar with indigo (#6366f1) fill on dark (#222a3d) background.

#### Scenario: Progress bar at 50%
- **WHEN** `<Progress value={50} />` is rendered
- **THEN** the fill occupies 50% of the bar width with indigo color

#### Scenario: Progress bar at 0%
- **WHEN** `<Progress value={0} />` is rendered
- **THEN** only the dark background track is visible with no fill

### Requirement: Tabs component
The system SHALL provide `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` components in `src/components/ui/tabs.tsx` based on `@radix-ui/react-tabs`. The component MUST support horizontal tab navigation with active state indicator.

#### Scenario: Tabs render with active state
- **WHEN** a Tabs component with two triggers is rendered and the first is selected
- **THEN** the first trigger shows active styling and its corresponding content is visible

#### Scenario: Tab switching works without layout shift
- **WHEN** user clicks the second tab trigger
- **THEN** the second tab becomes active and its content replaces the first WITHOUT any vertical movement or visual jump

#### Scenario: Tab indicator uses transparent border to prevent layout shift
- **WHEN** a TabsTrigger renders in inactive state
- **THEN** it has `border-b-2 border-transparent` reserving space
- **WHEN** a TabsTrigger becomes active
- **THEN** the border color changes to `border-primary` WITHOUT changing dimensions

### Requirement: Input component
The system SHALL provide an `Input` component in `src/components/ui/input.tsx` that wraps a standard HTML input element with shadcn styling. The component MUST support all standard input attributes and display focus ring with indigo (#6366f1) color.

#### Scenario: Input renders with dark theme styling
- **WHEN** `<Input placeholder="Enter path" />` is rendered
- **THEN** it displays with dark background (#0b1326), light text (#dae2fd), and border (#464554)

#### Scenario: Input shows focus ring
- **WHEN** user focuses the input
- **THEN** an indigo (#6366f1) focus ring appears around the input

### Requirement: Card component
The system SHALL provide `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` components in `src/components/ui/card.tsx`. The component MUST render as a bordered container with card background (#171f33) and border (#464554).

#### Scenario: Card renders with proper styling
- **WHEN** a Card with header, content, and footer is rendered
- **THEN** it displays as a bordered container with correct background and internal spacing

### Requirement: ScrollArea component
The system SHALL provide `ScrollArea` and `ScrollAreaViewport` components in `src/components/ui/scroll-area.tsx` based on `@radix-ui/react-scroll-area`. The component MUST provide styled scrollbars that match the dark theme.

#### Scenario: ScrollArea contains overflowing content
- **WHEN** content exceeds the ScrollArea height
- **THEN** a styled scrollbar appears and content is scrollable

### Requirement: Separator component
The system SHALL provide a `Separator` component in `src/components/ui/separator.tsx` based on `@radix-ui/react-separator`. The component MUST support `orientation` (horizontal/vertical) and render with border color (#464554).

#### Scenario: Horizontal separator renders
- **WHEN** `<Separator />` is rendered
- **THEN** a 1px horizontal line with color #464554 appears

### Requirement: Tooltip component
The system SHALL provide `Tooltip`, `TooltipTrigger`, `TooltipContent`, and `TooltipProvider` components in `src/components/ui/tooltip.tsx` based on `@radix-ui/react-tooltip`. The component MUST display tooltip content on hover with dark theme styling.

#### Scenario: Tooltip appears on hover
- **WHEN** user hovers over a TooltipTrigger element
- **THEN** TooltipContent appears with dark background and light text

### Requirement: Collapsible component
The system SHALL provide `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent` components in `src/components/ui/collapsible.tsx` based on `@radix-ui/react-collapsible`. The component MUST support expand/collapse with smooth animation.

#### Scenario: Collapsible toggles visibility
- **WHEN** user clicks a CollapsibleTrigger
- **THEN** CollapsibleContent expands or collapses with animation

### Requirement: Page components use shadcn components
All page components SHALL replace inline Tailwind patterns with the corresponding shadcn/ui components. The mapping MUST be:

| Current pattern | shadcn replacement |
|----------------|-------------------|
| Raw button elements | `Button` |
| Status badge spans | `Badge` |
| Manual progress divs | `Progress` |
| Custom tab buttons | `Tabs` / `TabsTrigger` |
| Raw input elements | `Input` |
| Card-like divs | `Card` |
| Overflow containers | `ScrollArea` |
| Border divs | `Separator` |
| Title attributes | `Tooltip` |
| Toggle tree nodes | `Collapsible` |

#### Scenario: OnboardingPage uses Button and Input
- **WHEN** OnboardingPage renders
- **THEN** the browse button uses `<Button>`, the path input uses `<Input>`, and the main container uses `<Card>`
- **AND** a "Try demo mode" ghost button appears below the card

#### Scenario: ChangesDashboard uses Badge and Progress
- **WHEN** ChangesDashboard renders
- **THEN** status indicators use `<Badge>`, progress bars use `<Progress>`, and action buttons use `<Button>`

#### Scenario: ChangeDetail uses Tabs
- **WHEN** ChangeDetail renders
- **THEN** artifact tabs use `<Tabs>` with `<TabsTrigger>` for each artifact

#### Scenario: KanbanPage uses Badge and Progress
- **WHEN** KanbanPage renders
- **THEN** card status dots use `<Badge>`, task progress uses `<Progress>`

#### Scenario: SpecsExplorer uses Collapsible
- **WHEN** SpecsExplorer renders
- **THEN** folder tree nodes use `<Collapsible>` for expand/collapse

### Requirement: Demo mode on OnboardingPage
The OnboardingPage SHALL provide a "Try demo mode" ghost button below the main card that loads realistic mock data from actual OpenSpec changes. The button MUST use the shadcn `Button` component with `variant="ghost"` and display a Sparkles icon. When clicked, it SHALL populate the workspace and changes stores with mock data and navigate to the changes dashboard.

#### Scenario: Demo mode button renders
- **WHEN** OnboardingPage renders
- **THEN** a ghost button with "Try demo mode" label and Sparkles icon appears below the main card

#### Scenario: Demo mode loads realistic data
- **WHEN** user clicks "Try demo mode"
- **THEN** workspace store is set with mock workspace path and changes store is populated with at least 2 changes with real artifact content

#### Scenario: Demo mode navigates to dashboard
- **WHEN** demo mode loads successfully
- **THEN** the user is navigated to `/changes` route

### Requirement: Realistic mock data from actual OpenSpec
The mock data in `src/lib/mock-data.ts` SHALL reflect real OpenSpec changes from the project's `openspec/` directory. Mock changes MUST include actual artifact content from proposal.md, specs.md, design.md, and tasks.md files. The spec tree MUST match the actual `openspec/specs/` folder structure.

#### Scenario: Mock changes reflect real project
- **WHEN** mock data is inspected
- **THEN** it includes `automated-releases-with-conventional-commits` and `migrate-to-shadcn-ui` changes

#### Scenario: Mock artifact content is realistic
- **WHEN** `MOCK_ARTIFACT_CONTENT` is read
- **THEN** it contains actual markdown content from real proposal, specs, design, and tasks files

#### Scenario: Mock spec tree matches openspec/specs/
- **WHEN** `MOCK_SPEC_TREE` is inspected
- **THEN** it includes architecture, download-page, features, github-actions-release, and npm-binary-wrapper directories
