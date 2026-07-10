## Why

The dashboard currently shows a "Blocked" filter tab and stat counter, but there is no mechanism in the OpenSpec filesystem to set a change as blocked. This creates permanent UI noise — a stat that always shows 0 and a filter tab that never displays results.

## What Changes

- Remove `blocked` from the filter bar in `ChangesDashboard`
- Remove the "Blocked" stat card from the stats row
- Remove `blocked` from the `ChangeStatus` type union
- Remove `blocked` from the store's filter type
- Update `ChangeDetail` status colors to only use `active` and `archived`
- Update the `features` spec to remove the blocked-related requirement

## Capabilities

### New Capabilities

### Modified Capabilities
- `features`: Remove the blocked filter tab and stat card requirements; update status badge colors to only cover `active` and `archived`

## Impact

- `src/types/index.ts` — ChangeStatus type
- `src/store/changes.store.ts` — filter type, getFilteredChanges logic
- `src/pages/ChangesDashboard.tsx` — filter bar, stats row
- `src/pages/ChangeDetail.tsx` — statusColors mapping
- `openspec/specs/features/spec.md` — delta spec to remove blocked requirements
