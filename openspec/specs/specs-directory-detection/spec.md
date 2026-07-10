# specs-directory-detection Specification

## Purpose
TBD - created by archiving change fix-specs-artifact-detection. Update Purpose after archive.
## Requirements
### Requirement: Specs artifact detected as directory
The `scan_artifacts` function SHALL treat the `specs` artifact as a directory (`specs/`) rather than a flat file (`specs.md`).

#### Scenario: specs directory with markdown files
- **WHEN** a change directory contains a `specs/` subdirectory with at least one `.md` file
- **THEN** the `specs` artifact SHALL have status `"ready"` and path pointing to the `specs/` directory

#### Scenario: specs directory missing
- **WHEN** a change directory does not contain a `specs/` subdirectory
- **THEN** the `specs` artifact SHALL have status `"missing"`

#### Scenario: specs directory empty
- **WHEN** a change directory contains a `specs/` subdirectory but it contains no `.md` files
- **THEN** the `specs` artifact SHALL have status `"missing"`

#### Scenario: other artifacts unaffected
- **WHEN** scanning a change directory for `proposal`, `design`, or `tasks` artifacts
- **THEN** those artifacts SHALL continue to be detected as flat `.md` files (`proposal.md`, `design.md`, `tasks.md`)

