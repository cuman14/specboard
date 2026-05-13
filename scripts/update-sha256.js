#!/usr/bin/env node

/**
 * update-sha256.js
 *
 * Lee los hashes SHA256 desde los artifacts generados por CI
 * y actualiza scoop/specboard.json y homebrew/specboard.rb.
 *
 * Uso (en CI, después de descargar los artifacts):
 *   node scripts/update-sha256.js --from-artifacts <directorio>
 *
 * El directorio debe contener subcarpetas sha256-windows,
 * sha256-macos y sha256-linux, cada una con un archivo sha256.env
 * con el formato:
 *   file=specboard_1.2.3_x64-setup.exe
 *   hash=abc123...
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

// ── Cargar los tres artifacts ───────────────────────────────────
const platforms = {
  windows: path.join(artifactsDir, "sha256-windows", "sha256.env"),
  macos:   path.join(artifactsDir, "sha256-macos",   "sha256.env"),
  linux:   path.join(artifactsDir, "sha256-linux",   "sha256.env"),
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

// Reemplaza cualquier sha256 existente (tanto REPLACE_WITH_SHA256 como un hash previo)
homebrew = homebrew.replace(
  /sha256 "[^"]+"/,
  `sha256 "${hashes.macos.hash}"`,
);

fs.writeFileSync(homebrewPath, homebrew, "utf8");
console.log(`✓ homebrew/specboard.rb actualizado`);

console.log("\n✅ SHA256 hashes actualizados correctamente");
