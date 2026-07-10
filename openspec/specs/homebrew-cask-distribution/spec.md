# homebrew-cask-distribution Specification

## Purpose
TBD - created by archiving change fix-homebrew-tap-structure. Update Purpose after archive.
## Requirements
### Requirement: Cask file ubicado en directorio correcto
El repositorio SHALL contener el cask de Homebrew en `Casks/specboard.rb` para que `brew tap cuman14/specboard` lo detecte automáticamente.

#### Scenario: brew tap detecta el cask
- **WHEN** el usuario ejecuta `brew tap cuman14/specboard`
- **THEN** brew indexa `Casks/specboard.rb` sin errores

#### Scenario: brew install cask funciona
- **WHEN** el usuario ejecuta `brew install --cask specboard`
- **THEN** brew descarga el DMG desde la URL en `Casks/specboard.rb` y lo instala

### Requirement: Archivos de fórmula/cask duplicados eliminados
El repositorio SHALL NOT contener `homebrew/specboard.rb` ni `Formula/specboard.rb`.

#### Scenario: No existe directorio homebrew con .rb
- **WHEN** se lista el directorio `homebrew/`
- **THEN** no existe o no contiene ningún archivo `.rb`

#### Scenario: No existe Formula/specboard.rb
- **WHEN** se lista el directorio `Formula/`
- **THEN** no contiene `specboard.rb`

### Requirement: CI actualiza Casks/specboard.rb automáticamente
El pipeline de CI SHALL actualizar `Casks/specboard.rb` con la versión y SHA256 correctos después de cada build exitoso.

#### Scenario: SHA256 actualizado tras release
- **WHEN** el job `update-manifests` completa con éxito
- **THEN** `Casks/specboard.rb` contiene la versión y SHA256 del DMG recién construido

#### Scenario: Commit de CI apunta a Casks/
- **WHEN** el job `update-manifests` hace `git add`
- **THEN** el commit incluye `Casks/specboard.rb` (no `homebrew/specboard.rb`)

