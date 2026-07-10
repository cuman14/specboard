## Context

Scoop maneja upgrades desinstalando la versión anterior antes de instalar la nueva. El `uninstaller` actual en `scoop/specboard.json` apunta a `$env:LOCALAPPDATA\Specboard\uninstall.exe`, que es la ruta donde Tauri NSIS instala el uninstaller cuando se usa modo usuario. Sin embargo, si la versión previa fue instalada como administrador o descargada directamente, el `uninstall.exe` está en `$env:PROGRAMFILES\Specboard\` y Scoop no puede desinstalarla. El resultado: la versión nueva se "instala" pero el ejecutable viejo permanece activo.

## Goals / Non-Goals

**Goals:**
- `scoop update specboard` desinstala la versión anterior correctamente independientemente de cómo fue instalada
- El proceso `Specboard.exe` se termina antes de intentar desinstalar/instalar
- Graceful: si no hay versión previa instalada, el script no falla

**Non-Goals:**
- Cambiar el pipeline de CI o el SHA256
- Soporte para arquitecturas distintas a x64
- Modificar el instalador NSIS de Tauri

## Decisions

**Decisión 1: Buscar el uninstaller via registry en lugar de ruta hardcodeada**
Windows registra todos los programas instalados (MSI y NSIS) en `HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*` (instalación de usuario) y `HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*` (instalación de sistema). Buscar por `DisplayName` que contenga "Specboard" es robusto independientemente de la ruta de instalación.

Alternativa descartada: hardcodear ambas rutas (`LOCALAPPDATA` y `PROGRAMFILES`). Frágil si cambian en futuras versiones de Tauri.

**Decisión 2: Agregar `pre_install` para matar el proceso**
Si Specboard está abierto durante el update, el NSIS installer falla silenciosamente porque no puede reemplazar el EXE en uso. `Stop-Process -Name "Specboard" -Force -ErrorAction SilentlyContinue` termina el proceso gracefully antes de instalar.

**Decisión 3: Mantener el `installer` block existente**
El instalador NSIS con `/S` (silent) funciona correctamente. Solo necesita que la versión anterior esté desinstalada limpiamente antes.

## Risks / Trade-offs

- **[Permisos de registry HKLM]** → Leer HKLM no requiere admin, solo escribir. La búsqueda es segura.
- **[Múltiples entradas de Specboard en registry]** → Si hay entradas duplicadas, el script ejecuta el primero encontrado. Riesgo mínimo, pero el script debe filtrar solo entradas con `UninstallString` válida.
- **[UninstallString con argumentos]** → Algunos instaladores guardan `UninstallString` con flags incluidos (e.g., `"C:\path\uninstall.exe" /quiet`). El script debe manejar esto parseando la cadena.

## Migration Plan

1. Modificar `scoop/specboard.json`:
   - Agregar bloque `pre_install` con PowerShell para matar proceso
   - Reemplazar bloque `uninstaller` con script que busca en registry
2. El cambio es retrocompatible: en la próxima instalación via Scoop, el nuevo `uninstaller` estará activo para el siguiente upgrade
3. Usuarios con versión vieja instalada directamente: deben desinstalar manualmente una vez, luego Scoop toma control

**Rollback:** Revertir el JSON. El comportamiento vuelve al estado anterior.
