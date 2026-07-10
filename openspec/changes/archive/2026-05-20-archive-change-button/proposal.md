## Why

Users have no UI affordance in Specboard to archive a change once all tasks are completed. Archiving must be triggered manually from the terminal, breaking the desktop-first workflow the app is meant to provide.

## What Changes

- Add an "Archive" button to the change detail view and change cards that becomes enabled only when all tasks for that change are completed (`tasksCompleted === tasksTotal && tasksTotal > 0`)
- Clicking the button calls the `openspec archive --change <name>` CLI command via the existing `run_openspec_command` Tauri IPC
- Show a confirmation dialog before archiving to prevent accidental actions
- After successful archiving, refresh the workspace/changes list and navigate away from the now-archived change

## Capabilities

### New Capabilities
- `archive-change-action`: UI action (button + confirmation dialog) that archives a change via the OpenSpec CLI, enabled only when all tasks are done

### Modified Capabilities
- `features/dashboard`: Change cards on the dashboard gain an archive button in their action area when all tasks are completed

## Impact

- `src/pages/ChangeDetail.tsx` — add Archive button in the action bar
- `src/components/changes/ChangeCard.tsx` — add Archive button when all tasks done
- `src/lib/tauri-commands.ts` — add `archiveChange(name)` typed wrapper
- `src/store/changes.store.ts` — add `archiveChange` action that calls IPC and refreshes state
- No new dependencies required; uses existing `run_openspec_command` IPC command
