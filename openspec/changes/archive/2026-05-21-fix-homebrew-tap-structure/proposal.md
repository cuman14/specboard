## Why

El tap de Homebrew `cuman14/specboard` no funciona porque el archivo `specboard.rb` está en `homebrew/` en lugar de `Casks/`, que es el directorio que brew busca para casks (fórmulas con `app "..."`). Adicionalmente existe un `Formula/specboard.rb` abandonado con una URL falsa (`v1.1.0`, SHA256 placeholder) que confunde a brew. Esto hace que `brew install specboard` falle con 404.

## What Changes

- Crear `Casks/specboard.rb` moviendo el contenido de `homebrew/specboard.rb`
- Eliminar `homebrew/specboard.rb` (directorio incorrecto para brew tap)
- Eliminar `Formula/specboard.rb` (placeholder abandonado con datos incorrectos)
- Actualizar `scripts/deploy/update-sha256.js` para escribir en `Casks/specboard.rb`
- Actualizar `scripts/deploy/sync-versions.js` para escribir en `Casks/specboard.rb`
- Actualizar `.github/workflows/release.yml` para hacer `git add Casks/specboard.rb`

## Capabilities

### New Capabilities

- `homebrew-cask-distribution`: Distribución funcional de Specboard via `brew tap cuman14/specboard && brew install --cask specboard`, con el `.rb` en la ubicación correcta (`Casks/`) y actualización automática por CI.

### Modified Capabilities

## Impact

- `homebrew/specboard.rb` → eliminado
- `Formula/specboard.rb` → eliminado
- `Casks/specboard.rb` → nuevo (contenido migrado y corregido)
- `scripts/deploy/update-sha256.js` → ruta de escritura cambia a `Casks/`
- `scripts/deploy/sync-versions.js` → ruta de escritura cambia a `Casks/`
- `.github/workflows/release.yml` → `git add` apunta a `Casks/specboard.rb`
- Los usuarios deben re-hacer `brew untap` + `brew tap` para que brew detecte la nueva ubicación
