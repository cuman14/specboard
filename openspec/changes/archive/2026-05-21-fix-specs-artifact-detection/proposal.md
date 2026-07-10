## Why

The `specs` artifact tab in the Tauri app always shows `missing` status even when a `specs/` directory with content exists. The `scan_artifacts` function in `commands.rs` looks for `specs.md` (a flat file), but OpenSpec stores specs as a directory (`specs/`), causing a permanent false negative.

## What Changes

- Fix `scan_artifacts` in `src-tauri/src/commands.rs` to detect `specs/` as a directory instead of looking for `specs.md`
- The `specs` artifact path returned should point to the directory, not a non-existent `.md` file
- The `read_artifact` command already handles directory paths by looking for `spec.md` inside — no change needed there
- Update the artifact status detection logic: `specs` is `ready` if the `specs/` directory exists and contains at least one `.md` file, otherwise `missing`

## Capabilities

### New Capabilities

- `specs-directory-detection`: Correctly detect and report the status of the `specs/` directory artifact in a change

### Modified Capabilities

- (none)

## Impact

- `src-tauri/src/commands.rs` — `scan_artifacts` function
- Frontend behavior: `specs` tab will correctly show `ready` instead of `missing` when `specs/` directory exists
