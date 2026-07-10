## Context

The ChangeDetail page has a Validate button in the header (line 137-140) with no `onClick` handler. The backend already supports running arbitrary openspec commands via `run_openspec_command(cmd, args, cwd)`. The `openspec validate <change-name> --json` command returns structured JSON with validation results.

Current UI pattern: buttons in the header use `active:scale-95 transition-transform` for press feedback. Toast/banner patterns are not yet in the codebase.

## Goals / Non-Goals

**Goals:**
- Validate button runs `openspec validate <change-name> --json` in the workspace directory
- Results render as a dismissible banner below the header
- Banner shows check/warning/error counts with per-item details
- Loading spinner on button while validation runs
- Works in both Tauri (real) and web (mock) modes

**Non-Goals:**
- No validation from the Kanban board or Changes list (only ChangeDetail)
- No `--all` or `--strict` flags exposed in UI (v1 uses default flags)
- No auto-fix or remediation actions
- No validation history or caching

## Decisions

### 1. Inline banner, not toast or dialog

**Decision**: Render validation results as an inline banner between the header and the tabs area.

**Rationale**:
- Toasts auto-dismiss too quickly for users to read multiple warnings
- Dialogs block interaction and feel heavyweight for a routine action
- Inline banner stays visible, is scannable, and doesn't block the page

**Alternatives considered**:
- Toast notification — too ephemeral for structured results
- Modal dialog — too disruptive
- Console-only output — invisible to users

### 2. Reuse `run_openspec_command`, no new Rust code

**Decision**: Use the existing `run_openspec_command("validate", [changeName, "--json"], cwd)` IPC call.

**Rationale**:
- No new Rust code needed
- `CommandResult` already has stdout/stderr/exit_code
- Keeps backend surface area minimal

### 3. Parse `--json` output, not text

**Decision**: Always pass `--json` flag and parse the JSON response.

**Rationale**:
- Structured data enables per-check rendering (icons, counts, colors)
- Text output would require regex parsing and is fragile
- The JSON shape is documented: `{ results: { changes: [...] }, summary: { total, valid, invalid } }`

### 4. Mock data for web mode

**Decision**: In non-Tauri mode, simulate a validation result after a short delay.

**Rationale**:
- Consistent with existing mock data pattern in the app
- Allows UI testing without openspec CLI

### 5. TypeScript interface for validation results

**Decision**: Define `ValidationResult`, `ValidationCheck`, and `ValidationSummary` types in `src/types/index.ts`.

**Rationale**:
- Type-safe parsing of JSON output
- Shared between Tauri command wrapper and mock data

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `openspec validate` takes long on large changes | Button shows loading state; no timeout in v1 (can add later) |
| JSON parse fails if openspec version changes | Wrap in try/catch; fall back to showing raw stderr |
| Banner takes too much vertical space | Collapsible details section; summary always visible |
| Mock result doesn't match real output shape | Mock follows same `ValidationResult` interface |
