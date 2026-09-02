# Security Policy 🔒🌸

Thank you for helping keep **kira-arts** and its users safe! We take security seriously, even in a cozy little canvas library like this one~ ✨

## Supported Versions

Only the **latest version published on npm** receives security fixes. Please make sure you're up to date before reporting an issue:

```bash
npm install kira-arts@latest
```

We move fast and ship frequently, so older versions are not patched — always check you're on the newest release first. 🌱

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities — let's keep it private until it's fixed! 🙏

Instead, choose one of the following:

1. **[GitHub Private Vulnerability Reporting](https://github.com/worddevs/kira-arts/security/advisories/new)** (preferred) — draft a private security advisory directly on this repo.
2. **Email:** [support@worddevs.dev](mailto:support@worddevs.dev)

When reporting, please include:

- A clear description of the vulnerability
- Steps to reproduce (a minimal code snippet helps a lot! 🧩)
- The affected version of `kira-arts`
- Potential impact, if known

We'll acknowledge your report within **48 hours** and keep you updated as we work on a fix. Once resolved, we'll credit you in the release notes (unless you'd prefer to stay anonymous 🌙).

## Scope Notes

`kira-arts` renders images using native/binary dependencies and fetches remote assets (avatars, backgrounds, GIFs). A few things worth knowing:

- **Native bindings:** We rely on [`@napi-rs/canvas`](https://github.com/Brooooooklyn/canvas) for rendering. If a vulnerability lives in that dependency itself, please also report it upstream.
- **GIF encoding/decoding:** We use [`gifenc`](https://github.com/mattdesl/gifenc) and [`gifuct-js`](https://github.com/matt-way/gifuct-js) for animated card generation.
- **Remote fetching:** Functions that accept URLs (avatars, custom backgrounds, watermark images) perform outbound requests. If you find an SSRF-style issue or unsafe URL handling, that's very much in scope here!

Thank you for helping us keep things safe and sparkly~ 💖✨
