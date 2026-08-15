# kira-arts 💞

A TypeScript library for generating Discord-style visual cards — profiles, welcome/leave events, level-ups, achievements, leaderboards, compatibility "ship" cards, and now-playing music cards — all powered by `@napi-rs/canvas`.

**📚 Full documentation, live examples, and a Playground: [documentation](https://kira-arts.chocofactory.dev/)**

[![npm version](https://img.shields.io/npm/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![license](https://img.shields.io/npm/l/kira-arts.svg)](https://github.com/worddevs/kira-arts/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/kira-arts.svg)](https://www.npmjs.com/package/kira-arts)
[![types](https://img.shields.io/npm/types/kira-arts.svg)](https://github.com/worddevs/kira-arts)

## ✨ Features

- 🖼️ Profile, Welcome/Leave, Level Up, Achievement, Leaderboard, Ship (compatibility), and Now Playing cards
- 🎵 Now Playing card ships with adapters for moonlink.js, Lavalink-based clients, discord-player, and distube
- 🎨 8 built-in themes, Nitro/role-color aware borders
- 🧾 Output as `png`, `jpeg`, or `webp`, ready to use as a discord.js `AttachmentBuilder`

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

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  setClient(client); // 👈 required before generating any card
});

client.login(process.env.TOKEN);

const buffer = await profileImage(userId, { guildId, useRoleColor: true, theme: "discord" });
await interaction.reply({ files: [toAttachment(buffer, "profile", "png")] });
```

Every other card, the music adapters, theming, caching, error handling, and output options are documented with live examples at **[kira-arts.chocofactory.dev](https://kira-arts.chocofactory.dev/)**.

## 📄 License

Apache-2.0 © [worddevs](https://github.com/worddevs)

## 🔗 Links

- Documentation: https://kira-arts.chocofactory.dev/
- Repository: https://github.com/worddevs/kira-arts
- Issues: https://github.com/worddevs/kira-arts/issues
