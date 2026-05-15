# Changelog

## [0.2.0](https://github.com/cuman14/specboard/compare/v0.1.6...v0.2.0) (2026-05-15)

### ✨ New Features

* add skills-lock.json and update gitignore for agent directories ([8918b15](https://github.com/cuman14/specboard/commit/8918b1521d5473b3e69473bd864e2a5b224551e8))
* add trailing newlines to release workflow and update scripts and remove deploy mac13 ([46d2c42](https://github.com/cuman14/specboard/commit/46d2c421d6a607864d3baedff72eabfc8b644779))

### 🐛 Bug Fixes

* remove requireBranch check handled by workflow condition ([3d7bd24](https://github.com/cuman14/specboard/commit/3d7bd24944e5cb69cab42cc7bd8468c5ed0bec68))
* remove requireBranch from release-it config and normalize spacing ([47fd558](https://github.com/cuman14/specboard/commit/47fd55842113d1277f79e4539da6ba2d590eea10))
* use contains instead of startsWith for commit message filtering ([ec196e8](https://github.com/cuman14/specboard/commit/ec196e851135bf6afb20b03e9d89dc8f3a3e2ce2))

## [0.1.6](https://github.com/cuman14/specboard/compare/v0.1.4...v0.1.6) (2026-05-13)

### 🐛 Bug Fixes

* ensure on main branch before running release-it ([9808950](https://github.com/cuman14/specboard/commit/98089502cfcafaa40579539cef73d32d0ad21243))

## [0.1.5](https://github.com/cuman14/specboard/compare/v0.1.4...v0.1.5) (2026-05-13)

## [0.2.0](https://github.com/cuman14/specboard/compare/v0.1.4...v0.2.0) (2026-05-13)

## [0.1.4](https://github.com/cuman14/specboard/compare/v0.1.3...v0.1.4) (2026-05-13)

### ⚡ Performance

* refactor release workflow to support multi-arch builds and conditional execution ([977c48a](https://github.com/cuman14/specboard/commit/977c48aefb09a6b6e53684216324f8fcca8923dc))

### 📝 Documentation

* update AGENTS.md and README.md with git push improvements and release tooling changes ([9dcdc9b](https://github.com/cuman14/specboard/commit/9dcdc9b2e049dacfaa811563fae0f9efcfe24eb2))

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3](https://github.com/cuman14/specboard/compare/v0.1.2...v0.1.3) (2026-05-13)


### Bug Fixes

* use simple git push without refspec ([80c8d97](https://github.com/cuman14/specboard/commit/80c8d97e9034d98fd105d869952375f51771d2ff))

## [0.1.2](https://github.com/cuman14/specboard/compare/v0.1.1...v0.1.2) (2026-05-13)


### Bug Fixes

* use HEAD:main instead of main for git push ([b277775](https://github.com/cuman14/specboard/commit/b2777757efcf4aab79c71c52a4385959b519e5d1))

## [0.1.1](https://github.com/cuman14/specboard/compare/v1.6.0...v0.1.1) (2026-05-13)


### Bug Fixes

* add persist-credentials to checkout for git push ([c572c45](https://github.com/cuman14/specboard/commit/c572c45bd7a9466c0a9b6288aa69e0a274240d29))
* add repository field to package.json ([3cc774d](https://github.com/cuman14/specboard/commit/3cc774d7520030d9fc2600e2a0320a6a57fd0461))
* configure git credentials for semantic-release push ([6f9450d](https://github.com/cuman14/specboard/commit/6f9450d1dfcedd35cb5c2f971b62c24c54182b33))
* downgrade release-it to v19 for plugin compatibility ([767edac](https://github.com/cuman14/specboard/commit/767edacdf021895ecf36fd4c5bd4e768ac9c3cba))
* read version from package.json in scripts ([bb56449](https://github.com/cuman14/specboard/commit/bb56449d8b04f29f17be5901fb548a7bb7548c0b))
* remove manual workflow triggers, use automatic tag triggers ([6c029b8](https://github.com/cuman14/specboard/commit/6c029b81fc214e69011b105388480f94c278e371))
* remove requireBranch check from release-it config ([ba24354](https://github.com/cuman14/specboard/commit/ba2435449d093a02c8f1470898d5581a77cde94a))
* remove tokenRef from release-it config ([ab07ce1](https://github.com/cuman14/specboard/commit/ab07ce1fbdf7330604c65944959c632ab0692b41))
* simplify version extraction in release workflow ([4ea57bc](https://github.com/cuman14/specboard/commit/4ea57bc9e63c9617265be453caa47ab548cab87f))
* use RELEASE_TOKEN for release-it GitHub auth ([24dba35](https://github.com/cuman14/specboard/commit/24dba35883c7b1842aef57c3ca7bffa6e4fbdba2))
* use workflow_dispatch tag input for version extraction ([c2838f6](https://github.com/cuman14/specboard/commit/c2838f670c5d3c961da9493b5064e4b220fd9e2c))


### Reverts

* remove changesets from release workflow ([4604300](https://github.com/cuman14/specboard/commit/46043005b4f91625385505cb859d9a080feb7a39))

# [1.6.0](https://github.com/cuman14/specboard/compare/v1.5.0...v1.6.0) (2026-05-12)


### Features

* **ci:** trigger release workflow automatically after semantic-release ([23b280e](https://github.com/cuman14/specboard/commit/23b280ee7c3999da92939a450ac7fec99d3278ba))

# [1.5.0](https://github.com/cuman14/specboard/compare/v1.4.1...v1.5.0) (2026-05-12)


### Features

* add deployment modernization plan with Changesets and Release-it migration strategy ([306b7a4](https://github.com/cuman14/specboard/commit/306b7a4dd0ef450b370cd78b71d5da8067d17766))

## [1.4.1](https://github.com/cuman14/specboard/compare/v1.4.0...v1.4.1) (2026-05-12)


### Bug Fixes

* **ci:** add push tags trigger to release workflow for automatic execution ([61ea059](https://github.com/cuman14/specboard/commit/61ea059d67d33a0926f78c3dcc3b6e2c253e0516))

# [1.4.0](https://github.com/cuman14/specboard/compare/v1.3.1...v1.4.0) (2026-05-12)


### Bug Fixes

* **ci:** ensure semantic-release commits to main branch and tracks package manifest changes ([a08fba7](https://github.com/cuman14/specboard/commit/a08fba7e98a8f571ea1e6c08abd6b816c42dd2b5))


### Features

* **ci:** add automated SHA256 hash updates for package manifests after release ([fd3c2bc](https://github.com/cuman14/specboard/commit/fd3c2bcbb97e9e151f1220d9f93c07b6cb814333))
* **pkg:** add Scoop, Homebrew, and Flatpak package configurations ([76ae49b](https://github.com/cuman14/specboard/commit/76ae49b096905bb3eff795a2180653cdd6f1f52f))
* **pkg:** create Homebrew tap with Formula structure ([cb8e35b](https://github.com/cuman14/specboard/commit/cb8e35bfaf5b9f2da608238eea1b7d2132fd0a15))

## [1.3.1](https://github.com/cuman14/specboard/compare/v1.3.0...v1.3.1) (2026-05-12)


### Bug Fixes

* **ci:** trigger release workflow on GitHub Release creation instead of tag push ([db041f8](https://github.com/cuman14/specboard/commit/db041f8898109612aff984ba5645b8414edaf940))


### Reverts

* **ci:** remove curl trigger, use native tag push trigger ([dbe260a](https://github.com/cuman14/specboard/commit/dbe260aae88f93dfdf88f902463c9610da4855df))

# [1.3.0](https://github.com/cuman14/specboard/compare/v1.2.0...v1.3.0) (2026-05-12)


### Features

* **ci:** auto-trigger release workflow after semantic-release creates tag ([63ef431](https://github.com/cuman14/specboard/commit/63ef431bde4941863f8d68c2ce449a0e76406e5a))

# [1.2.0](https://github.com/cuman14/specboard/compare/v1.1.1...v1.2.0) (2026-05-12)


### Features

* **ci:** publish releases automatically without draft mode ([68739c4](https://github.com/cuman14/specboard/commit/68739c4411c520dcc2e5e292561e2ec416d7cfa3))

## [1.1.1](https://github.com/cuman14/specboard/compare/v1.1.0...v1.1.1) (2026-05-12)


### Bug Fixes

* **ci:** use pnpm with --ignore-scripts in release workflow ([34bc0af](https://github.com/cuman14/specboard/commit/34bc0afe661f7733ee381d7d76e500d008d36dde))

# [1.1.0](https://github.com/cuman14/specboard/compare/v1.0.0...v1.1.0) (2026-05-12)


### Features

* **ci:** add implementation notes to automated releases change ([a01b69a](https://github.com/cuman14/specboard/commit/a01b69aed37c1d54994b02ca317fc00c784804ab))

# 1.0.0 (2026-05-12)


### Bug Fixes

* **ci:** configure pnpm to allow build scripts in semantic-release workflow ([a62f7f4](https://github.com/cuman14/specboard/commit/a62f7f4ed104d8ff96477867e4b323bd44d8ba64))
* **ci:** convert .commitlintrc.js to ES module syntax ([430da08](https://github.com/cuman14/specboard/commit/430da088b49bc7ee113d7ecd7128821aeec8284e))
* **ci:** convert .releaserc.js to ES module syntax ([42d6a8c](https://github.com/cuman14/specboard/commit/42d6a8c6beee0c39ef41f86b21eb27dcd8c159a9))
* **ci:** limit commitlint to validate only new commits instead of entire history ([e2ee71a](https://github.com/cuman14/specboard/commit/e2ee71ada989f9b5565678aa3f8c987c80cd7d41))
* **ci:** use --ignore-scripts to avoid esbuild build script error ([74cb493](https://github.com/cuman14/specboard/commit/74cb493a02bb4743d0dccf418c2ba8925fce710b))
* **ci:** use COREPACK_ENABLE_STRICT env var instead of unsupported pnpm config ([5f5bb9a](https://github.com/cuman14/specboard/commit/5f5bb9a371c95ed88aa49c6de5ce0e249d7d2a32))


### Features

* add logo, explorer integration, and UI polish ([346608f](https://github.com/cuman14/specboard/commit/346608f06d56dc3d0db612b782e8d5aa60d5292a))
* **ci:** add automated releases with semantic-release and conventional commits ([cd6b326](https://github.com/cuman14/specboard/commit/cd6b32633f1dac17ff188cc72c8e85339fe4835f))
* initial commit — Specboard MVP (Tauri 2 + React 19) ([714fbc4](https://github.com/cuman14/specboard/commit/714fbc4378c7dd02ab0cf1aae4ef32036c37bcfb))
