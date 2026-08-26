# kira-arts 💞

A TypeScript library for generating Discord-style visual cards — profiles, welcome/leave events, level-ups, achievements, leaderboards, compatibility "ship" cards, and now-playing music cards — all powered by `@napi-rs/canvas`.

**📚 Full documentation, live examples, and a Playground: [documentation](https://guide.worddevs.dev/docs/kira-arts)**

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
[![contributors](https://img.shields.io/badge/contributors-2-orange)](https://github.com/worddevs/kira-arts/graphs/contributors)
[![last commit](https://img.shields.io/github/last-commit/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/commits/main)
[![open issues](https://img.shields.io/github/issues/worddevs/kira-arts.svg)](https://github.com/worddevs/kira-arts/issues)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## ✨ Features

- 🖼️ Profile, Welcome/Leave, Level Up, Achievement, Leaderboard, Ship (compatibility), and Now Playing cards
- 🎵 Now Playing card ships with adapters for moonlink.js, Lavalink-based clients, discord-player, and distube
- 🎨 8 built-in themes, Nitro/role-color aware borders, and up to 4-color custom gradients
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

client.once("clientReady", () => {
  setClient(client); // 👈 required before generating any card
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) return;

  if (interaction.commandName === "card") {
    const buffer = await profileImage(interaction.user.id, {
      guildId: interaction.guild?.id,
      useRoleColor: true,
      presenceStatus: interaction.member?.presence?.status,
      customBadges: extraBadges.length ? extraBadges : undefined,
      badgesFrame: true,
    });

    await interaction.reply({ files: [toAttachment(buffer, "profile", "png")] });
  }
});

client.login(process.env.TOKEN);
```

Every other card, the music adapters, theming, caching, error handling, and output options are documented with live examples at **[documentation](https://guide.worddevs.dev/docs/kira-arts)**.

## 🃏 Cards at a glance

| Card            | Function                          | What it's for                               |
| --------------- | --------------------------------- | ------------------------------------------- |
| Profile         | `profileImage()`                  | Avatar, badges, nameplate, server tag, rank |
| Welcome / Leave | `welcomeImage()` / `leaveImage()` | Member join/leave events                    |
| Level Up        | `levelUpImage()`                  | XP progress bar on level-up                 |
| Achievement     | `achievementImage()`              | Unlockable achievements with rarity tiers   |
| Leaderboard     | `leaderboardImage()`              | Server ranking table                        |
| Ship            | `shipImage()`                     | Compatibility between two users             |
| Now Playing     | `nowPlayingImage()`               | Music player card with source detection     |

## 🤝 Contributors

Kira-Arts is developed and maintained by the WordDevs community.

<a href="https://github.com/worddevs/kira-arts/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=worddevs/kira-arts" alt="Contributors" />
</a>

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
  <sub>Built with TypeScript and powered by <code>@napi-rs/canvas</code>.</sub>
</p>
