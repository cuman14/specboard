## ADDED Requirements

### Requirement: Cross-repo push uses actions/checkout instead of git clone
The CI pipeline SHALL use `actions/checkout@v4` with `repository`, `token`, and `path` parameters to check out the external Homebrew tap repository (`cuman14/homebrew-specboard`) instead of manually running `git clone` with an embedded token URL.

#### Scenario: Checkout tap repo for Cask update
- **WHEN** the `update-manifests` job reaches the Homebrew tap sync step
- **THEN** it checks out `cuman14/homebrew-specboard` using `actions/checkout@v4` with `token: ${{ secrets.RELEASE_TOKEN }}` and `path: homebrew-tap`

#### Scenario: Invalid token fails with clear error
- **WHEN** `RELEASE_TOKEN` lacks access to `cuman14/homebrew-specboard`
- **THEN** `actions/checkout` fails with a clear authentication error, and the workflow stops before any push attempt

### Requirement: Pre-flight HTTP access check is removed
The CI pipeline SHALL NOT include a separate HTTP verification step (`curl` to GitHub API) before the cross-repo push. The `actions/checkout` step itself SHALL serve as the authentication gate.

#### Scenario: No separate verification step
- **WHEN** the `update-manifests` job runs
- **THEN** there is no step named "Verificar acceso al tap antes del clone" or equivalent HTTP pre-check before pushing to the tap repo

## MODIFIED Requirements

### Requirement: CI actualiza Casks/specboard.rb automáticamente
El pipeline de CI SHALL actualizar `Casks/specboard.rb` en el repositorio externo `cuman14/homebrew-specboard` después de cada release exitoso, utilizando `actions/checkout` para clonar el repo del tap y luego copiando y pusheando el archivo actualizado.

#### Scenario: Cask sincronizado tras release
- **WHEN** el job `update-manifests` completa con éxito
- **THEN** `Casks/specboard.rb` en `cuman14/homebrew-specboard` contiene la versión y SHA256 del DMG recién construido

#### Scenario: Commit de CI usa actions/checkout
- **WHEN** el job `update-manifests` ejecuta el paso de sincronización
- **THEN** el paso usa `actions/checkout@v4` con `repository: cuman14/homebrew-specboard`, `token: ${{ secrets.RELEASE_TOKEN }}`, y `path: homebrew-tap` para obtener el repo del tap, y luego `git commit` + `git push` dentro de ese directorio