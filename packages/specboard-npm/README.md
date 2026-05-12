# Specboard

Visual GUI for OpenSpec - Spec-Driven Development framework.

## Installation

```bash
npm install -g specboard
```

## Usage

```bash
specboard
```

## Manual Installation (Corporate Proxies)

If `npm install` fails due to network restrictions:

1. Download the appropriate binary from [GitHub Releases](https://github.com/specboard/specboard/releases)
2. Set the environment variable:
   ```bash
   export SPECBOARD_BINARY_PATH=/path/to/downloaded/specboard
   npm install -g specboard
   ```

## Supported Platforms

- Linux (x64, arm64) - `.AppImage`
- macOS (x64, arm64) - `.dmg`
- Windows (x64) - `.msi`

## Development

```bash
npm link        # Link local package for testing
npm pack        # Create tarball for inspection
npm publish     # Publish to npm registry
```
