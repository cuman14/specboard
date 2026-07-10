import sharp from "sharp";
import pngToIco from "png-to-ico";
import { createICNS } from "png2icons";
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const ICONS_DIR = resolve(ROOT, "src-tauri/icons");

// Tolerance for matching "near-background" colors
// Original icons have backgrounds of rgb(0,0,0) or rgb(254,254,254)
const TOLERANCE = 12;

function isBackground(r, g, b, a) {
  if (a < 0.05) return true;
  // Match near-black backgrounds
  if (r <= TOLERANCE && g <= TOLERANCE && b <= TOLERANCE) return true;
  // Match near-white backgrounds
  if (r >= 255 - TOLERANCE && g >= 255 - TOLERANCE && b >= 255 - TOLERANCE) return true;
  return false;
}

async function removeBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;

  // Flood-fill from edges: any pixel connected to the edge that is "background" gets alpha=0
  const visited = new Uint8Array(w * h);
  const queue = [];

  // Seed from all edge pixels that look like background
  for (let x = 0; x < w; x++) {
    const topIdx = x;
    const botIdx = (h - 1) * w + x;
    const topR = data[topIdx * ch], topG = data[topIdx * ch + 1], topB = data[topIdx * ch + 2], topA = data[topIdx * ch + 3];
    const botR = data[botIdx * ch], botG = data[botIdx * ch + 1], botB = data[botIdx * ch + 2], botA = data[botIdx * ch + 3];
    if (isBackground(topR, topG, topB, topA / 255) && !visited[topIdx]) {
      visited[topIdx] = 1;
      queue.push(topIdx);
    }
    if (isBackground(botR, botG, botB, botA / 255) && !visited[botIdx]) {
      visited[botIdx] = 1;
      queue.push(botIdx);
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, w - 1]) {
      const idx = y * w + x;
      const r = data[idx * ch], g = data[idx * ch + 1], b = data[idx * ch + 2], a = data[idx * ch + 3];
      if (isBackground(r, g, b, a / 255) && !visited[idx]) {
        visited[idx] = 1;
        queue.push(idx);
      }
    }
  }

  // BFS flood fill
  let qi = 0;
  while (qi < queue.length) {
    const idx = queue[qi++];
    const x = idx % w;
    const y = (idx - x) / w;
    // Set alpha to 0
    data[idx * ch + 3] = 0;
    // Check 4 neighbors
    const neighbors = [];
    if (x > 0) neighbors.push(idx - 1);
    if (x < w - 1) neighbors.push(idx + 1);
    if (y > 0) neighbors.push(idx - w);
    if (y < h - 1) neighbors.push(idx + w);
    for (const ni of neighbors) {
      if (visited[ni]) continue;
      const nr = data[ni * ch], ng = data[ni * ch + 1], nb = data[ni * ch + 2], na = data[ni * ch + 3] / 255;
      if (isBackground(nr, ng, nb, na)) {
        visited[ni] = 1;
        queue.push(ni);
      }
    }
  }

  // Anti-alias: soften edges by reducing alpha of semi-background pixels
  // This handles pixels that are partially blended with the background
  for (let i = 0; i < w * h; i++) {
    const r = data[i * ch], g = data[i * ch + 1], b = data[i * ch + 2];
    const closeToBlack = r <= 40 && g <= 40 && b <= 40;
    const closeToWhite = r >= 230 && g >= 230 && b >= 230;
    if (closeToBlack || closeToWhite) {
      // Reduce alpha proportionally to how "background-like" the color is
      const dist = closeToBlack
        ? Math.sqrt(r * r + g * g + b * b) / Math.sqrt(3 * 40 * 40)
        : Math.sqrt((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2) / Math.sqrt(3 * 25 * 25);
      if (dist < 0.15) {
        data[i * ch + 3] = 0;
      } else if (dist < 0.4) {
        data[i * ch + 3] = Math.round(data[i * ch + 3] * (dist / 0.4));
      }
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: ch } })
    .png()
    .toBuffer();
}

const PNG_FILES = [
  "32x32.png",
  "64x64.png",
  "128x128.png",
  "128x128@2x.png",
  "icon.png",
  "StoreLogo.png",
  "Square30x30Logo.png",
  "Square44x44Logo.png",
  "Square71x71Logo.png",
  "Square89x89Logo.png",
  "Square107x107Logo.png",
  "Square142x142Logo.png",
  "Square150x150Logo.png",
  "Square284x284Logo.png",
  "Square310x310Logo.png",
];

