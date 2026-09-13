# poke-atlas

A multilingual Pokédex built with React, TypeScript, Vite, and Tailwind CSS.
The current milestone includes the project foundation and Phase 2 data layer:
a responsive interface, route shell, theme and language preferences, shared UI
primitives, validated PokéAPI models, and persisted TanStack Query caching.
The catalog listing begins in Phase 3 of the [roadmap](pokedex-project-roadmap.md).

## Requirements

- Node.js 24
- pnpm 10.33.4

## Commands

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
```

The app uses hash routes so it can run on GitHub Pages without server-side
route rewrites. To build for a project page, set `GITHUB_PAGES_BASE` to the
repository path, for example `/poke-atlas/`.

## Project conventions

Read [AGENTS.md](AGENTS.md), the [roadmap](pokedex-project-roadmap.md), and
[DESIGN.md](DESIGN.md) before implementation. Runtime copy lives in one typed
catalog under `src/lib/i18n`; all three locales must retain identical keys.
PokéAPI responses will be normalized in `src/api` before they reach UI code.

The published site link and final desktop/mobile screenshots will be added
here after the release is deployed and visually verified.
