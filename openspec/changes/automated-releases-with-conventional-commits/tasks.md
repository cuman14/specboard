## 1. Setup & Configuration

- [x] 1.1 Install semantic-release dependencies: `npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/exec @semantic-release/git`
- [x] 1.2 Create `.releaserc.js` configuration file with plugins for changelog, exec, git, and github
- [x] 1.3 Create `scripts/sync-versions.js` to update `Cargo.toml` and `tauri.conf.json` from `package.json`
- [x] 1.4 Add commitlint dependencies: `npm install --save-dev @commitlint/config-conventional @commitlint/cli`
- [x] 1.5 Create `.commitlintrc.js` configuration with conventional commit rules
- [x] 1.6 Create `CONTRIBUTING.md` documenting conventional commit format and examples

## 2. GitHub Actions Workflows

- [x] 2.1 Create `.github/workflows/commitlint.yml` to validate commits on PRs and pushes to main
- [x] 2.2 Create `.github/workflows/semantic-release.yml` triggered on push to main
- [x] 2.3 Add `[skip ci]` filter to semantic-release workflow to prevent infinite loops
- [x] 2.4 Update existing `.github/workflows/release.yml` to support both manual and auto-generated tags
- [ ] 2.5 Test workflow syntax with `act` or push to feature branch

## 3. Version Synchronization

- [x] 3.1 Implement `scripts/sync-versions.js` to read version from args and update `Cargo.toml`
- [x] 3.2 Implement version update logic for `tauri.conf.json` (JSON manipulation)
- [x] 3.3 Test sync script locally: `node scripts/sync-versions.js 1.2.3`
- [x] 3.4 Verify all three files have consistent versions after script runs
- [x] 3.5 Add error handling to sync script (file not found, invalid version format)

## 4. Testing & Validation

- [ ] 4.1 Create test commits following conventional format and verify commitlint passes
- [ ] 4.2 Create intentionally bad commits and verify commitlint fails with clear errors
- [ ] 4.3 Run semantic-release in dry-run mode: `npx semantic-release --dry-run`
- [ ] 4.4 Verify semantic-release correctly analyzes commits and suggests next version
- [ ] 4.5 Test the complete flow on a test branch with fake commits
- [ ] 4.6 Verify `[skip ci]` commit message prevents workflow trigger

## 5. Documentation & Rollout

- [x] 5.1 Update `README.md` with new automated release process (replace manual steps)
- [x] 5.2 Update `RELEASE.md` with semantic-release workflow documentation
- [x] 5.3 Add commit message guidelines to developer documentation
- [ ] 5.4 Notify team about new conventional commit requirement
- [ ] 5.5 Enable branch protection requiring commitlint check to pass on PRs
- [ ] 5.6 Monitor first automated release for issues

## 6. Monitoring & Cleanup

- [ ] 6.1 Verify CHANGELOG.md is generated correctly on first release
- [ ] 6.2 Check that GitHub Releases include proper release notes
- [ ] 6.3 Confirm version tags are created with correct format (`v*`)
- [ ] 6.4 Verify infinite loop protection works (no duplicate releases)
- [ ] 6.5 Remove any test tags and releases created during testing
