## 1. Types and Mock Data

- [x] 1.1 Add `ValidationResult`, `ValidationCheck`, and `ValidationSummary` interfaces to `src/types/index.ts`
- [x] 1.2 Add mock validation result to `src/lib/mock-data.ts` for web mode

## 2. Tauri Command Wrapper

- [x] 2.1 Add `validateChange(changeName: string, cwd: string)` typed wrapper to `src/lib/tauri-commands.ts`
- [x] 2.2 Export the new function from the module

## 3. ValidationBanner Component

- [x] 3.1 Create `src/components/changes/ValidationBanner.tsx` with props for `ValidationResult`
- [x] 3.2 Implement summary row (icon, status text, counts)
- [x] 3.3 Implement expandable details section for each warning/error
- [x] 3.4 Add dismiss button functionality
- [x] 3.5 Style using design tokens (success/warning/error colors)

## 4. ChangeDetail Integration

- [x] 4.1 Add `isValidationLoading` and `validationResult` state to ChangeDetail
- [x] 4.2 Wire Validate button `onClick` to call `validateChange` (Tauri) or mock (web)
- [x] 4.3 Add loading spinner to button while validation runs
- [x] 4.4 Render `ValidationBanner` between header and tabs when result exists
- [x] 4.5 Handle error states (command failure, parse error)

## 5. Verification

- [x] 5.1 Test validate button in Tauri mode with real openspec CLI
- [x] 5.2 Test validate button in web mode with mock data
- [x] 5.3 Verify banner renders correctly for valid, warning, and error states
- [x] 5.4 Verify dismiss functionality works
- [x] 5.5 Run `pnpm tsc --noEmit` — zero errors
