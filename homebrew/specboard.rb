# frozen_string_literal: true

class Specboard < Formula
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  version "0.3.3"

  # Apple Silicon (arm64) — M1/M2/M3/M4
  # Intel: no disponible por limitaciones del runner de CI.
  on_arm do
    url "https://github.com/cuman14/specboard/releases/download/v0.3.3/Specboard_0.3.3_aarch64.dmg"
    sha256 "b25d18f556804002e6e4256438f5c61971476c2b4816f99781d13b0f98ef2456"
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
