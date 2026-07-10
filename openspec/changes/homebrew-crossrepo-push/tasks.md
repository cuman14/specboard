## 1. Remove old cross-repo push steps

- [x] 1.1 Remove the "Verificar acceso al tap antes del clone" step from `.github/workflows/release.yml`
- [x] 1.2 Remove the "Sincronizar Cask al tap remoto (homebrew-specboard)" step (the manual `git clone` + copy + push block) from `.github/workflows/release.yml`

## 2. Add actions/checkout cross-repo push

- [x] 2.1 Add a new step "Checkout Homebrew tap repo" using `actions/checkout@v4` with `repository: cuman14/homebrew-specboard`, `token: ${{ secrets.RELEASE_TOKEN }}`, `path: homebrew-tap`
- [x] 2.2 Add a step "Copy updated Cask to tap repo" that copies `Casks/specboard.rb` to `homebrew-tap/Casks/specboard.rb`
- [x] 2.3 Add a step "Commit and push Cask update" that configures git, stages, commits (with `[skip ci]`), and pushes within the `homebrew-tap` directory

## 3. Verify and clean up

- [x] 3.1 Verify the workflow YAML is valid (no syntax errors, correct indentation)
- [x] 3.2 Remove any comments referencing the old manual clone approach
- [x] 3.3 Update AGENTS.md "Homebrew SHA256/URL updates in `update-sha256.js`" section note if any references to the old clone pattern exist