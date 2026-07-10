## 1. Actualizar scoop/specboard.json

- [x] 1.1 Agregar bloque `pre_install` con PowerShell para terminar el proceso `Specboard.exe` gracefully: `Stop-Process -Name "Specboard" -Force -ErrorAction SilentlyContinue`
- [x] 1.2 Reemplazar el bloque `uninstaller.script` con un script PowerShell que busca el `UninstallString` en `HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*` y `HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*` filtrando por `DisplayName` que contenga "Specboard"
- [x] 1.3 El script de uninstall debe manejar `UninstallString` con y sin argumentos (parsear con `Split-Path` si es necesario)
- [x] 1.4 El script de uninstall debe completar sin error si no hay ninguna versión previa instalada (`-ErrorAction SilentlyContinue`)
- [x] 1.5 Verificar que el bloque `installer` existente se mantiene sin cambios

## 2. Verificación manual

- [x] 2.1 Verificar el JSON es válido con `node -e "JSON.parse(require('fs').readFileSync('scoop/specboard.json','utf8'))"`
- [x] 2.2 Verificar que el script PowerShell del `pre_install` es sintaxis válida
- [x] 2.3 Verificar que el script PowerShell del `uninstaller` es sintaxis válida

## 3. Actualizar documentación

- [x] 3.1 En `README.md`, añadir nota en la sección de Windows indicando que si se tenía una instalación previa directa (no via Scoop), hay que desinstalar manualmente una vez antes de usar Scoop
