## Context

The release workflow in `.github/workflows/release.yml` uses a manual `git clone` with an embedded PAT URL to push the Homebrew Cask file (`Casks/specboard.rb`) to the external tap repository `cuman14/homebrew-specboard`. This pattern (lines 292–305) introduces fragility: an explicit pre-flight HTTP check (lines 277–290) is needed to verify PAT access, and the token is exposed in the clone URL within the workflow's environment context.

The solution replaces both the verification step and the manual clone+push step with `actions/checkout@v4` using the `token` parameter, which is the idiomatic GitHub Actions pattern for cross-repository pushes.

## Goals / Non-Goals

**Goals:**
- Replace manual `git clone` with `actions/checkout` for the Homebrew tap sync step
- Remove the redundant pre-flight HTTP access check (checkout fails with clear error on auth issues)
- Maintain the same end result: `Casks/specboard.rb` updated in `cuman14/homebrew-specboard` after each release
- Keep using `RELEASE_TOKEN` secret (no new permission scopes needed)

**Non-Goals:**
- Changing how the main repo's `Casks/specboard.rb` is updated (that stays via `update-sha256.js`)
- Changing the Homebrew Cask file format or content
- Switching from `RELEASE_TOKEN` to a different authentication mechanism
- Adding retry logic or exponential backoff to the push step

## Decisions

### Decision 1: Use `actions/checkout` instead of `git clone`

**Choice**: `actions/checkout@v4` with `repository: cuman14/homebrew-specboard` and `token: ${{ secrets.RELEASE_TOKEN }}`

**Alternatives considered**:
- **Keep manual `git clone`**: Current approach works but is harder to audit, requires a separate pre-flight check, and embeds the token in a URL
- **GitHub API push (PUT /repos/{owner}/{repo}/contents/...)**: Avoids cloning entirely but has a 1 MB file size limit and requires base64 encoding — unnecessary complexity for a single Ruby file
- **GitHub Action for Homebrew tap sync (e.g., `danielmason/Homebrew-Tap-Action`)**: Adds a third-party dependency; our approach is two lines with native actions

**Rationale**: `actions/checkout` is the standard GitHub Actions pattern. It handles authentication, Git configuration, and shallow clone optimization automatically. It produces clearer error messages on auth failures than a curl pre-check.

### Decision 2: Remove the pre-flight HTTP check

**Choice**: Remove the "Verificar acceso al tap antes del clone" step entirely.

**Rationale**: `actions/checkout` with an invalid or misconfigured token produces a clear `403 Forbidden` error immediately. The separate curl check adds a step, delays the workflow, and can give false confidence (200 on repos with read access but no write access). The checkout step will fail fast and visibly if the token lacks permissions.

### Decision 3: Use `path: homebrew-tap` for checkout isolation

**Choice**: Check out the tap repo into `homebrew-tap/` subdirectory (not `tap/` as the old step used, to make the purpose explicit).

**Rationale**: Using a descriptive path avoids confusion with generic `tap/` and aligns with the `actions/checkout` convention of using meaningful directory names.

### Decision 4: Keep `RELEASE_TOKEN` as-is

**Choice**: Continue using the existing `RELEASE_TOKEN` secret, which already has `Contents: Read & Write` access on `cuman14/homebrew-specboard`.

**Rationale**: No new permissions are needed. The token already works for cross-repo pushes. No migration of secrets required.

## Risks / Trade-offs

- **Token scope mismatch**: If `RELEASE_TOKEN` only has read access to the tap repo, `actions/checkout` will succeed but `git push` will fail. → **Mitigation**: The push step's error message is clear (`403` from GitHub), and the existing AGENTS.md documentation already describes the required token scopes.

- **Shallow clone default**: `actions/checkout` defaults to `fetch-depth: 1`, which is fine for our use case since we only need the latest state of the repo to copy a file and push. No history is needed.

- **Race condition with concurrent releases**: Two workflows pushing at the same time could conflict. → **Mitigation**: Same risk as the current approach; releases are sequential by design (release-it runs on main push, builds are serialized).

- **Breaking change to CI**: Swapping the steps changes the workflow structure. → **Mitigation**: The new approach is simpler (fewer steps, no manual clone), and any failure will be immediately visible in the workflow log.