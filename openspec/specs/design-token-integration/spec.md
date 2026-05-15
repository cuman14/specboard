# Spec: Design Token Integration

## Purpose
Define the CSS variable design token system that maps shadcn/ui semantic color tokens to Specboard's existing design palette, ensuring consistent theming across all components.

## Requirements

### Requirement: CSS variable design token system
The project SHALL define CSS custom properties in `src/index.css` that map shadcn/ui semantic color tokens to Specboard's existing design palette. All shadcn components SHALL reference these variables instead of hardcoded hex values.

#### Scenario: CSS variables are defined
- **WHEN** the application loads
- **THEN** `src/index.css` defines `--background`, `--foreground`, `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, and `--radius` variables

#### Scenario: Variables match Specboard palette
- **WHEN** CSS variables are inspected
- **THEN** `--background` is `#0b1326`, `--primary` is `#6366f1`, `--card` is `#171f33`, `--border` is `#464554`, and `--radius` is `0.25rem`

### Requirement: Font tokens preserved
The CSS variable system SHALL preserve existing font configuration: `--font-sans` for Inter and `--font-mono` for JetBrains Mono. shadcn components SHALL use these font tokens for their default typography.

#### Scenario: Fonts are applied correctly
- **WHEN** the application renders
- **THEN** body text uses Inter and code/metadata uses JetBrains Mono

### Requirement: Tailwind CSS v4 compatibility
The shadcn/ui configuration MUST be compatible with Tailwind CSS v4 using the `@tailwindcss/vite` plugin. The `components.json` configuration MUST specify `tailwindcss` as the CSS framework and point to the correct CSS file path.

#### Scenario: shadcn CLI works with Tailwind v4
- **WHEN** `pnpm dlx shadcn@latest add button` is executed
- **THEN** the component is generated without errors and styles are applied correctly

### Requirement: tailwindcss-animate plugin installed
The project SHALL install and configure `tailwindcss-animate` to support shadcn animation utilities. The plugin MUST be imported in the Tailwind configuration.

#### Scenario: Animation utilities are available
- **WHEN** a shadcn component with animation classes is rendered
- **THEN** animation utilities like `animate-in`, `fade-in`, and `slide-in` work correctly

### Requirement: No hardcoded hex colors in components
All component styles SHALL use Tailwind CSS utility classes that reference design tokens defined in `src/index.css`. Hardcoded hex values (e.g., `bg-[#0b1326]`, `text-[#908fa0]`, `border-[#464554]`) are NOT permitted in any component file.

#### Scenario: Component uses theme tokens
- **WHEN** OnboardingPage renders
- **THEN** all colors use Tailwind classes like `bg-bg`, `bg-surface`, `text-text`, `text-text-subtle`, `border-border`

#### Scenario: No hardcoded hex values exist
- **WHEN** scanning all `.tsx` files in `src/components/` and `src/pages/`
- **THEN** no `#[0-9a-fA-F]{6}` patterns appear in className strings

#### Scenario: AGENTS.md documents the rule
- **WHEN** AGENTS.md is read
- **THEN** a "No hardcoded hex colors in components" section exists with the complete color token reference table
