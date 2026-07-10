## 1. Reorganizar archivos del cask

- [x] 1.1 Crear directorio `Casks/` en la raíz del repo
- [x] 1.2 Copiar contenido de `homebrew/specboard.rb` a `Casks/specboard.rb`
- [x] 1.3 Eliminar `homebrew/specboard.rb`
- [x] 1.4 Eliminar `Formula/specboard.rb`
- [x] 1.5 Eliminar directorios `homebrew/` y `Formula/` si quedan vacíos

## 2. Actualizar scripts de deploy

- [x] 2.1 En `scripts/deploy/update-sha256.js`, cambiar `path.join(root, "homebrew", "specboard.rb")` por `path.join(root, "Casks", "specboard.rb")`
- [x] 2.2 En `scripts/deploy/sync-versions.js`, cambiar la ruta `homebrew/specboard.rb` por `Casks/specboard.rb` en la constante `homebrewPath`
- [x] 2.3 En `scripts/deploy/sync-versions.js`, actualizar el `console.log` de confirmación para reflejar la nueva ruta

## 3. Actualizar workflow de CI

- [x] 3.1 En `.github/workflows/release.yml`, en el job `update-manifests`, cambiar `git add scoop/specboard.json homebrew/specboard.rb` por `git add scoop/specboard.json Casks/specboard.rb`

## 4. Actualizar documentación

- [x] 4.1 En `README.md`, cambiar la instrucción de instalación macOS de `brew install specboard` a `brew install --cask specboard`
- [x] 4.2 En `README_TAP.md`, cambiar `brew install specboard` por `brew install --cask specboard`
- [x] 4.3 En `AGENTS.md`, actualizar la sección de deployment para reflejar la ruta `Casks/specboard.rb`

## 5. Verificación

- [x] 5.1 Verificar que `Casks/specboard.rb` existe con versión `0.4.7` y SHA256 correcto
- [x] 5.2 Verificar que `homebrew/` y `Formula/` ya no contienen `.rb`
- [x] 5.3 Hacer commit y push — el próximo release debe actualizar `Casks/specboard.rb` automáticamente
