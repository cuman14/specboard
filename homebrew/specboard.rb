# frozen_string_literal: true

class Specboard < Formula
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  url "https://github.com/cuman14/specboard/releases/download/v1.4.1/specboard_1.4.1_x64.dmg"
  sha256 "REPLACE_WITH_SHA256"
  license "MIT"

  app "Specboard.app"

  zap trash: [
    "~/Library/Application Support/com.specboard.app",
    "~/Library/Caches/com.specboard.app",
    "~/Library/Preferences/com.specboard.app.plist",
    "~/Library/Saved Application State/com.specboard.app.savedState"
  ]
end
