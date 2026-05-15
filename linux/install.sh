#!/usr/bin/env bash
# Specboard installer for Linux (AppImage)
# Usage: curl -fsSL https://raw.githubusercontent.com/cuman14/specboard/main/linux/install.sh | bash

set -e

REPO="cuman14/specboard"
INSTALL_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"

echo "Installing Specboard..."

# Get latest version
VERSION=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/')
if [ -z "$VERSION" ]; then
  echo "Error: could not determine latest version"
  exit 1
fi

echo "Latest version: v$VERSION"

# Download AppImage
URL="https://github.com/$REPO/releases/download/v$VERSION/Specboard_${VERSION}_amd64.AppImage"
mkdir -p "$INSTALL_DIR"
curl -fsSL "$URL" -o "$INSTALL_DIR/specboard"
chmod +x "$INSTALL_DIR/specboard"

# Add to PATH hint
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  echo ""
  echo "Add this to your ~/.bashrc or ~/.zshrc:"
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

echo ""
echo "✅ Specboard v$VERSION installed to $INSTALL_DIR/specboard"
echo "Run: specboard"
