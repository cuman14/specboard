#!/usr/bin/env node

/**
 * sync-versions.js
 *
 * Sincroniza la versión en todos los manifests del proyecto.
 * Llamado por release-it en el hook after:bump, cuando
 * package.json ya tiene la nueva versión.
 *
 * Archivos actualizados:
 *   - src-tauri/Cargo.toml
 *   - src-tauri/Cargo.lock
 *   - src-tauri/tauri.conf.json
 *   - bucket/specboard.json
 *   - Casks/specboard.rb
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

// ── Leer versión desde package.json ────────────────────────────
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);
const version = packageJson.version;

if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`Error: versión inválida "${version}" en package.json`);
  process.exit(1);
}

console.log(`Sincronizando versión ${version}...`);

// ── Cargo.toml ──────────────────────────────────────────────────
const cargoPath = path.join(root, "src-tauri", "Cargo.toml");
const cargoContent = fs.readFileSync(cargoPath, "utf8");
const updatedCargo = cargoContent.replace(
  /^version\s*=\s*"[^"]+"/m,
  `version = "${version}"`,
);
fs.writeFileSync(cargoPath, updatedCargo, "utf8");
console.log(`✓ Cargo.toml → ${version}`);

// ── Cargo.lock ──────────────────────────────────────────────────
const cargoLockPath = path.join(root, "src-tauri", "Cargo.lock");
const cargoLockContent = fs.readFileSync(cargoLockPath, "utf8");
const updatedCargoLock = cargoLockContent.replace(
  /(\[\[package\]\]\r?\nname = "specboard"\r?\nversion = )"[^"]+"/m,
  `$1"${version}"`,
);
fs.writeFileSync(cargoLockPath, updatedCargoLock, "utf8");
console.log(`✓ Cargo.lock → ${version}`);

// ── tauri.conf.json ─────────────────────────────────────────────
const tauriConfPath = path.join(root, "src-tauri", "tauri.conf.json");
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf8"));
tauriConf.version = version;
fs.writeFileSync(
  tauriConfPath,
  JSON.stringify(tauriConf, null, 2) + "\n",
  "utf8",
);
console.log(`✓ tauri.conf.json → ${version}`);

// ── bucket/specboard.json ───────────────────────────────────────
// Nota: el hash se actualiza después del build por update-sha256.js
// Nota: los assets de GitHub Releases usan mayúscula: Specboard_x.y.z_*
const scoopPath = path.join(root, "bucket", "specboard.json");
const scoop = JSON.parse(fs.readFileSync(scoopPath, "utf8"));

scoop.version = version;
scoop.architecture["64bit"].url =
  `https://github.com/cuman14/specboard/releases/download/v${version}/Specboard_${version}_x64-setup.exe`;
scoop.autoupdate.architecture["64bit"].url =
  `https://github.com/cuman14/specboard/releases/download/v$version/Specboard_$version_x64-setup.exe`;

fs.writeFileSync(scoopPath, JSON.stringify(scoop, null, 2) + "\n", "utf8");
console.log(`✓ bucket/specboard.json → ${version}`);

// ── Casks/specboard.rb ─────────────────────────────────────────
// Nota: el hash se actualiza después del build por update-sha256.js
// Nota: los assets de GitHub Releases usan mayúscula: Specboard_x.y.z_*
const homebrewPath = path.join(root, "Casks", "specboard.rb");
let homebrew = fs.readFileSync(homebrewPath, "utf8");

// Actualizar campo version
homebrew = homebrew.replace(/version "[^"]+"/, `version "${version}"`);

// Actualizar URL del .dmg (mayúscula Specboard_)
homebrew = homebrew.replace(
  /url "https:\/\/github\.com\/cuman14\/specboard\/releases\/download\/v[^"]+"/,
  `url "https://github.com/cuman14/specboard/releases/download/v${version}/Specboard_${version}_aarch64.dmg"`,
);

fs.writeFileSync(homebrewPath, homebrew, "utf8");
console.log(`✓ Casks/specboard.rb → ${version}`);

console.log(`\n✅ Todos los manifests actualizados a ${version}`);
