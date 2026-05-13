#!/usr/bin/env node

/**
 * update-sha256.js
 *
 * Lee los SHA256 desde los artifacts generados por CI
 * y actualiza scoop/specboard.json y homebrew/specboard.rb.
 *
 * Uso (en CI, tras descargar los artifacts con actions/download-artifact):
 *   node scripts/update-sha256.js --from-artifacts <directorio>
 *
 * Estructura esperada en <directorio>:
 *   sha256-windows/sha256.env  →  file=specboard_x.y.z_x64-setup.exe  +  hash=...
 *   sha256-macos-x64/sha256.env  →  file=specboard_x.y.z_x64.dmg      +  hash=...
 *   sha256-macos-arm/sha256.env  →  file=specboard_x.y.z_aarch64.dmg  +  hash=...
 *   sha256-linux/sha256.env    →  file=specboard_x.y.z_amd64.AppImage +  hash=...
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

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

// ── Cargar los artifacts de cada plataforma ─────────────────────
const platforms = {
  windows:   path.join(artifactsDir, "sha256-windows",   "sha256.env"),
  macosX64:  path.join(artifactsDir, "sha256-macos-x64", "sha256.env"),
  macosArm:  path.join(artifactsDir, "sha256-macos-arm", "sha256.env"),
  linux:     path.join(artifactsDir, "sha256-linux",     "sha256.env"),
};

const hashes = {};
for (const [platform, envPath] of Object.entries(platforms)) {
  if (!fs.existsSync(envPath)) {
    console.error(`Error: missing artifact for ${platform}: ${envPath}`);
    process.exit(1);
  }
  hashes[platform] = readEnvFile(envPath);
  console.log(`✓ ${platform}: ${hashes[platform].file} → ${hashes[platform].hash.substring(0, 16)}...`);
}

// ── Actualizar scoop/specboard.json ─────────────────────────────
const scoopPath = path.join(root, "scoop", "specboard.json");
const scoop = JSON.parse(fs.readFileSync(scoopPath, "utf8"));
scoop.architecture["64bit"].hash = hashes.windows.hash;
fs.writeFileSync(scoopPath, JSON.stringify(scoop, null, 2) + "\n", "utf8");
console.log(`✓ scoop/specboard.json actualizado`);

// ── Actualizar homebrew/specboard.rb ────────────────────────────
const homebrewPath = path.join(root, "homebrew", "specboard.rb");
let homebrew = fs.readFileSync(homebrewPath, "utf8");

// arm64
homebrew = homebrew.replace(
  /sha256 "REPLACE_WITH_SHA256_ARM"/,
  `sha256 "${hashes.macosArm.hash}"`,
);
// x64 — reemplaza tanto REPLACE_WITH_SHA256_X64 como hashes previos en el bloque on_intel
homebrew = homebrew.replace(
  /(on_intel do[\s\S]*?sha256 ")[^"]+(")/,
  `$1${hashes.macosX64.hash}$2`,
);

fs.writeFileSync(homebrewPath, homebrew, "utf8");
console.log(`✓ homebrew/specboard.rb actualizado (arm64 + x64)`);

console.log("\n✅ SHA256 hashes actualizados correctamente");