const ICO_SOURCE_SIZES = [16, 32, 48, 256];

async function main() {
  console.log("=== Specboard Icon Background Remover ===\n");

  // Step 1: Remove background from all PNGs
  console.log("Removing backgrounds from PNGs...");
  const pngBuffers = {};
  for (const filename of PNG_FILES) {
    const inputPath = resolve(ICONS_DIR, filename);
    if (!existsSync(inputPath)) {
      console.log(`  SKIP ${filename} (not found)`);
      continue;
    }
    const buffer = await removeBackground(inputPath);
    pngBuffers[filename] = buffer;
    writeFileSync(resolve(ICONS_DIR, filename), buffer);
    console.log(`  ✓ ${filename}`);
  }

  // Step 2: Generate ICO from the original icon.png at multiple sizes
  // Use the large transparent PNG and resize for ICO
  console.log("\nGenerating icon.ico from transparent icon.png...");
  const iconPng = await sharp(resolve(ICONS_DIR, "icon.png"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const icoBuffers = [];
  for (const size of ICO_SOURCE_SIZES) {
    const resized = await sharp(await sharp(readFileSync(resolve(ICONS_DIR, "icon.png")))
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer())
      .png()
      .toBuffer();

    // Actually, let me just resize the transparent icon.png
    const buf = await sharp(readFileSync(resolve(ICONS_DIR, "icon.png")))
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    icoBuffers.push(buf);
  }
  const ico = await pngToIco(icoBuffers);
  writeFileSync(resolve(ICONS_DIR, "icon.ico"), ico);
  console.log("  ✓ icon.ico");

  // Step 3: Generate ICNS
  console.log("\nGenerating icon.icns...");
  const icnsMaster = readFileSync(resolve(ICONS_DIR, "icon.png"));
  const icns = await createICNS(icnsMaster, 1);
  writeFileSync(resolve(ICONS_DIR, "icon.icns"), icns);
  console.log("  ✓ icon.icns");

  // Step 4: Mobile icons
  const androidPngs = {
    "mipmap-mdpi/ic_launcher.png": 48,
    "mipmap-mdpi/ic_launcher_round.png": 48,
    "mipmap-hdpi/ic_launcher.png": 72,
    "mipmap-hdpi/ic_launcher_round.png": 72,
    "mipmap-xhdpi/ic_launcher.png": 96,
    "mipmap-xhdpi/ic_launcher_round.png": 96,
    "mipmap-xxhdpi/ic_launcher.png": 144,
    "mipmap-xxhdpi/ic_launcher_round.png": 144,
    "mipmap-xxxhdpi/ic_launcher.png": 192,
    "mipmap-xxxhdpi/ic_launcher_round.png": 192,
  };

  const iosPngs = {
    "AppIcon-20x20@1x.png": 20,
    "AppIcon-20x20@2x.png": 40,
    "AppIcon-20x20@2x-1.png": 40,
    "AppIcon-20x20@3x.png": 60,
    "AppIcon-29x29@1x.png": 29,
    "AppIcon-29x29@2x.png": 58,
    "AppIcon-29x29@2x-1.png": 58,
    "AppIcon-29x29@3x.png": 87,
    "AppIcon-40x40@1x.png": 40,
    "AppIcon-40x40@2x.png": 80,
    "AppIcon-40x40@2x-1.png": 80,
    "AppIcon-40x40@3x.png": 120,
    "AppIcon-60x60@2x.png": 120,
    "AppIcon-60x60@3x.png": 180,
    "AppIcon-76x76@1x.png": 76,
    "AppIcon-76x76@2x.png": 152,
    "AppIcon-83.5x83.5@2x.png": 167,
    "AppIcon-512@2x.png": 1024,
  };

  console.log("\nRegenerating mobile icons from transparent source...");
  const androidDir = resolve(ICONS_DIR, "android");
  const iosDir = resolve(ICONS_DIR, "ios");

  for (const [relPath, size] of Object.entries(androidPngs)) {
    const absPath = resolve(androidDir, relPath);
    const dir = dirname(absPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    await sharp(readFileSync(resolve(ICONS_DIR, "icon.png")))
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(absPath);
  }
  console.log("  ✓ Android icons");

  for (const [filename, size] of Object.entries(iosPngs)) {
    const absPath = resolve(iosDir, filename);
    await sharp(readFileSync(resolve(ICONS_DIR, "icon.png")))
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .png()
      .toFile(absPath);
  }
  console.log("  ✓ iOS icons");

  console.log("\n✅ All icons processed with transparent backgrounds!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});