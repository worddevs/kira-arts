# kira-arts 💞

A TypeScript library for generating Discord-style visual cards — profiles, welcome/leave events, level-ups, achievements, leaderboards, compatibility "ship" cards, now-playing music cards, and giveaways — rendered natively for speed and zero runtime dependencies on a browser or headless Chromium.

**📚 Full documentation, live examples, and a Playground: [documentation](https://guide.worddevs.dev/docs/kira-arts)**

[![npm version](https://img.shields.io/npm/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![npm downloads](https://img.shields.io/npm/dm/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![install size](https://packagephobia.com/badge?p=kira-arts)](https://packagephobia.com/result?p=kira-arts)
[![license](https://img.shields.io/npm/l/kira-arts.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![types](https://img.shields.io/npm/types/kira-arts.svg)](./dist/index.d.cts)
[![TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178c6.svg)](https://www.typescriptlang.org/)
[![tests](https://github.com/worddevs/kira-arts/actions/workflows/tests.yml/badge.svg)](https://github.com/worddevs/kira-arts/actions/workflows/tests.yml)
[![release](https://github.com/worddevs/kira-arts/actions/workflows/release.yml/badge.svg)](https://github.com/worddevs/kira-arts/actions/workflows/release.yml)
[![GitHub stars](https://img.shields.io/github/stars/worddevs/kira-arts.svg?style=flat)](https://github.com/worddevs/kira-arts/stargazers)
[![commit activity](https://img.shields.io/github/commit-activity/m/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/commits/main)
[![last commit](https://img.shields.io/github/last-commit/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/commits/main)
[![open issues](https://img.shields.io/github/issues/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/issues)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## ✨ Features

- 🖼️ Profile, Welcome/Leave, Level Up, Achievement, Leaderboard, Ship (compatibility), Now Playing, and Giveaway cards
- 🎵 Now Playing card ships with adapters for moonlink.js, Lavalink-based clients (erela.js, Shoukaku, Kazagumo, Riffy, Magmastream, lavalink-client), discord-player, and distube
- 🎨 8 built-in themes (`discord`, `midnight`, `sunset`, `neon`, `forest`, `sakura`, `monochrome`, `gold`), Nitro/role-color aware borders, and up to 4-color custom gradients
- 🧾 Output as `png`, `jpeg`, or `webp`, ready to use as a discord.js `AttachmentBuilder` via `toAttachment()`
- ⚡ Built-in, configurable in-memory cache for fetched user data (`setCacheOptions`, `clearCache`, `getCacheSize`)
- 🛡️ Typed error handling with `KiraError` and `KiraErrorCode`, instead of opaque runtime failures
- 📦 Dual package: ESM and CommonJS builds, both with full type declarations, no extra config needed

## 📦 Installation

```bash
npm install kira-arts
yarn add kira-arts
pnpm add kira-arts
bun add kira-arts
```

> Requires Node.js >= 20 and a project with `discord.js` ^14.27.0 already installed (peer dependency).

## 🚀 Quick usage

```ts
import { Client, GatewayIntentBits } from "discord.js";
import { setClient, profileImage, toAttachment } from "kira-arts";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", () => {
  setClient(client); // 👈 required before generating any card
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || message.content !== "!card") return;

  const buffer = await profileImage(message.author.id, {
    guildId: message.guild?.id,
    useRoleColor: true,
    presenceStatus: message.member?.presence?.status,
    badgesFrame: true,
  });

  await message.reply({ files: [toAttachment(buffer, { name: "profile", extension: "png" })] });
});

client.login(process.env.TOKEN);
```

Every other card, the music adapters, theming, caching, error handling, and output options are documented with live examples at **[documentation](https://guide.worddevs.dev/docs/kira-arts)**.

## 🃏 Cards at a glance

| Card        | Function                                      | What it's for                               |
| ----------- | --------------------------------------------- | ------------------------------------------- |
| Profile     | `profileImage(userId, options)`               | Avatar, badges, nameplate, server tag, rank |
| Welcome     | `welcomeImage(userId, guildName, options)`    | Member join events                          |
| Leave       | `leaveImage(userId, guildName, options)`      | Member leave events                         |
| Level Up    | `levelUpImage(userId, level, options)`        | XP progress bar on level-up                 |
| Achievement | `achievementImage(userId, title, options)`    | Unlockable achievements with rarity tiers   |
| Leaderboard | `leaderboardImage(entries, options)`          | Server ranking table                        |
| Ship        | `shipImage(leftUserId, rightUserId, options)` | Compatibility between two users             |
| Now Playing | `nowPlayingImage(track, options)`             | Music player card with source detection     |
| Giveaway    | `giveawayImage(prize, options)`               | Prize, host, entry count, winners on end    |

## 🛠️ Utilities

| Function                                        | What it's for                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| `setClient(client)`                             | Registers your discord.js client — required before generating any card |
| `toAttachment(buffer, name, format)`            | Wraps a card buffer into a discord.js `AttachmentBuilder`              |
| `encodeCanvas(canvas, options)`                 | Encodes a raw canvas to `png` / `jpeg` / `webp`                        |
| `extensionForFormat(format)`                    | Returns the file extension for an `OutputFormat`                       |
| `setCacheOptions(options)`                      | Configures the internal user-data cache (enable, TTL)                  |
| `clearCache()`                                  | Clears the internal user-data cache                                    |
| `getCacheSize()`                                | Returns the number of entries currently cached                         |
| `computeCompatibility(leftUserId, rightUserId)` | Deterministic compatibility percentage for the Ship card               |
| `pickShipMessage(percentage)`                   | Flavor text matching a compatibility percentage                        |
| `getThemePalette(theme)`                        | Resolves a `KiraThemeName` to its full color palette                   |
| `fromMoonlinkTrack(track)`                      | Adapter: moonlink.js track → `NowPlayingTrack`                         |
| `fromLavalinkTrack(track)`                      | Adapter: Lavalink-based clients → `NowPlayingTrack`                    |
| `fromDiscordPlayerTrack(track)`                 | Adapter: discord-player track → `NowPlayingTrack`                      |
| `fromDistubeTrack(song)`                        | Adapter: distube song → `NowPlayingTrack`                              |
| `extractRequesterId(track)`                     | Pulls the requester's user ID out of any supported track               |

> `THEMES` (all 8 built-in palettes), `KiraError` / `KiraErrorCode`, and lower-level canvas/validation helpers (`loadImageSafe`, `hexToRgb`, `hexToRgba`, `drawGradientBorder`, `drawCoverImage`, `parseHex`, `decimalToHex`, `parseImg`, `parsePng`, `isString`, `isNumber`) are also exported for advanced use — see the [documentation](https://guide.worddevs.dev/docs/kira-arts) for details.

## 📄 License

Kira-Arts is released under the **Apache-2.0 License**.

Copyright © [worddevs](https://github.com/worddevs)

## 🔗 Links

- 📚 **Documentation:** https://guide.worddevs.dev/docs/kira-arts
- 📦 **NPM:** https://www.npmjs.com/package/kira-arts
- 💻 **Repository:** https://github.com/worddevs/kira-arts
- 🐛 **Issues:** https://github.com/worddevs/kira-arts/issues
- 🔀 **Contributing:** https://github.com/worddevs/kira-arts/blob/main/CONTRIBUTING.md

---

<p align="center">
  Made with 💞 by <a href="https://github.com/worddevs">WordDevs</a>
</p>

<p align="center">
  <sub>Built with TypeScript, designed for performance.</sub>
</p>
