#!/usr/bin/env node

/**
 * update-sha256.js
 *
 * Updates SHA256 hashes in Scoop and Homebrew manifests after release.
 * This script should run AFTER the GitHub Actions build completes,
 * when the release artifacts are available.
 *
 * Usage: node scripts/update-sha256.js <version>
 * Example: node scripts/update-sha256.js 1.2.3
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import https from "https";

const version = process.argv[2];

if (!version) {
  console.error("Error: version argument is required");
  console.error("Usage: node scripts/update-sha256.js <version>");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(
    `Error: invalid version format "${version}". Expected semver (e.g. 1.2.3)`,
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

/**
 * Download a file and return its SHA256 hash
 */
function downloadAndHash(url) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${url}`);
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }

      const hash = crypto.createHash("sha256");
      res.on("data", (chunk) => hash.update(chunk));
      res.on("end", () => resolve(hash.digest("hex")));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log(`Updating SHA256 hashes for version ${version}\n`);

  const baseUrl = `https://github.com/cuman14/specboard/releases/download/v${version}`;
  
  // --- Update Scoop manifest ---
  const scoopPath = path.join(root, "scoop", "specboard.json");
  const scoopManifest = JSON.parse(fs.readFileSync(scoopPath, "utf8"));
  
  const exeUrl = `${baseUrl}/specboard_${version}_x64-setup.exe`;
  const exeSha256 = await downloadAndHash(exeUrl);
  
  scoopManifest.architecture["64bit"].hash = exeSha256;
  
  fs.writeFileSync(
    scoopPath,
    JSON.stringify(scoopManifest, null, 2) + "\n",
    "utf8",
  );
  console.log(`✓ scoop/specboard.json → SHA256: ${exeSha256.substring(0, 16)}...`);

  // --- Update Homebrew formula ---
  const homebrewPath = path.join(root, "homebrew", "specboard.rb");
  const homebrewContent = fs.readFileSync(homebrewPath, "utf8");
  
  const dmgUrl = `${baseUrl}/specboard_${version}_x64.dmg`;
  const dmgSha256 = await downloadAndHash(dmgUrl);
  
  const updatedHomebrew = homebrewContent.replace(
    /sha256 "REPLACE_WITH_SHA256"/,
    `sha256 "${dmgSha256}"`,
  );
  
  fs.writeFileSync(homebrewPath, updatedHomebrew, "utf8");
  console.log(`✓ homebrew/specboard.rb → SHA256: ${dmgSha256.substring(0, 16)}...`);

  console.log(`\n✅ All SHA256 hashes updated for version ${version}`);
  console.log("\nNext steps:");
  console.log("  git add scoop/specboard.json homebrew/specboard.rb");
  console.log(`  git commit -m "chore: update SHA256 hashes for v${version}"`);
  console.log("  git push origin main");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
