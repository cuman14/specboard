## Why

Cuando un usuario hace `scoop update specboard`, Scoop intenta desinstalar la versión anterior usando `$env:LOCALAPPDATA\Specboard\uninstall.exe /S`. Si la versión anterior fue instalada fuera de Scoop (descarga directa) o el NSIS la instaló en `%PROGRAMFILES%`, el `uninstall.exe` no existe en esa ruta, Scoop falla silenciosamente y la versión nueva se instala encima sin reemplazar el ejecutable viejo. El usuario ve la versión antigua en la app.

## What Changes

- Reemplazar el bloque `uninstaller` de `scoop/specboard.json` por un script que busca el uninstaller en el registry de Windows en lugar de una ruta hardcodeada
- El nuevo script busca la clave `HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall` y `HKLM:\...` para localizar el uninstaller real de cualquier versión previa de Specboard antes de instalar la nueva
- Agregar un paso `pre_install` que termina el proceso `Specboard.exe` si está corriendo antes de desinstalar/instalar

## Capabilities

### New Capabilities

- `scoop-upgrade-reliability`: Actualizaciones de Scoop que funcionan correctamente independientemente de cómo se instaló la versión anterior, localizando el uninstaller via registry de Windows.

### Modified Capabilities

## Impact

- `scoop/specboard.json` → modificado: bloques `pre_install`, `installer`, `uninstaller`
- No hay cambios en el pipeline de CI ni en los scripts de SHA256
- Compatible con instalaciones existentes (el script de pre_install es graceful si no hay versión previa)
