# frozen_string_literal: true

class Specboard < Formula
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  version "0.3.3"

  # Apple Silicon (arm64) — M1/M2/M3/M4
  # Intel: no disponible por limitaciones del runner de CI.
  on_arm do
    url "https://github.com/cuman14/specboard/releases/download/v0.3.3/Specboard_0.3.3_aarch64.dmg"
    sha256 "bdce4fba27821a5de5a8e844b7aa4763588bc874321b766460df5192b8b7083b"
  end

  license "MIT"

  app "Specboard.app"

  zap trash: [
    "~/Library/Application Support/com.specboard.app",
    "~/Library/Caches/com.specboard.app",
    "~/Library/Preferences/com.specboard.app.plist",
    "~/Library/Saved Application State/com.specboard.app.savedState"
  ]
end
