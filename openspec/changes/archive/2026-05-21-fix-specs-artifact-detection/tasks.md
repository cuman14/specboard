## 1. Fix scan_artifacts in commands.rs

- [x] 1.1 In `scan_artifacts`, special-case the `specs` artifact to check for a `specs/` directory instead of `specs.md` (recursive walk for `specs/<capability>/spec.md` nesting)
- [x] 1.2 Return the directory path for the `specs` artifact (not `specs.md`)
- [x] 1.3 Mark `specs` status as `"ready"` only when the directory exists AND contains at least one `.md` file, otherwise `"missing"`

## 2. Tests

- [x] 2.1 Add a Jest unit test for the `scan_artifacts` behavior via the frontend mapping in `tauri-commands.ts` (mock Tauri invoke), covering: ready when `specs/` has `.md` files, missing when absent, missing when directory is empty
- [x] 2.2 Verify other artifacts (`proposal`, `design`, `tasks`) still detected as flat `.md` files in the same test suite

## 3. Verification

- [x] 3.1 Run the Tauri app against a real workspace and confirm the `specs` tab shows `ready` instead of `missing`
