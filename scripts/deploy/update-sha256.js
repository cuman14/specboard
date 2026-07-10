#!/usr/bin/env node

/**
 * update-sha256.js
 *
 * Lee los SHA256 desde los artifacts generados por CI
 * y actualiza bucket/specboard.json y Casks/specboard.rb.
 *
 * Uso:
 *   node scripts/update-sha256.js --from-artifacts <directorio>
 *
 * Estructura esperada:
 *   sha256-windows/sha256.env   → file=Specboard_x.y.z_x64-setup.exe + hash=...
 *   sha256-macos-arm/sha256.env → file=Specboard_x.y.z_aarch64.dmg   + hash=...
 *   sha256-linux/sha256.env     → file=Specboard_x.y.z_amd64.AppImage + hash=...
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

// ── Parsear argumentos ──────────────────────────────────────────
const fromArtifactsIdx = process.argv.indexOf("--from-artifacts");
if (fromArtifactsIdx === -1 || !process.argv[fromArtifactsIdx + 1]) {
  console.error("Usage: node scripts/update-sha256.js --from-artifacts <dir>");
  process.exit(1);
}
const artifactsDir = path.resolve(process.argv[fromArtifactsIdx + 1]);

if (!fs.existsSync(artifactsDir)) {
  console.error(`Error: artifacts directory not found: ${artifactsDir}`);
  process.exit(1);
}

// ── Leer un archivo sha256.env ──────────────────────────────────
function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};
  for (const line of content.trim().split("\n")) {
    const [key, ...rest] = line.split("=");
    result[key.trim()] = rest.join("=").trim();
  }
  return result;
}

// ── Cargar los 3 artifacts ──────────────────────────────────────
const platforms = {
  windows: path.join(artifactsDir, "sha256-windows", "sha256.env"),
  macosArm: path.join(artifactsDir, "sha256-macos-arm", "sha256.env"),
  linux: path.join(artifactsDir, "sha256-linux", "sha256.env"),
};

const hashes = {};
for (const [platform, envPath] of Object.entries(platforms)) {
  if (!fs.existsSync(envPath)) {
    console.error(`Error: missing artifact for ${platform}: ${envPath}`);
    process.exit(1);
  }
  hashes[platform] = readEnvFile(envPath);
  console.log(
    `✓ ${platform}: ${hashes[platform].file} → ${hashes[platform].hash.substring(0, 16)}...`,
  );
}

// ── Actualizar bucket/specboard.json ─────────────────────────────
const scoopPath = path.join(root, "bucket", "specboard.json");
const scoop = JSON.parse(fs.readFileSync(scoopPath, "utf8"));

// El nombre real del .exe tiene mayúscula (Specboard_x.y.z_x64-setup.exe)
// La URL en scoop debe coincidir exactamente con el asset de GitHub Releases
const winFile = hashes.windows.file; // e.g. Specboard_0.3.0_x64-setup.exe
const version = winFile.match(/Specboard_([^_]+)_/)?.[1] ?? scoop.version;

scoop.version = version;
scoop.architecture["64bit"].url =
  `https://github.com/cuman14/specboard/releases/download/v${version}/${winFile}`;
scoop.architecture["64bit"].hash = hashes.windows.hash;

fs.writeFileSync(scoopPath, JSON.stringify(scoop, null, 2) + "\n", "utf8");
console.log(
  `✓ bucket/specboard.json → ${winFile} / ${hashes.windows.hash.substring(0, 16)}...`,
);

// ── Actualizar homebrew/specboard.rb ────────────────────────────
const homebrewPath = path.join(root, "Casks", "specboard.rb");
let homebrew = fs.readFileSync(homebrewPath, "utf8");

const macFile = hashes.macosArm.file; // e.g. Specboard_0.3.0_aarch64.dmg

// Actualizar campo version
homebrew = homebrew.replace(/version "[^"]+"/, `version "${version}"`);

// Actualizar URL y sha256 dentro del bloque on_arm
homebrew = homebrew.replace(
  /(on_arm do\n\s+)url ".*?"\n(\s+)sha256 ".*?"/,
  `$1url "https://github.com/cuman14/specboard/releases/download/v${version}/${macFile}"\n$2sha256 "${hashes.macosArm.hash}"`,
);

fs.writeFileSync(homebrewPath, homebrew, "utf8");
console.log(
  `✓ Casks/specboard.rb → ${macFile} / ${hashes.macosArm.hash.substring(0, 16)}...`,
);

console.log("\n✅ SHA256 hashes actualizados correctamente");
