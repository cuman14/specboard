## Why

The Validate button in ChangeDetail is currently a dead UI element — it has no `onClick` handler and does nothing when clicked. Users expect it to run `openspec validate` and see the results, but the app provides no feedback.

## What Changes

- **Wire Validate button** to call `openspec validate <change-name> --json` via existing `run_openspec_command` IPC
- **Add validation result banner** that appears below the header showing pass/fail status, warnings, and errors
- **Parse JSON output** from `openspec validate` and render structured results (checks, warnings, errors)
- **Show loading state** on button while validation runs
- **Auto-dismiss banner** after a few seconds or allow manual dismiss

## Capabilities

### New Capabilities
- `validate-command-ui`: Frontend integration for `openspec validate` with banner output, loading states, and structured result display

### Modified Capabilities
- *(none)*

## Impact

- `src/pages/ChangeDetail.tsx` — add onClick handler, state, and banner component
- `src/types/index.ts` — add `ValidationResult` type
- `src/lib/tauri-commands.ts` — add typed `validateChange` wrapper
- No backend changes needed — `run_openspec_command` already supports arbitrary subcommands
