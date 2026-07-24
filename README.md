# kira-arts 💞

A TypeScript library for generating Discord-style visual cards — profiles, welcome/leave events, level-ups, achievements, leaderboards, compatibility "ship" cards, and now-playing music cards — all powered by `@napi-rs/canvas`.

[![npm version](https://img.shields.io/npm/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![npm downloads](https://img.shields.io/npm/dm/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![install size](https://packagephobia.com/badge?p=kira-arts)](https://packagephobia.com/result?p=kira-arts)
[![license](https://img.shields.io/npm/l/kira-arts.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![types](https://img.shields.io/npm/types/kira-arts.svg)](./dist/index.d.ts)
[![TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178c6.svg)](https://www.typescriptlang.org/)
[![tests](https://github.com/worddevs/kira-arts/actions/workflows/tests.yml/badge.svg)](https://github.com/worddevs/kira-arts/actions/workflows/tests.yml)
[![release](https://github.com/worddevs/kira-arts/actions/workflows/release.yml/badge.svg)](https://github.com/worddevs/kira-arts/actions/workflows/release.yml)
[![GitHub stars](https://img.shields.io/github/stars/worddevs/kira-arts.svg?style=flat)](https://github.com/worddevs/kira-arts/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/worddevs/kira-arts.svg?style=flat)](https://github.com/worddevs/kira-arts/network/members)
[![contributors](https://img.shields.io/github/contributors/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/graphs/contributors)
[![last commit](https://img.shields.io/github/last-commit/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/commits/main)
[![open issues](https://img.shields.io/github/issues/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/issues)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## ✨ Features

- 🖼️ **Profile Card** — user profile with avatar, badges, nameplate, server tag, and rank.
- 👋 **Welcome / Leave Card** — customizable join/leave event cards.
- 📈 **Level Up Card** — level-up card with an XP progress bar.
- 🏆 **Achievement Card** — achievement card with rarity (`common`, `rare`, `epic`, `legendary`).
- 🏅 **Leaderboard Card** — ranking table with up to 15 entries.
- 💘 **Ship Card** — compatibility card between two users.
- 🎵 **Now Playing Card** — music player card with progress bar, source badge (YouTube, Spotify, SoundCloud, Twitch, Deezer, Apple Music, etc.), and live-stream support. Ships with adapters for moonlink.js, Lavalink-based clients, discord-player, and distube.
- 🎨 **Built-in themes**: `discord`, `midnight`, `sunset`, `neon`, `forest`, `sakura`, `monochrome`, `gold`.
- 🗃️ Configurable internal cache for user data.
- 🧾 Output as `png`, `jpeg`, or `webp`, ready to use as a discord.js `AttachmentBuilder`.

## 📦 Installation

```cmd
npm install kira-arts

pnpm add kira-arts

yarn add kira-arts

bun add kira-arts
```

> Requires Node.js >= 20 and a project with `discord.js` ^14.27.0 already installed (peer dependency).

## 🚀 Quick usage

Register your discord.js client **once** at startup:

```ts
import { Client, GatewayIntentBits } from "discord.js";
import { setClient } from "kira-arts";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  setClient(client); // 👈 required before generating any card
});

client.login(process.env.TOKEN);
```

### Profile card

```ts
import { profileImage, toAttachment } from "kira-arts";

const buffer = await profileImage(userId, {
  guildId: interaction.guildId!,
  useRoleColor: true,
  theme: "discord",
  presenceStatus: "online",
});

const attachment = toAttachment(buffer, "profile", "png");
await interaction.reply({ files: [attachment] });
```

### Welcome / leave

```ts
import { welcomeImage, leaveImage } from "kira-arts";

const buffer = await welcomeImage(userId, guild.name, {
  memberCount: guild.memberCount,
  theme: "sunset",
});
```

### Level up

```ts
import { levelUpImage } from "kira-arts";

const buffer = await levelUpImage(userId, 12, {
  currentXp: 450,
  requiredXp: 1000,
  theme: "neon",
});
```

### Achievement

```ts
import { achievementImage } from "kira-arts";

const buffer = await achievementImage(userId, "First victory!", {
  description: "Win your first ranked match.",
  rarity: "epic",
});
```

### Leaderboard

```ts
import { leaderboardImage } from "kira-arts";

const buffer = await leaderboardImage(
  [
    { userId: "111", currentXp: 900, requiredXp: 1000, level: 20 },
    { userId: "222", currentXp: 300, requiredXp: 800, level: 14 },
  ],
  { title: "Server Top", theme: "gold", maxEntries: 10 },
);
```

### Ship (compatibility)

```ts
import { shipImage } from "kira-arts";

const buffer = await shipImage(userIdA, userIdB, {
  theme: "midnight",
  showText: true,
});
```

### Now playing

```ts
import { nowPlayingImage } from "kira-arts";

const buffer = await nowPlayingImage(
  {
    title: "Blinding Lights",
    author: "The Weeknd",
    artworkUrl: track.artworkUrl,
    duration: 200_040,
    sourceName: "spotify",
  },
  {
    position: 45_000,
    requesterId: interaction.user.id,
    guildId: interaction.guildId!,
    theme: "midnight",
  },
);
```

For a livestream / radio, omit `duration` (or set it to `0`) and set `isStream: true` — the card shows a `LIVE` badge and a full progress bar instead of a position.

#### Music library adapters

You don't have to build the `track` object by hand. If you're using a supported player library, convert its track object directly:

```ts
import { nowPlayingImage, fromMoonlinkTrack, fromLavalinkTrack, fromDiscordPlayerTrack, fromDistubeTrack, extractRequesterId } from "kira-arts";

// moonlink.js
const buffer = await nowPlayingImage(fromMoonlinkTrack(player.current), {
  requesterId: extractRequesterId(player.current),
});

// Lavalink-based clients (erela.js, Shoukaku, Kazagumo, Riffy, Magmastream, lavalink-client)
const buffer = await nowPlayingImage(fromLavalinkTrack(track));

// discord-player
const buffer = await nowPlayingImage(fromDiscordPlayerTrack(queue.currentTrack));

// distube
const buffer = await nowPlayingImage(fromDistubeTrack(queue.songs[0]));
```

Each adapter is a plain duck-typed converter — kira-arts doesn't depend on any of these libraries, so any object with a matching shape works, including one you build yourself from a raw API response.

## 🎨 Available themes

```
discord | midnight | sunset | neon | forest | sakura | monochrome | gold
```

Pass it as `theme` in any card's options, or use `getThemePalette(theme)` to get the raw palette.

## 🗃️ Cache

```ts
import { setCacheOptions, clearCache, getCacheSize } from "kira-arts";

setCacheOptions({ ttl: 60_000 }); // example, adjust to your actual options
clearCache();
console.log(getCacheSize());
```

## ⚠️ Error handling

Every function throws a `KiraError` with a typed `code` (`KiraErrorCode`):

```ts
import { KiraError, KiraErrorCode } from "kira-arts";

try {
  await profileImage(userId);
} catch (err) {
  if (err instanceof KiraError && err.code === KiraErrorCode.Validation) {
    // handle validation error
  }
}
```

Available codes: `Validation`, `Fetch`, `AssetLoad`, `Render`, `Config`.

## 📤 Output format

Every image-generating function returns a `Buffer`. Control format/quality with `output`:

```ts
await profileImage(userId, {
  output: { format: "webp", quality: 90 },
});
```

Supported formats: `png`, `jpeg`, `webp`.

## 📄 License

Apache-2.0 © [worddevs](https://github.com/worddevs)

## 🔗 Links

- Repository: https://github.com/worddevs/kira-arts
- Issues: https://github.com/worddevs/kira-arts/issues
