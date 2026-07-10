## 1. Remove `blocked` from types and store

- [x] 1.1 Remove `"blocked"` from `ChangeStatus` type in `src/types/index.ts`
- [x] 1.2 Remove `"blocked"` from the `filter` type union in `src/store/changes.store.ts`
- [x] 1.3 Update `getFilteredChanges` to remove `blocked` filter logic

## 2. Update ChangesDashboard UI

- [x] 2.1 Remove "Blocked" from the filter bar array (`["all", "active", "blocked", "archived"]` → `["all", "active", "archived"]`)
- [x] 2.2 Remove the "Blocked" stat card from the stats row
- [x] 2.3 Remove `blocked` from `statusColors` mapping

## 3. Update ChangeDetail UI

- [x] 3.1 Remove `blocked` from `statusColors` mapping in `ChangeDetail.tsx`

## 4. Update specs

- [x] 4.1 Apply delta spec to `openspec/specs/features/spec.md` (remove blocked references from "Archived changes tab" and "Change detail shows status badge" requirements)
