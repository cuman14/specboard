## MODIFIED Requirements

### Requirement: CI actualiza Casks/specboard.rb automáticamente
El pipeline de CI SHALL actualizar `Casks/specboard.rb` con la versión y SHA256 correctos después de cada build exitoso, sincronizando el archivo al tap remoto mediante `actions/checkout` en lugar de `git clone` manual.

#### Scenario: SHA256 actualizado tras release
- **WHEN** el job `update-manifests` completa con éxito
- **THEN** `Casks/specboard.rb` contiene la versión y SHA256 del DMG recién construido

#### Scenario: Commit de CI apunta a Casks/
- **WHEN** el job `update-manifests` hace `git add`
- **THEN** el commit incluye `Casks/specboard.rb` (no `homebrew/specboard.rb`)

#### Scenario: Sincronización usa actions/checkout
- **WHEN** el job `update-manifests` sincroniza el Cask al tap remoto
- **THEN** utiliza `actions/checkout@v4` con `repository: cuman14/homebrew-specboard` y `token: ${{ secrets.RELEASE_TOKEN }}` en lugar de `git clone` con URL que incluye el token