# poke-atlas

A multilingual Pokédex built with React, TypeScript, Vite, and Tailwind CSS.
The current milestone includes a responsive, infinitely scrolling catalog,
debounced name/number search, shareable type/generation/ability filters, sorting,
detail routes, theme and language preferences, shared UI primitives, validated
PokéAPI models, and persisted TanStack Query caching. Pokémon details now show
localized species information, measurements, abilities, base stats, defensive
type matchups, and complete evolution lines with branch navigation. The detail
view has distinct light/dark themes for all 18 Pokémon types, including a
secondary accent for dual types. See the [roadmap](pokedex-project-roadmap.md)
for upcoming detail features.

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
PokéAPI responses are normalized in `src/api` before they reach UI code. Live
text filters use `useDebouncedValue` with a 300 ms default; the hero's explicit
search submission navigates immediately and issues no query while typing.
Catalog search, filters, and sorting live in the URL. The unfiltered view uses
infinite PokéAPI pages; a filtered view loads the lightweight Pokémon catalog
and relevant membership lists, then intersects and sorts them in the client.
Filtered results are revealed in batches of 24 cards. Weakness, height, and
weight filters remain later extensions because the v2 list endpoint does not
provide the data needed for a reliable bulk filter.
The detail page loads species, types, and evolution data through separate
cached queries. Its sections can retry independently when optional data fails,
while measurements, abilities, and stats remain available.
The persisted cache is versioned with the normalized API model; incompatible
older entries are discarded. Resource identifiers are validated before a
request, preventing paths such as `/pokemon-species/undefined`.

The visible brand and localized browser title use **Poké Atlas** while the
repository slug remains `poke-atlas`. The language selector shows country
flags. Pokémon artwork uses subtle, reduced-motion-aware movement inside fixed
frames; third-party Lottie animations can be reviewed individually later.

The published site link and final desktop/mobile screenshots will be added
here after the release is deployed and visually verified.

## GitHub repository metadata

**Description:** A multilingual Pokédex for exploring, searching, and filtering Pokémon across a responsive catalog.

**Topics:** `pokedex`, `pokemon`, `pokeapi`, `react`, `typescript`, `vite`, `tailwindcss`, `tanstack-query`, `i18n`, `react-hook-form`
