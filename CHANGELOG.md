# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.2] - 2026-07-25

### Fixed
- `ResolvedLeaderboardEntry`, `LevelUpLayout`, `MemberEventLayout`, `TextEffect`,
  and `CanvasBadge` were being imported from local `./constants` / sibling module
  files instead of their actual source in `@Types`, causing "not exported member"
  build errors in `LeaderboardImage`, `LevelUpCard`, `MemberEeventCard`, and
  `ProfileImage`. All now import from `@Types` directly.
- `ResolvedLeaderboardEntry`, `LevelUpLayout`, `MemberEventLayout`, and
  `TextEffect` were missing from the package root (`Src/index.ts` /
  `Src/@Types/index.ts`) and are now exported alongside the other public types.

### Changed
- Pinned `typescript` to `~6.0.3` (was `^6.0.3`) to prevent an unintended
  major-version jump to TS 7.0, which is not yet supported by
  `typescript-eslint` or `tsup`'s DTS build step.
- Updated `eslint` to `10.8.0`, `prettier` to `8.5.1`, and `typescript-eslint`
  to `8.65.0`.

## [1.2.1] - 2026-07-24

### Added
- `funding` field in `package.json` for the "Fund this package" button on npm.
- CI: Socket Security scanning, `npm audit`, CodeQL, and dependency review.
- Stale bot to auto-close inactive issues/PRs after 60+14 days of no activity.
- PR preview builds via `pkg-pr-new`.

## [1.2.0] - 2026-07-23

### Added
- `nowPlayingImage(track, options)` — Now Playing card with playback progress, a
  source-platform badge, and livestream/radio support (`isStream`).
- Automatic platform detection: YouTube, Spotify, SoundCloud, Twitch, Deezer, Apple
  Music, Bandcamp, Vimeo, direct links, and local files — each with its own accent
  color and generic icon.
- Adapters for the most common music libraries, without adding them as a
  dependency: `fromMoonlinkTrack` (moonlink.js), `fromLavalinkTrack` (erela.js,
  Shoukaku, Kazagumo, Riffy, Magmastream, lavalink-client), `fromDiscordPlayerTrack`
  (discord-player), `fromDistubeTrack` (distube), and `extractRequesterId`.
- Support for themes, role/Nitro border colors, a "Requested by" badge, and custom
  backgrounds on the Now Playing card, matching the rest of the cards.
- Smart artwork handling: square covers fill edge-to-edge; wide thumbnails (e.g.
  YouTube video frames) get letterboxed with a blurred background fill instead of
  being cropped.
- Small "vinyl record" flourish peeking out from behind the artwork, plus an
  optional pause indicator overlay.
- All Now Playing types (`NowPlayingTrack`, `NowPlayingOptions`, `SourceMeta`,
  adapter track shapes, etc.) exported from the package root.

## [1.1.1] - 2026-07-20

### Fixed
- Removed `@rolldown/binding-win32-x64-msvc`, which had been manually forced into
  the dependency tree as a workaround for an earlier local npm bug — caused
  unnecessary downloads for end users and CI failures on Linux runners. npm/rolldown
  now resolves the correct platform binary on its own.
- Removed a stale `Src/Public` entry from the `files` field in `package.json`
  (`Public` lives at the project root, not under `Src`).

### Docs
- Added `pnpm`, `yarn`, and `bun` installation instructions to the README,
  alongside `npm`.

## [1.1.0] - 2026-07-19

### Fixed
- Corrected the `copyfiles` build script to copy `Public/**/*` into `dist/Public/*`
  — fonts were never being included in the published package due to a path
  referencing `Src/Public` instead of the project-root `Public` folder.
- Corrected `fonts.utils.ts` to resolve `dist/Public/Fonts` correctly (was two
  levels too high, with mismatched casing that would also fail on case-sensitive
  filesystems).
- Release workflow now accepts both `v*.*.*` and `V*.*.*` tag conventions.

## [1.0.0] - 2026-07-19

### Added
- Initial from-scratch TypeScript implementation of profile, welcome/leave,
  level-up, achievement, leaderboard, and ship card generation.
- 8 built-in themes: `discord`, `midnight`, `sunset`, `neon`, `forest`, `sakura`,
  `monochrome`, `gold`.
- Configurable internal cache for user data.
- Output as `png`, `jpeg`, or `webp`.
- Dual package build: ESM (`import`) and CommonJS (`require`).

<!--
How to use this file:

1. While working, add your changes under [Unreleased], in the category that
   applies (Added, Changed, Fixed, Deprecated, Removed, Security).

2. When you publish a new version to npm, rename [Unreleased] to the real
   version and date, e.g.:

   ## [1.3.0] - 2026-08-01

   ...and leave an empty [Unreleased] above it for the next cycle.

Categories:
- Added:      new functionality
- Changed:    changes to existing behavior
- Fixed:      bug fixes
- Deprecated: something still working but due for removal
- Removed:    something that no longer exists
- Security:   security patches
-->
