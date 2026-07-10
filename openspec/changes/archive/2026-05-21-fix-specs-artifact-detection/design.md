## Context

The Tauri backend (`src-tauri/src/commands.rs`) scans a change directory to build a list of artifacts with their status. The `scan_artifacts` function currently uses a uniform pattern of `<name>.md` for all four artifacts. However, the `specs` artifact is a directory (`specs/`) not a flat file. This causes the `specs` artifact to always report `"missing"` in the UI.

The `read_artifact` command already handles this case — when given a directory path, it reads `spec.md` inside it. So only the detection side is broken.

## Goals / Non-Goals

**Goals:**
- `specs` artifact reports `"ready"` when `specs/` directory exists and contains at least one `.md` file
- `specs` artifact path points to the `specs/` directory (not `specs.md`)
- All other artifacts (`proposal`, `design`, `tasks`) continue to work as flat `.md` files

**Non-Goals:**
- Changing the `read_artifact` logic (already correct)
- Supporting other artifact directory formats
- Changing the frontend

## Decisions

**Detection logic for `specs`**: Check if `specs/` directory exists and recursively contains at least one `.md` file. This mirrors reality — a `specs/` dir with no `.md` files is not yet populated.

Alternative: just check if `specs/` directory exists (regardless of content). Rejected — an empty directory is ambiguous and should be treated as `missing`.

**Path returned for `specs`**: Return the directory path (`change_path/specs`) instead of `change_path/specs.md`. The `read_artifact` command already handles this correctly.

## Risks / Trade-offs

- [Risk]: Over-engineering the detection → Mitigation: keep the fix minimal, only special-case `specs` by name
- [Risk]: Introducing a separate code path makes future artifact additions need awareness of this → Mitigation: document the pattern in code comment

## Migration Plan

Single-file change in `commands.rs`. No migration needed — purely additive behavioral fix. Rebuild Tauri app to apply.
