## Context

El repositorio `cuman14/specboard` actúa como tap de Homebrew. Brew espera que los casks (paquetes que instalan apps `.app`) estén en `Casks/<name>.rb`. Actualmente el `.rb` vive en `homebrew/specboard.rb` (ignorado por brew) y existe un `Formula/specboard.rb` abandonado con datos inválidos. El CI actualiza `homebrew/specboard.rb` correctamente pero brew nunca lo lee.

## Goals / Non-Goals

**Goals:**
- `brew tap cuman14/specboard && brew install --cask specboard` funciona correctamente
- El CI sigue actualizando SHA256 y versión automáticamente, ahora en `Casks/specboard.rb`
- Eliminar el `Formula/specboard.rb` para evitar confusión

**Non-Goals:**
- Crear un repo separado de homebrew tap
- Soportar Intel Mac (no hay runner de CI disponible)
- Cambiar el pipeline de release-it

## Decisions

**Decisión 1: `Casks/` en lugar de `homebrew/`**
Brew busca casks en `Casks/` cuando el repo actúa como tap. No hay alternativa: la especificación de brew es fija. El directorio `homebrew/` es completamente ignorado por brew.

**Decisión 2: Mantener el mismo contenido del `.rb`, solo mover la ruta**
El contenido de `homebrew/specboard.rb` es correcto (sintaxis de cask, `on_arm do`, SHA256 real). Solo cambia la ruta del archivo.

**Decisión 3: Actualizar `update-sha256.js` y `sync-versions.js` para apuntar a `Casks/`**
Estos scripts construyen la ruta con `path.join(root, "homebrew", "specboard.rb")`. Basta con cambiar `"homebrew"` a `"Casks"`.

**Decisión 4: Actualizar `git add` en el workflow**
El job `update-manifests` hace `git add scoop/specboard.json homebrew/specboard.rb`. Debe incluir `Casks/specboard.rb` y quitar `homebrew/specboard.rb`.

## Risks / Trade-offs

- **[Usuarios con tap ya instalado]** → Deben hacer `brew untap cuman14/specboard && brew tap cuman14/specboard` para que brew detecte la nueva estructura. Documentar en README.
- **[Formula/ eliminada]** → Si algún usuario tenía la formula instalada (improbable dado que nunca funcionó), necesita desinstalar manualmente. Riesgo mínimo.
- **[Rename vs delete+create en git]** → Git trackeará `homebrew/specboard.rb` como eliminado y `Casks/specboard.rb` como nuevo. No hay `git mv` porque son archivos distintos en CI. Sin impacto funcional.

## Migration Plan

1. Crear `Casks/specboard.rb` con el contenido actual de `homebrew/specboard.rb`
2. Eliminar `homebrew/specboard.rb` y `Formula/specboard.rb`
3. Actualizar rutas en `update-sha256.js` y `sync-versions.js`
4. Actualizar `git add` en `.github/workflows/release.yml`
5. Hacer commit y push → el próximo release actualizará `Casks/specboard.rb` automáticamente
6. Actualizar README con instrucción `brew install --cask specboard`

**Rollback:** Revertir el commit. El tap quedaría roto igual que antes.
