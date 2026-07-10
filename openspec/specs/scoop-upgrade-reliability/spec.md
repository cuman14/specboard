# scoop-upgrade-reliability Specification

## Purpose
TBD - created by archiving change fix-scoop-uninstaller. Update Purpose after archive.
## Requirements
### Requirement: Proceso Specboard terminado antes de instalar
El manifest de Scoop SHALL incluir un `pre_install` que termine el proceso `Specboard.exe` si está en ejecución antes de proceder con la instalación.

#### Scenario: App cerrada antes de instalar
- **WHEN** el usuario ejecuta `scoop update specboard` con Specboard abierto
- **THEN** el proceso es terminado gracefully antes de que el installer NSIS corra

#### Scenario: No falla si app no está abierta
- **WHEN** el usuario ejecuta `scoop update specboard` con Specboard cerrado
- **THEN** el `pre_install` completa sin error

### Requirement: Uninstaller de versión anterior localizado via registry
El bloque `uninstaller` de Scoop SHALL buscar el `UninstallString` de Specboard en el registry de Windows en lugar de usar una ruta hardcodeada.

#### Scenario: Desinstalación exitosa desde LOCALAPPDATA
- **WHEN** la versión previa fue instalada en modo usuario (LOCALAPPDATA)
- **THEN** el uninstaller la encuentra en `HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*` y la desinstala

#### Scenario: Desinstalación exitosa desde PROGRAMFILES
- **WHEN** la versión previa fue instalada en modo admin (PROGRAMFILES)
- **THEN** el uninstaller la encuentra en `HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*` y la desinstala

#### Scenario: No falla si no hay versión previa
- **WHEN** no existe ninguna instalación previa de Specboard en el registry
- **THEN** el script de uninstall completa sin error y sin output

### Requirement: Versión nueva visible tras scoop update
Tras completar `scoop update specboard`, la versión mostrada en la app SHALL ser la versión recién instalada.

#### Scenario: Versión correcta después de update
- **WHEN** el usuario completa `scoop update specboard` y abre Specboard
- **THEN** la versión visible en la interfaz coincide con la versión del manifest de Scoop

