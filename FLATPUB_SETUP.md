# Flatpak Setup Guide

This document describes the steps to publish Specboard on Flathub.

## Prerequisites

- Flathub account (register at https://flathub.org)
- GitHub account linked to Flathub

## Steps to Publish

1. **Fork Flathub repository**
   - Go to https://github.com/flathub/flathub
   - Fork the repository

2. **Create new app entry**
   - In your fork, create a new directory: `com.specboard.app`
   - Copy the manifest from `flatpak/com.specboard.app.json` to this directory
   - Add the desktop file, metainfo, and icon

3. **Submit Pull Request**
   - Submit a PR to flathub/flathub
   - Title: `Add com.specboard.app`
   - Include description and screenshots

4. **Review Process**
   - Flathub team will review the submission
   - This may take 1-2 weeks
   - They may request changes

5. **After Approval**
   - Users can install with: `flatpak install flathub com.specboard.app`

## Alternative: Host Flatpak Repository

If Flathub approval takes too long, you can host your own Flatpak repository:

1. Create a GitHub repository for the Flatpak build
2. Configure GitHub Actions to build and publish Flatpak
3. Users install with: `flatpak install https://github.com/cuman14/specboard-flatpak/com.specboard.app.flatpakref`

## Current Status

- Manifest created: ✓
- Desktop file created: ✓
- Metainfo created: ✓
- Icon needed: ⚠️ (add `flatpak/specboard.png` 256x256)
- Flathub submission: ⏳ (manual step required)
