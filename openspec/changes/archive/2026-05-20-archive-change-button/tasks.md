## 1. Add AlertDialog component

- [x] 1.1 Run `pnpm dlx shadcn@latest add alert-dialog` to install the AlertDialog component into `src/components/ui/`
- [x] 1.2 Verify `src/components/ui/alert-dialog.tsx` was created successfully

## 2. Add archiveChange IPC wrapper

- [x] 2.1 Add `archiveChange(changeName: string, workspacePath: string): Promise<CommandResult>` to `src/lib/tauri-commands.ts` that calls `runOpenspecCommand("archive", ["--change", changeName], workspacePath)` and throws if `exitCode !== 0`

## 3. Add archiveChange action to the store

- [x] 3.1 Add `archiveChange: (changeName: string) => Promise<void>` to the `ChangesState` interface in `src/store/changes.store.ts`
- [x] 3.2 Implement the action: call `archiveChange` from `tauri-commands`, then call `loadChanges` with the current workspace path to refresh the list; handle mock mode by removing the change locally
- [x] 3.3 Write a Jest unit test for the `archiveChange` store action covering: success path (loadChanges called), failure path (error propagated), and mock mode (change removed from list)

## 4. Wire Archive button in ChangeDetail

- [x] 4.1 Import `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger` from `@/components/ui/alert-dialog` in `src/pages/ChangeDetail.tsx`
- [x] 4.2 Add `isArchiving` and `archiveError` state variables (`useState`) in `ChangeDetail`
- [x] 4.3 Add `handleArchive` async function that calls `useChangesStore.getState().archiveChange(change.name)`, then calls `navigate("/changes")`; sets `archiveError` on failure
- [x] 4.4 Compute `allTasksDone` boolean: `change.tasksTotal > 0 && change.tasksCompleted === change.tasksTotal`
- [x] 4.5 Wrap the existing Archive `<Button>` in `ChangeDetail` header inside an `<AlertDialog>` with `<AlertDialogTrigger asChild>`; set `disabled={!allTasksDone || isArchiving}` on the trigger button
- [x] 4.6 Add archive error display below the header when `archiveError` is set (same pattern as `validationError`)

## 5. Add Archive button to ChangeRow in ChangesDashboard

- [x] 5.1 Add `onArchive?: (change: Change) => void` prop to the `ChangeRow` component interface in `src/pages/ChangesDashboard.tsx`
- [x] 5.2 Inside `ChangeRow`, compute `allTasksDone = change.tasksTotal > 0 && change.tasksCompleted === change.tasksTotal`; render an Archive icon button only when `allTasksDone` is true, calling `onArchive?.(change)` on click and stopping event propagation so the row click is not triggered
- [x] 5.3 Add `pendingArchiveChange` state (`useState<Change | null>(null)`) to `ChangesDashboard` to track which change is pending confirmation
- [x] 5.4 Add a single `<AlertDialog>` in `ChangesDashboard` controlled by `open={pendingArchiveChange !== null}`; on confirm call `useChangesStore.getState().archiveChange(pendingArchiveChange.name)` then reset state; on cancel reset state
- [x] 5.5 Pass `onArchive={(change) => setPendingArchiveChange(change)}` to each `<ChangeRow>`

## 6. Verify end-to-end behaviour

- [x] 6.1 In mock mode: confirm the Archive button is disabled for changes with incomplete tasks and enabled for fully-completed ones
- [x] 6.2 In mock mode: confirm clicking Archive on a completed change opens the confirmation dialog, and confirming removes it from the list
- [x] 6.3 In Tauri mode (manual): open a change with all tasks checked, click Archive, confirm, verify the change moves to `openspec/archive/` and the UI navigates to `/changes`
