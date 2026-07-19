# kira-arts 🍫

A TypeScript library for generating Discord-style visual cards: profiles, welcome/leave events, level-up, achievements, leaderboards, and compatibility "ship" cards — powered by `@napi-rs/canvas`.

[![npm version](https://img.shields.io/npm/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![license](https://img.shields.io/npm/l/kira-arts.svg)](./LICENSE)

## ✨ Features

- 🖼️ **Profile Card** — user profile with avatar, badges, nameplate, server tag, and rank.
- 👋 **Welcome / Leave Card** — customizable join/leave event cards.
- 📈 **Level Up Card** — level-up card with an XP progress bar.
- 🏆 **Achievement Card** — achievement card with rarity (`common`, `rare`, `epic`, `legendary`).
- 🏅 **Leaderboard Card** — ranking table with up to 15 entries.
- 💘 **Ship Card** — compatibility card between two users.
- 🎨 **Built-in themes**: `discord`, `midnight`, `sunset`, `neon`, `forest`, `sakura`, `monochrome`, `gold`.
- 🗃️ Configurable internal cache for user data.
- 🧾 Output as `png`, `jpeg`, or `webp`, ready to use as a discord.js `AttachmentBuilder`.

## 📦 Installation

```bash
npm install kira-arts
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
