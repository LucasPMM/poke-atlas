# Agent Instructions — poke-atlas

- Read `pokedex-project-roadmap.md` and `DESIGN.md` before implementation.
- Keep code, comments, documentation, and commit-facing text in English. Put
  every user-facing string in `src/lib/i18n/translations.json` with matching
  `pt-BR`, `en`, and `fr` keys. Use the typed translation API.
- Use Node.js 24, pnpm, strict TypeScript, Tailwind CSS, and root Biome. Run
  `pnpm check` and `pnpm build` before handing off implementation work.
- Never use `let`, `else`, `else if`, or `switch` in JavaScript or TypeScript.
  Prefer arrow functions, `const`, guard clauses, early returns, and lookup maps.
- Keep API requests in `src/api` and map PokéAPI DTOs to app models before
  passing data into UI components.
- Keep feature code in `src/features` and reusable primitives in
  `src/components/ui`. Every reusable component gets a PascalCase directory,
  matching `.tsx` file, and `index.ts` barrel. Import through the barrel.
- Use shared Image, Icon, Button, Text, TextInput, Select, and Skeleton
  components. Select wraps React Select; forms use React Hook Form, Zod, and
  localized validation messages.
- Use semantic colors based on `DESIGN.md` in light and dark modes. Keep
  locale/theme choices visible and persisted, with browser preferences as the
  default. Respect reduced motion and use layout-matched shimmer loading.
- Keep mobile and desktop layouts accessible with visible focus styles,
  keyboard support, and comfortable touch targets.
- Never commit unless the user explicitly requests a commit after reviewing
  the exact current changes. Follow Conventional Commits when authorized.
