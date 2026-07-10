## Context

The dashboard currently has a 4-tab filter bar (`all`, `active`, `blocked`, `archived`) and a 4-column stats row. The `blocked` status is hardcoded as `"active"` in the Rust backend (`commands.rs`), so no change can ever be blocked. The stat card always shows 0 and the filter tab never returns results.

## Goals / Non-Goals

**Goals:**
- Remove all `blocked` references from the UI (filter bar, stats, types, store)
- Keep the UI clean with only `all`, `active`, `archived` tabs
- Update the spec to reflect the reduced surface

**Non-Goals:**
- Do NOT add a mechanism to set blocked status (that's a future change)
- Do NOT change the Rust backend status logic (still returns `"active"` for all non-archived changes)

## Decisions

1. **Remove `blocked` from the type union** — Since no code path produces `blocked`, keeping it in `ChangeStatus` is misleading. Removing it makes the type honest.

2. **Keep the `blocked` color in `statusColors` for now** — Actually no, remove it. If the type doesn't include it, the color mapping is dead code.

3. **Filter bar: 3 tabs instead of 4** — `all | active | archived`. This matches the actual states the system can produce.

## Risks / Trade-offs

- **Risk**: If a future change adds a blocked mechanism, the type and UI need to be re-added. **Mitigation**: The change is small (~15 lines) and well-scoped — easy to reverse.
