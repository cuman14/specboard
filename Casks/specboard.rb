# frozen_string_literal: true

cask "specboard" do
  desc "Visual GUI for OpenSpec — Spec-Driven Development (SDD) for AI coding assistants"
  homepage "https://github.com/cuman14/specboard"
  version "0.6.3"

  # Apple Silicon (arm64) — M1/M2/M3/M4
  # Intel: no disponible por limitaciones del runner de CI.
  on_arm do
    url "https://github.com/cuman14/specboard/releases/download/v0.6.3/Specboard_0.6.3_aarch64.dmg"
    sha256 "fa3f85c600db1cda479efcd5e4867118b91ff65dda447c47c57aea4898dc75a2"
  end

  app "Specboard.app"

  postflight do
    # App sin firmar/notarizada (proyecto open source sin cuenta Apple Developer):
    # quita la cuarentena de Gatekeeper para que abra sin el error "está dañado".
    system_command "/usr/bin/xattr",
                    args: ["-cr", "#{appdir}/Specboard.app"],
                    sudo: false
  end

  zap trash: [
    "~/Library/Application Support/com.specboard.app",
    "~/Library/Caches/com.specboard.app",
    "~/Library/Preferences/com.specboard.app.plist",
    "~/Library/Saved Application State/com.specboard.app.savedState"
  ]
end
