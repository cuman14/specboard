## 1. Create scripts/deploy/ directory and move scripts

- [x] 1.1 Create `scripts/deploy/` directory
- [x] 1.2 Move `scripts/sync-versions.js` to `scripts/deploy/sync-versions.js`
- [x] 1.3 Move `scripts/update-sha256.js` to `scripts/deploy/update-sha256.js`

## 2. Update script references

- [x] 2.1 Update `.release-it.json` hook: `after:bump` path to `node scripts/deploy/sync-versions.js`
- [x] 2.2 Update `.github/workflows/release.yml` line 240: path to `node scripts/deploy/update-sha256.js`

## 3. Improve release.yml

- [x] 3.1 Change `ubuntu-22.04` to `ubuntu-24.04` in build matrix (line 111)
- [x] 3.2 Update Linux dependency install condition from `ubuntu-22.04` to `ubuntu-24.04` (line 144)
- [x] 3.3 Remove `releaseBody` from tauri-action config (line 185)
- [x] 3.4 Pin pnpm to `pnpm@9` in release job (line 42)
- [x] 3.5 Pin pnpm to `pnpm@9` in build job (line 154)

## 4. Fix update-sha256.js Homebrew regex

- [x] 4.1 Update Homebrew URL regex to target `on_arm` block specifically
- [x] 4.2 Update Homebrew SHA256 regex to target `on_arm` block specifically

## 5. Clean up dead code and stale docs

- [x] 5.1 Delete `scripts/update-sha256-from-artifacts.js`
- [x] 5.2 Delete `DEPLOYMENT_MODERNIZATION.md`
- [x] 5.3 Update `AGENTS.md` line 218: change script reference to `scripts/deploy/sync-versions.js`, `scripts/deploy/update-sha256.js`
- [x] 5.4 Update `AGENTS.md` line 244: change script reference to `scripts/deploy/update-sha256.js`
