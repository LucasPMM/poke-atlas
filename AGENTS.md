# Agent Instructions — poke-atlas

- Read `pokedex-project-roadmap.md` and `DESIGN.md` before implementation.
- Keep code, comments, documentation, and commit-facing text in English. Put
  every user-facing string in `src/lib/i18n/translations.json` with matching
  `pt-BR`, `en`, and `fr` keys. Use the typed translation API.
- Use Node.js 24, pnpm, strict TypeScript, Tailwind CSS, and root Biome. Run
  `pnpm check` and `pnpm build` before handing off implementation work.
- Check the installed package declarations and current official docs before
  using a library API. Do not add deprecated APIs; migrate existing uses when
  touched.
- Never use `let`, `else`, `else if`, or `switch` in JavaScript or TypeScript.
  Prefer arrow functions, `const`, guard clauses, early returns, and lookup maps.
- Keep API requests in `src/api` and map PokéAPI DTOs to app models before
  passing data into UI components. Use TanStack Query for server state, caching,
  and persisted public API data. Add Zustand only when shared client-only state
  cannot be handled cleanly by providers, URL state, or React Hook Form.
- Bump the persisted query-cache buster when normalized API models change.
  Validate resource identifiers at the API boundary so missing IDs never
  become requests to literal `undefined` paths.
- Normalize species biology, varieties, evolution methods, and level-up moves
  at the API boundary. Select one game-version group for move highlights and
  show its name; avoid mixing moves from different games.
- Keep feature code in `src/features` and reusable primitives in
  `src/components/ui`. Every reusable component gets a PascalCase directory,
  matching `.tsx` file, and `index.ts` barrel. Import through the barrel.
- Use shared Image, Icon, Button, Text, TextInput, Select, ShouldRender, and
  Skeleton components. Do not write raw `p` or `span` elements in feature,
  page, or layout JSX; use Text for content and suitable semantic elements for
  decoration. Prefer ShouldRender for conditional JSX. Select wraps React
  Select; forms use React Hook Form, Zod, and localized validation messages.
- Compose shimmer skeletons per component so loading geometry matches the
  final view; keep the shared Skeleton as the primitive.
- Keep text-filter drafts local and debounce query/filter propagation (300 ms
  by default). A keystroke must not trigger one API request per character;
  explicit form submissions and select changes may apply immediately.
- Keep catalog search, filters, and sorting in URL parameters so views can be
  shared and restored on browser navigation. Search the full catalog, compose
  membership filters in the data layer, and preserve the filtered URL when
  returning from details. Do not fetch every Pokémon detail to build a filter
  unless a bounded data strategy has been established.
- Use semantic colors based on `DESIGN.md` in light and dark modes. Keep
  every UI color in the global theme tokens, including decorative accents.
  Use centralized Pokémon type hues with global light/dark color formulas for
  detail accents; check contrast across all 18 types.
  Initialize locale and theme from saved preferences or browser preferences;
  fall back to English and light mode. Keep choices visible and persisted.
  Respect reduced motion and use layout-matched shimmer loading.
- Never silently discard caught errors. Handle expected failures with an
  explicit fallback and diagnostic log or an actionable error state.
- Give each page a PascalCase folder, matching `.tsx` source, and `index.ts`
  barrel, like other components.
- Keep the header pinned to the top without covering page content. The favicon
  must have a transparent outer background and use the brand palette.
- Keep the header limited to the brand, language picker, and theme toggle. Make
  the language picker 84 px wide and 44 px high for its flag, code, and chevron;
  keep the theme toggle 44 px square, including on mobile. Scroll to the top when a
  Pokémon detail route opens or its identifier changes.
- Reserve card artwork and text geometry before images load. Keep card boxes
  stationary during hover/focus animations; artwork may scale inside its frame.
  Keep evolution cards stationary on hover as well. Animate artwork only within
  its reserved frame and respect reduced-motion preferences. Review the exact
  license and provenance before bundling any third-party Lottie asset.
- Keep the repository slug `poke-atlas`; use `Poké Atlas` as visible branding.
  Localize the browser title and show country flags with language labels.
- Infinite lists use TanStack Query page cursors and an IntersectionObserver
  sentinel. Guard each next-page offset against duplicate requests, retain
  loaded cards after later-page errors, and offer an explicit retry and an
  accessible manual load action.
- Keep mobile and desktop layouts accessible with visible focus styles,
  keyboard support, and comfortable touch targets.
- Keep detail-section navigation compatible with hash routes and offset its
  scroll targets below the fixed header. Load artwork in reserved frames and
  reveal it after loading without moving surrounding cards. Give empty states
  an actionable recovery path when one exists.
- Never commit unless the user explicitly requests a commit after reviewing
  the exact current changes. Follow Conventional Commits when authorized.
