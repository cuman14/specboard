#!/usr/bin/env node

/**
 * update-sha256-from-artifacts.js
 *
 * Updates SHA256 hashes in Scoop and Homebrew manifests from CI build artifacts.
 * This script reads SHA256 values from artifacts generated during the build workflow.
 *
 * Usage: node scripts/update-sha256-from-artifacts.js <artifacts-dir>
 * Example: node scripts/update-sha256-from-artifacts.js sha256-artifacts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const artifactsDir = process.argv[2];

if (!artifactsDir) {
  console.error("Error: artifacts directory argument is required");
  console.error("Usage: node scripts/update-sha256-from-artifacts.js <artifacts-dir>");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const artifactsPath = path.resolve(root, artifactsDir);

/**
 * Parse sha256sum.txt file and extract hash for a specific file
 */
function parseSha256File(filePath, targetFile) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: SHA256 file not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const [hash, ...fileParts] = line.split(/\s+/);
    const file = fileParts.join(" ");
    if (file === targetFile || file.endsWith(targetFile)) {
      return hash;
    }
  }

  console.warn(`Warning: SHA256 for ${targetFile} not found in ${filePath}`);
  return null;
}

/**
 * Get SHA256 from platform artifacts
 */
function getSha256FromArtifacts(platform, targetFile) {
  const platformFiles = {
    "ubuntu-22.04": "sha256-ubuntu-22.04/sha256sum.txt",
    "windows-latest": "sha256-windows-latest/sha256sum.txt",
    "macos-latest": "sha256-macos-latest/sha256sum.txt",
  };

  const relativePath = platformFiles[platform];
  if (!relativePath) {
    console.warn(`Warning: Unknown platform ${platform}`);
    return null;
  }

  const filePath = path.join(artifactsPath, relativePath);
  return parseSha256File(filePath, targetFile);
}

async function main() {
  console.log(`Updating SHA256 hashes from artifacts in ${artifactsPath}\n`);

  // Get version from package.json
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8")
  );
  const version = packageJson.version;

  console.log(`Version: ${version}\n`);

  // --- Update Scoop manifest ---
  const scoopPath = path.join(root, "scoop", "specboard.json");
  const scoopManifest = JSON.parse(fs.readFileSync(scoopPath, "utf8"));

  const exeSha256 = getSha256FromArtifacts(
    "windows-latest",
    `specboard_${version}_x64-setup.exe`
  );

  if (exeSha256) {
    scoopManifest.architecture["64bit"].hash = exeSha256;
    // Fix hardcoded installer script
    if (scoopManifest.installer && scoopManifest.installer.script) {
      scoopManifest.installer.script = `specboard_${version}_x64-setup.exe`;
    }
    fs.writeFileSync(
      scoopPath,
      JSON.stringify(scoopManifest, null, 2) + "\n",
      "utf8"
    );
    console.log(`✓ scoop/specboard.json → SHA256: ${exeSha256.substring(0, 16)}...`);
  } else {
    console.warn("⚠ Skipping scoop update - SHA256 not found in artifacts");
  }

  // --- Update Homebrew formula ---
  const homebrewPath = path.join(root, "homebrew", "specboard.rb");
  const homebrewContent = fs.readFileSync(homebrewPath, "utf8");

  const dmgSha256 = getSha256FromArtifacts(
    "macos-latest",
    `specboard_${version}_x64.dmg`
  );

  if (dmgSha256) {
    const updatedHomebrew = homebrewContent.replace(
      /sha256 "REPLACE_WITH_SHA256"/,
      `sha256 "${dmgSha256}"`
    );

    fs.writeFileSync(homebrewPath, updatedHomebrew, "utf8");
    console.log(`✓ homebrew/specboard.rb → SHA256: ${dmgSha256.substring(0, 16)}...`);
  } else {
    console.warn("⚠ Skipping homebrew update - SHA256 not found in artifacts");
  }

  console.log(`\n✅ SHA256 hashes updated for version ${version}`);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
