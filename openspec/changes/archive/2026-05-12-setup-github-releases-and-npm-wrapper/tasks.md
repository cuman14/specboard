## 1. Phase 1 - GitHub Actions CI/CD

- [x] 1.1 Create `.github/workflows/` directory in repository root
- [x] 1.2 Create `release.yml` with workflow trigger on tags `v*`
- [x] 1.3 Add ubuntu-latest job with tauri-apps/tauri-action for `.deb`, `.rpm`, `.AppImage`
- [x] 1.4 Add windows-latest job with tauri-apps/tauri-action for `.msi`, `.exe`
- [x] 1.5 Add macos-latest job with tauri-apps/tauri-action for `.dmg`, `.app`
- [x] 1.6 Configure artifact upload to GitHub Releases with `tagName: ${{ github.ref_name }}`
- [x] 1.7 Test workflow with `git tag v0.0.0-test && git push origin v0.0.0-test` (run manually)
- [x] 1.8 Verify all 3 platform artifacts appear in GitHub Release (check after tag push)
- [x] 1.9 Delete test tag and release after verification (cleanup manually)

## 2. Phase 2 - npm Binary Wrapper

- [x] 2.1 Create `packages/specboard-npm/` directory structure
- [x] 2.2 Create `package.json` with `name: "specboard"`, `bin: { "specboard": "./bin/specboard" }`, `postinstall: "node postinstall.js"`
- [x] 2.3 Implement `lib/platform.js` with `detectPlatform()` returning `{ platform, arch, assetName }`
- [x] 2.4 Implement `postinstall.js` that downloads correct asset from GitHub Release to `node_modules/.bin/specboard-native`
- [x] 2.5 Create `bin/specboard` CLI wrapper that spawns the native binary
- [x] 2.6 Add `SPECBOARD_BINARY_PATH` env var override for corporate proxies
- [x] 2.7 Add graceful error handling for unsupported platforms
- [x] 2.8 Test locally: `cd packages/specboard-npm && npm link && specboard` (run manually)
- [x] 2.9 Verify package size is under 100KB: `npm pack && ls -la *.tgz` (run manually)
- [x] 2.10 Publish to npm: `npm publish` (check name availability first, run manually)

## 3. Phase 3 - Vercel Download Page

- [x] 3.1 Create `apps/web/src/app/download/page.tsx` (or equivalent in existing web structure)
- [x] 3.2 Implement `useOSDetection()` hook parsing `navigator.platform` and `navigator.userAgent`
- [x] 3.3 Create `DownloadButton` component that links to correct GitHub Release asset
- [x] 3.4 Add primary download button that shows OS-specific option (macOS/Windows/Linux)
- [x] 3.5 Add fallback section showing all platform download options
- [x] 3.6 Display current version number fetched from GitHub API or hardcoded
- [x] 3.7 Add npm install command `npm install -g specboard` with copy-to-clipboard button
- [x] 3.8 Add platform-specific installation instructions (DMG mount, MSI run, AppImage chmod)
- [x] 3.9 Test on macOS, Windows, Linux browsers for correct OS detection (test manually after deploy)
- [x] 3.10 Deploy to Vercel and verify `/download` route works (run `cd apps/web && vercel --prod`)

## 4. Integration & Documentation

- [x] 4.1 Update root `README.md` with new installation methods (npm, download page, GitHub Releases)
- [x] 4.2 Add GitHub Actions status badge to README
- [x] 4.3 Document manual download fallback for users behind corporate proxies
- [x] 4.4 Add `RELEASE.md` documenting the release process: `git tag vX.Y.Z && git push --tags`
- [x] 4.5 Verify all three distribution channels work end-to-end (verify after all deployments)

## 5. Migration Plan

| Risk                                                     | Mitigation                                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| GitHub Actions runner minutes exceed free tier           | Monitor usage; builds only on tags, not every push                                                      |
| npm postinstall fails behind corporate proxy             | Document manual download fallback; support SPECBOARD_BINARY_PATH env var                                |
| GitHub API rate limit during postinstall                 | Use unauthenticated requests for public releases (60 req/hour/IP sufficient)                            |
| macOS notarization requires paid Apple Developer account | Unsigned .dmg/.app works for local distribution; document notarization as optional step                 |
| Windows SmartScreen warnings on unsigned .exe            | Document code signing as future enhancement; MSI installer less likely to trigger warnings than raw exe |
| npm package name squatting                               | Publish early to reserve specboard name; consider scoped @specboard/cli if unavailable                  |
