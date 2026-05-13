#!/usr/bin/env node

/**
 * sync-versions.js
 *
 * Synchronizes the version number across all required files:
 *   - src-tauri/Cargo.toml
 *   - src-tauri/tauri.conf.json
 *   - scoop/specboard.json
 *   - homebrew/specboard.rb
 *
 * Version is read from package.json.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

// Read version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const version = packageJson.version;

if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(
    `Error: invalid version format "${version}" in package.json. Expected semver (e.g. 1.2.3)`,
  );
  process.exit(1);
}

// --- Update Cargo.toml ---
const cargoPath = path.join(root, "src-tauri", "Cargo.toml");

if (!fs.existsSync(cargoPath)) {
  console.error(`Error: file not found: ${cargoPath}`);
  process.exit(1);
}

const cargoContent = fs.readFileSync(cargoPath, "utf8");
const updatedCargo = cargoContent.replace(
  /^version\s*=\s*"[^"]+"/m,
  `version = "${version}"`,
);

if (updatedCargo === cargoContent) {
  console.warn(
    `Warning: version line not found or already at ${version} in Cargo.toml`,
  );
} else {
  fs.writeFileSync(cargoPath, updatedCargo, "utf8");
  console.log(`✓ Cargo.toml → ${version}`);
}

// --- Update tauri.conf.json ---
const tauriConfPath = path.join(root, "src-tauri", "tauri.conf.json");

if (!fs.existsSync(tauriConfPath)) {
  console.error(`Error: file not found: ${tauriConfPath}`);
  process.exit(1);
}

const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf8"));
tauriConf.version = version;
fs.writeFileSync(
  tauriConfPath,
  JSON.stringify(tauriConf, null, 2) + "\n",
  "utf8",
);
console.log(`✓ tauri.conf.json → ${version}`);

// --- Update scoop/specboard.json ---
const scoopPath = path.join(root, "scoop", "specboard.json");

if (!fs.existsSync(scoopPath)) {
  console.error(`Error: file not found: ${scoopPath}`);
  process.exit(1);
}

const scoopManifest = JSON.parse(fs.readFileSync(scoopPath, "utf8"));
scoopManifest.version = version;
scoopManifest.architecture["64bit"].url =
  `https://github.com/cuman14/specboard/releases/download/v${version}/specboard_${version}_x64-setup.exe`;
scoopManifest.autoupdate.architecture["64bit"].url =
  `https://github.com/cuman14/specboard/releases/download/v${version}/specboard_${version}_x64-setup.exe`;
// Fix hardcoded installer script
if (scoopManifest.installer && scoopManifest.installer.script) {
  scoopManifest.installer.script = `specboard_${version}_x64-setup.exe`;
}
fs.writeFileSync(
  scoopPath,
  JSON.stringify(scoopManifest, null, 2) + "\n",
  "utf8",
);
console.log(`✓ scoop/specboard.json → ${version}`);

// --- Update homebrew/specboard.rb ---
const homebrewPath = path.join(root, "homebrew", "specboard.rb");

if (!fs.existsSync(homebrewPath)) {
  console.error(`Error: file not found: ${homebrewPath}`);
  process.exit(1);
}

let homebrewContent = fs.readFileSync(homebrewPath, "utf8");

// Actualizar version
homebrewContent = homebrewContent.replace(
  /version "[^"]+"/,
  `version "${version}"`,
);

// Actualizar URLs arm64 e x64
homebrewContent = homebrewContent.replace(
  /specboard_[^"]+_aarch64\.dmg/g,
  `specboard_${version}_aarch64.dmg`,
);
homebrewContent = homebrewContent.replace(
  /specboard_[^"]+_x64\.dmg/g,
  `specboard_${version}_x64.dmg`,
);

fs.writeFileSync(homebrewPath, homebrewContent, "utf8");
console.log(`✓ homebrew/specboard.rb → ${version}`);

console.log(`\nAll version files updated to ${version}`);

