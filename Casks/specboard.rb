# frozen_string_literal: true

cask "specboard" do
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  version "0.6.1"

  # Apple Silicon (arm64) — M1/M2/M3/M4
  # Intel: no disponible por limitaciones del runner de CI.
  on_arm do
    url "https://github.com/cuman14/specboard/releases/download/v0.6.1/Specboard_0.6.1_aarch64.dmg"
    sha256 "c49c25aec74a7760ecba8900d5e2e50df50f1461ccbcf215a7d81f3ab3339fa5"
  end

  app "Specboard.app"

  zap trash: [
    "~/Library/Application Support/com.specboard.app",
    "~/Library/Caches/com.specboard.app",
    "~/Library/Preferences/com.specboard.app.plist",
    "~/Library/Saved Application State/com.specboard.app.savedState"
  ]
end
