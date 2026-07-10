## Why

The current release workflow uses a manual `git clone` with an embedded PAT token URL to push the Homebrew Cask file to the external `cuman14/homebrew-specboard` tap repo. This approach is fragile (fails on 403 if the PAT scope or repository access is misconfigured), hard to audit, and exposes the token in the git remote URL within the CI log context.

Replacing the manual clone with `actions/checkout` using an explicit `token` parameter leverages GitHub Actions' built-in authentication, provides better audit trails, and eliminates the need to embed tokens in clone URLs.

## What Changes

- Replace the "Sincronizar Cask al tap remoto (homebrew-specboard)" step in `release.yml` with `actions/checkout@v4` pointing to `cuman14/homebrew-specboard` using `RELEASE_TOKEN`
- Remove the separate "Verificar acceso al tap antes del clone" step (checkout with a bad token will fail with a clear error, making the manual pre-check redundant)
- Use a dedicated `path` (e.g., `homebrew-tap`) for the checkout to keep it isolated from the main repo checkout
- Commit and push changes using standard `git` commands within the checked-out tap repo

## Capabilities

### New Capabilities

- `homebrew-crossrepo-push`: Replaces manual `git clone` with `actions/checkout` for pushing Cask updates to the external Homebrew tap repository, improving security, auditability, and error handling.

### Modified Capabilities

- `homebrew-cask-distribution`: The CI update requirement changes from "clone + copy + push" to "checkout + copy + push", making the cross-repo synchronization step use `actions/checkout` instead of a raw git clone with embedded credentials.

## Impact

- `.github/workflows/release.yml`: Two steps removed (verify access, sync Cask via clone), replaced by a single `actions/checkout` step + file copy + git push step
- Secret `RELEASE_TOKEN` must continue to have `Contents: Read & Write` access on `cuman14/homebrew-specboard` (no change in permissions required)
- No changes to `update-sha256.js` or the Cask file itself