# poke-atlas — Project Roadmap

> Project status: Phases 0–3 are committed. Phase 4 (infinite scroll and
> navigation polish) is implemented locally and awaits review; Phase 5 is next.

## 1. Project Overview

Build a modern, responsive, mobile-friendly Pokédex using React and TypeScript.

The application should provide a polished Pokémon browsing experience with:

- Infinite scrolling.
- Search and advanced filters.
- Rich Pokémon detail pages.
- Type-aware visual themes.
- Responsive layouts optimized for mobile, tablet, and desktop.
- Strong automated test coverage.
- Automated CI and GitHub Pages deployment.
- A modular, maintainable codebase with English as the project-wide language.

The project should be designed as a production-quality frontend application rather than a simple API demo.

---

## 2. Project Identity

The chosen product and repository name is **poke-atlas**. Use this exact spelling
in package metadata, documentation, and visible branding.

---

## 3. Technical Decisions

### 3.1 Core stack

Use:

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **TanStack Query**
- **Biome**
- **Vitest**
- **React Testing Library**
- **Playwright**
- **GitHub Actions**
- **GitHub Pages**
- **Tailwind CSS v4**
- **React Hook Form** with Zod and `@hookform/resolvers`
- **React Select** through a shared select component

### 3.2 Why Vite

Vite is preferred over a heavier framework for this project because:

- The application is primarily client-side.
- GitHub Pages deployment is straightforward.
- The project does not initially require server-side rendering.
- Development and build times are fast.
- It keeps the architecture simple and focused.

### 3.3 Package manager

Prefer **pnpm**.

The repository should pin the package manager version using `packageManager` in `package.json`.
Use Node.js 24 and keep `.nvmrc`, `.node-version`, and package metadata aligned.

---

## 4. Data Source

### Primary API: PokéAPI v2

Use:

`https://pokeapi.co/api/v2/`

PokéAPI should be wrapped behind an internal data-access layer. Components must never depend directly on raw PokéAPI responses.

Relevant resources include:

- `/pokemon`
- `/pokemon/{id-or-name}`
- `/pokemon-species/{id-or-name}`
- `/type/{id-or-name}`
- `/ability/{id-or-name}`
- `/generation/{id-or-name}`
- `/evolution-chain/{id}`
- `/move/{id-or-name}` when required

PokéAPI resource lists support `limit` and `offset`, which should be used by the infinite-scroll implementation.

### 4.1 Data-access rule

All API interactions must live inside modules such as:

```text
src/
  api/
    client.ts
    pokemon/
      pokemon.api.ts
      pokemon.mapper.ts
      pokemon.types.ts
    types/
    generations/
    abilities/
```

UI components must consume normalized application models instead of raw API DTOs.

### 4.2 Mapping layer

Create mapping functions that transform API responses into internal entities.

Example:

```text
PokemonApiResponse
        ↓
mapPokemon()
        ↓
Pokemon
```

This prevents PokéAPI-specific naming and response structure from leaking across the application.

### 4.3 Caching

Use TanStack Query for:

- Request caching.
- Deduplication.
- Loading state.
- Error state.
- Retry behavior.
- Pagination.
- Infinite queries.
- Prefetching Pokémon details.

Persist successful, public PokéAPI queries across reloads with a versioned
TanStack Query cache and a bounded age. Cache hydration must not prevent the
app from working when browser storage is unavailable. Use Zustand only if a
future feature introduces shared client-only state that URL state, providers,
React Hook Form, and TanStack Query do not model well.
Use the supported async-storage persister, including when the underlying
browser storage is synchronous. Do not introduce deprecated library APIs.

Static resources such as types and generations may use long stale times.

---

## 5. Language and Repository Standards

Everything related to the codebase must be written in **English**, including:

- File names.
- Directory names.
- Variables.
- Functions.
- Components.
- Type names.
- Interfaces.
- Comments.
- Logs.
- Error messages.
- Test descriptions.
- Pull request descriptions.
- Commit messages.
- Workflow names.
- Documentation intended to remain in the repository.

Runtime copy is the exception: localize all visible text, labels, placeholders,
accessibility names, validation messages, empty/error states, and metadata in
Portuguese (`pt-BR`), English (`en`), and French (`fr`). Keep matching keys in a
single typed catalog. Persist explicit locale selection; otherwise use the
browser's supported language preference and fall back to English.

Console output and debug prints must also be written in English.

---

## 6. Git and Commit Rules

### 6.1 Mandatory rule

**Do not create any commit until the project owner reviews and explicitly approves the changes.**

Implementation agents must:

1. Modify the working tree.
2. Run formatting, linting, tests, and builds.
3. Present the resulting changes for review.
4. Wait for explicit approval.
5. Only then create commits.

### 6.2 Temporary Markdown files

Temporary planning files such as:

- `roadmap.md`
- migration notes
- implementation scratchpads

do **not** need to be committed.

They may remain as local changes while the implementation is in progress and may be deleted at the end.

### 6.3 Conventional Commits

After approval, all commits must follow Conventional Commits.

Examples:

```text
feat(pokedex): add infinite pokemon listing
feat(filters): add pokemon type filters
feat(details): add type-based pokemon detail theme
fix(api): handle missing pokemon artwork
test(filters): cover filter combinations
refactor(api): split pokemon response mapping
chore(ci): add github pages deployment workflow
```

Avoid generic commit messages such as:

```text
update
fix stuff
changes
final changes
```

---

## 7. Code Quality Rules

### 7.1 Modularity

Avoid:

- Large files.
- Large React components.
- Functions with multiple unrelated responsibilities.
- API calls directly inside presentation components.
- Duplicated transformation logic.
- Large conditional blocks for Pokémon types.

Prefer:

- Small reusable functions.
- Custom hooks.
- Feature modules.
- Pure utility functions.
- Typed domain models.
- Declarative configuration.

Never use `let`, `else`, `else if`, or `switch` in JavaScript or TypeScript.
Use `const`, guard clauses, early returns, and lookup tables. Prefer arrow
functions. Follow the applicable conventions adapted from `../planner/`, while
keeping this project's Vite and PokéAPI architecture distinct from Planner's
Next.js and Firebase infrastructure.

### 7.2 Suggested limits

These are guidelines rather than hard restrictions:

- Prefer functions below approximately 30–40 lines.
- Investigate components exceeding approximately 150–200 lines.
- Extract repeated JSX into reusable components.
- Extract complex state handling into hooks.
- Extract mapping and calculations into pure functions.

### 7.3 Comments

Add meaningful comments in English when they explain:

- Non-obvious behavior.
- API quirks.
- Browser workarounds.
- Performance decisions.
- Complex calculations.
- Architectural decisions.

Do not add comments that merely repeat the code.

Bad:

```ts
// Set pokemon name
const name = pokemon.name;
```

Useful:

```ts
// PokéAPI returns species references without the numeric ID,
// so derive it from the resource URL before normalizing the model.
const id = extractResourceId(species.url);
```

---

## 8. Formatter and Linter

Use **Biome as the default formatter and linter**.

Create:

```text
biome.json
```

Configure Biome for:

- Formatting.
- Import organization.
- Recommended lint rules.
- TypeScript.
- TSX/JSX.
- JSON.

Adapt Planner's Biome 2 configuration, including formatting, import
organization, recommended React rules, and Tailwind CSS parsing. Omit its
Next.js domain and platform-specific checks. Add a convention check for the
forbidden control-flow syntax.

Suggested scripts:

```json
{
  "format": "biome format --write .",
  "format:check": "biome format .",
  "lint": "biome lint .",
  "check": "biome check .",
  "check:write": "biome check --write ."
}
```

The CI workflow must verify Biome checks.

---

## 9. Proposed Project Structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx

  api/
    client.ts
    pokemon/
    species/
    types/
    abilities/
    generations/
    evolution/

  assets/

  components/
    ui/
    feedback/
    layout/

  features/
    pokemon-list/
      components/
      hooks/
      utils/
      types/

    pokemon-details/
      components/
      hooks/
      utils/
      themes/

    pokemon-filters/
      components/
      hooks/
      utils/

    pokemon-search/

  hooks/

  lib/
    constants/
    i18n/
    query/
    routing/
    theme/

  models/

  pages/
    HomePage.tsx
    PokemonDetailsPage.tsx
    NotFoundPage.tsx

  styles/
    global.css
    tokens.css
    pokemon-types.css

  test/
    fixtures/
    mocks/
    helpers/

  utils/

  main.tsx
```

Feature-specific code should stay inside the corresponding feature whenever possible.

Shared primitives for images, icons, buttons, text, inputs, selects, and
shimmer skeletons belong in `components/ui`. Every reusable component uses a
PascalCase folder with a matching source file and `index.ts` barrel; one-off
components stay beside their parent. Feature code imports shared controls
through their barrels. React Select is wrapped once with theme-aware styles;
forms use React Hook Form and localized validation.
Pages follow the same PascalCase folder and barrel convention. Use the shared
Text component instead of raw `p` or `span` elements in page, feature, and
layout JSX. Prefer ShouldRender for conditional JSX. All interface colors,
including illustrations and category accents, must come from the global theme
tokens.

---

## 10. Routing

Minimum routes:

```text
/
#/pokemon/:id
```

For GitHub Pages, choose one of the following approaches:

### Preferred initial approach

Use a hash-based router.

Example:

```text
https://username.github.io/pokeatlas/#/pokemon/25
```

Advantages:

- Reliable refresh behavior on GitHub Pages.
- No custom 404 redirect workaround required.
- Simple deployment.

A future migration to clean URLs can be evaluated separately.

---

## 11. Application Layout

### Global layout

Desktop:

```text
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│ Search / Filters                        │
├─────────────────────────────────────────┤
│ Pokémon Grid                            │
│                                         │
│                    Infinite Scroll      │
└─────────────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│ Search              │
│ Filters button      │
├─────────────────────┤
│ Pokémon cards       │
│ Pokémon cards       │
│ Pokémon cards       │
└─────────────────────┘
```

Advanced filters can open in:

- A drawer.
- A bottom sheet.
- A modal.

Prefer a bottom sheet/drawer on small screens.

---

## 12. Pokémon Listing

Create a responsive card grid.

Each card should display at minimum:

- National Pokédex number.
- Pokémon name.
- Official artwork or high-quality sprite.
- Pokémon types.

Optional secondary information:

- Main ability.
- Generation.
- Compact base-stat indicator.

### Responsive behavior

Example target:

- Mobile: 2 columns.
- Small tablet: 3 columns.
- Desktop: 4–6 columns depending on viewport size.

Use CSS Grid with auto-fit/minmax when practical instead of many breakpoint-specific rules.

---

## 13. Infinite Scroll

Use TanStack Query `useInfiniteQuery`.

PokéAPI pagination should use:

```text
limit
offset
```

Suggested page size:

```text
24–40 Pokémon
```

Start with **30** and adjust after measuring loading and rendering performance.

### Trigger

Prefer `IntersectionObserver` over scroll-event listeners.

Create a reusable hook such as:

```text
useInfiniteScroll()
```

Expected states:

- Initial loading.
- Next-page loading.
- End of list.
- Request failure.
- Retry.

Avoid loading duplicate pages.

Prevent repeated observer calls while another page is already loading.

---

## 14. Search

Support search by:

- Pokémon name.
- National Pokédex number.

Recommended behavior:

- Case insensitive.
- Trim whitespace.
- Debounced text input.
- Apply text search/filter drafts after a short debounce (default 300 ms) so
  typing does not produce one query per character. Explicit submit remains
  immediate.
- Support partial names.
- Normalize diacritics when applicable.
- Display an empty state when there are no matches.

A search such as:

```text
pika
```

should match:

```text
Pikachu
```

A numeric search such as:

```text
25
```

should find Pikachu.

---

## 15. Filters

Implement filters progressively.

### Phase 1 filters

- Type.
- Generation.
- Name / number.

### Phase 2 filters

- Ability.
- Weakness.
- Height range.
- Weight range.

### Phase 3 optional filters

- Base stat ranges.
- Evolution stage.
- Legendary.
- Mythical.
- Baby Pokémon.
- Habitat, when data quality is sufficient.

### Filter behavior

Filters must:

- Be combinable where technically possible.
- Be removable individually.
- Support "Clear all".
- Persist while navigating to Pokémon details and back.
- Update the visible results immediately or after explicit apply depending on mobile UX.

Use URL query parameters when practical.

Example:

```text
?type=fire&generation=1&search=char
```

This makes filtered views shareable.

---

## 16. Sorting

Support:

- Number ascending.
- Number descending.
- Name A–Z.
- Name Z–A.

Possible later additions:

- Height.
- Weight.
- Base stat total.

---

## 17. Pokémon Detail Page

Each Pokémon detail page should include:

### Header / hero

- Artwork.
- Pokédex number.
- Name.
- Types.
- Species/category.
- Type-based visual theme.

### General information

- Height.
- Weight.
- Abilities.
- Base experience when useful.

### Stats

Display:

- HP.
- Attack.
- Defense.
- Special Attack.
- Special Defense.
- Speed.

Use accessible bars or charts.

Always include numeric values; do not communicate stats by color alone.

### Type effectiveness

Show:

- Weaknesses.
- Resistances.
- Immunities when applicable.

### Abilities

Show:

- Standard abilities.
- Hidden abilities.
- Description where available.

### Evolution chain

Display the complete evolution chain.

Account for:

- Linear evolution.
- Branched evolution.
- Multiple evolution requirements.

### Forms

When relevant, support:

- Alternative forms.
- Regional forms.
- Mega forms.
- Gigantamax or other forms when supported by the selected data model.

### Optional later content

- Moves.
- Pokédex flavor text.
- Game appearances.
- Egg groups.
- Capture rate.
- Growth rate.

---

## 18. Type-Based Detail Customization

The detail page must visually adapt to Pokémon type.

Avoid a large structure such as:

```ts
if (type === "fire") { ... }
else if (type === "water") { ... }
else if (...)
```

Use a declarative configuration.

Example:

```ts
const pokemonTypeTheme = {
  fire: {
    accent: "...",
    background: "...",
    icon: "..."
  },
  water: {
    accent: "...",
    background: "...",
    icon: "..."
  }
};
```

Prefer CSS variables or design tokens.

Example:

```css
.pokemon-theme {
  --pokemon-accent: ...;
  --pokemon-surface: ...;
}
```

### Dual-type Pokémon

For dual-type Pokémon:

- Primary type controls the base visual identity.
- Secondary type may appear as a subtle gradient/accent.
- Maintain readability and sufficient contrast.

Theming must never compromise accessibility.

---

## 19. Visual Direction

`DESIGN.md` is the visual reference. Adapt its warm neutral canvas, teal
primary actions, DM Sans display typography, Inter utility typography,
restrained surfaces, 8/16/24/48px radius rhythm, and motion timing to an
original Pokémon discovery interface. Pokémon type colors remain secondary
data accents. Provide equivalent semantic tokens for light and dark modes.

Take inspiration from modern Pokédex applications and the official Pokémon Pokédex, especially regarding:

- Strong type identification.
- Card-based discovery.
- Name/number search.
- Type filtering.
- Weakness filtering.
- Rich detail information.
- Evolution navigation.

Do not clone another application.

Create an original visual identity.

Suggested characteristics:

- Clean card grid.
- Rounded surfaces.
- Strong Pokémon artwork.
- Type badges.
- Subtle background patterns.
- Smooth transitions.
- Lightweight animations.
- Skeleton loaders.
- Animated shimmer loading matched to final content dimensions.
- Responsive filter controls.

Avoid excessive animations that reduce usability.
Use purposeful hover, focus, navigation, and state transitions; honor
`prefers-reduced-motion` for every nonessential animation.

---

## 20. Accessibility

Target WCAG-friendly behavior.

Requirements:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible dialog/drawer behavior.
- Proper labels for inputs.
- `aria-*` attributes only when semantically necessary.
- Alternative text for meaningful images.
- Decorative images marked appropriately.
- Sufficient contrast.
- Reduced-motion support.
- A visible, keyboard-accessible language selector and light/dark theme toggle.

Initialize language and theme from saved choices, then browser preferences;
fall back to English and light when neither is available. Handle storage and
network failures explicitly rather than using silent `catch` blocks.
- Do not represent Pokémon types only by color.

Test keyboard navigation for all major flows.

---

## 21. Loading, Empty and Error States

Create reusable components:

```text
LoadingState
ErrorState
EmptyState
PokemonCardSkeleton
PokemonDetailsSkeleton
```

Compose each shimmer skeleton to match its component's final shape and size.
The shared Skeleton is only the animation primitive.

Handle:

- API unavailable.
- Network timeout.
- Missing Pokémon.
- Missing artwork.
- Empty filters.
- Invalid route IDs.
- Partial optional data.
- Failed next-page request.

Provide retry actions when appropriate.

---

## 22. Error Handling

Create an API error abstraction.

Example:

```ts
type ApiError = {
  type:
    | "network"
    | "not-found"
    | "rate-limit"
    | "server"
    | "unknown";
  message: string;
};
```

Do not expose raw technical errors directly to users.

Log technical diagnostic messages in English.

---

## 23. Performance

Apply:

- Query caching.
- Lazy-loaded routes.
- Image lazy loading.
- Code splitting.
- Prefetch on card interaction when useful.
- Memoization only after identifying actual re-render problems.
- IntersectionObserver for pagination.
- Avoid fetching full detail payloads for every visible card if unnecessary.

Run Lighthouse before final release.

Target good scores for:

- Performance.
- Accessibility.
- Best Practices.
- SEO where applicable.

---

## 24. Testing Strategy

Automated tests are a first-class requirement.

Use:

### Unit tests

- Vitest.

### Component/integration tests

- React Testing Library.

### End-to-end tests

- Playwright.

### API mocking

Prefer **MSW** when API-level mocking is required.

---

## 25. Unit Test Matrix

Add comprehensive tests for pure application logic.

### API utilities

Test:

- Resource ID extraction.
- Pagination offset calculation.
- URL parsing.
- API response normalization.
- Missing optional values.
- Invalid payload fallbacks.

### Pokémon mapper

Test:

- Single type.
- Dual type.
- Missing artwork.
- Missing ability.
- Hidden ability.
- Stats mapping.
- Sprites.
- Height and weight conversion.

### Type calculation

Test:

- Single-type weakness.
- Dual-type weakness.
- 4× weakness.
- 0.25× resistance.
- Immunity.
- Neutral damage after combined multipliers.

### Search

Test:

- Exact name.
- Partial name.
- Uppercase input.
- Lowercase input.
- Leading/trailing spaces.
- Numeric ID.
- Unknown ID.
- Empty query.

### Filters

Test each filter independently and in combination:

- Type.
- Generation.
- Ability.
- Search.
- Height.
- Weight.
- Multiple active filters.
- Clearing one filter.
- Clearing all filters.
- No matching results.

### Sorting

Test:

- Number ascending.
- Number descending.
- Name ascending.
- Name descending.

### Theme resolver

Test:

- Every supported Pokémon type.
- Primary type.
- Secondary type.
- Unknown/fallback type.

---

## 26. Component Test Matrix

### Pokémon card

Test:

- Pokémon data rendering.
- Number formatting.
- Type badges.
- Artwork.
- Fallback image.
- Navigation.
- Keyboard activation if custom interaction exists.

### Search bar

Test:

- User input.
- Debouncing where observable.
- Clear action.
- Keyboard submit if supported.

### Filter controls

Test:

- Open/close.
- Selection.
- Multiple filters.
- Reset.
- Mobile drawer behavior.

### Pokémon grid

Test:

- Initial loading.
- Loaded list.
- Empty result.
- Error.
- Loading next page.
- End-of-list state.

### Detail page

Test:

- Hero information.
- Stats.
- Abilities.
- Weaknesses.
- Evolutions.
- Type theme.
- Error state.
- Invalid Pokémon.

---

## 27. Infinite Scroll Tests

Test:

- Initial page request.
- Observer activation.
- Next page request.
- Pagination cursor/offset.
- No duplicate page request.
- Does not request while already loading.
- Stops when `next` is unavailable.
- Retry after failed page.
- Filter reset returns pagination to the first page.
- Search changes reset pagination when appropriate.

---

## 28. End-to-End Tests

Create Playwright tests for major user journeys.

### Listing

- App loads.
- Initial Pokémon appear.
- User scrolls.
- More Pokémon are appended.

### Search

- Search for Pikachu.
- Pikachu appears.
- Clear search.
- Normal list returns.

### Filters

- Filter by Fire.
- Confirm visible Pokémon match.
- Add Generation filter.
- Clear filters.

### Details

- Open Pokémon card.
- Confirm detail information.
- Confirm type theme.
- Navigate back.
- Preserve previous filters/list state.

### Responsive behavior

At minimum test:

- Mobile viewport.
- Desktop viewport.

### Error flows

Mock when required:

- Failed API call.
- Missing Pokémon.
- Failed pagination request.

---

## 29. Test Coverage

Configure coverage reporting.

Suggested initial targets:

```text
Statements: 85%
Branches:   80%
Functions:  85%
Lines:      85%
```

Critical business logic such as:

- API mapping.
- Filter logic.
- Type effectiveness.
- Pagination.

should target near-100% coverage.

Coverage percentages are not a substitute for meaningful assertions.

---

## 30. GitHub Actions — Continuous Integration

Create:

```text
.github/workflows/ci.yml
```

Trigger on:

- Pull requests.
- Pushes to the main development branches as appropriate.

The workflow should:

1. Checkout repository.
2. Configure Node.js.
3. Configure pnpm.
4. Install dependencies with frozen lockfile.
5. Run Biome checks.
6. Run TypeScript validation.
7. Run unit/component tests.
8. Run production build.
9. Optionally run Playwright E2E tests.
10. Upload useful test/coverage artifacts when a failure occurs.

Suggested scripts:

```text
pnpm check
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm build
```

---

## 31. GitHub Pages Deployment

Create:

```text
.github/workflows/deploy.yml
```

Deployment should:

1. Run after changes are accepted into the deployment branch.
2. Install dependencies.
3. Run quality checks.
4. Run tests.
5. Build the application.
6. Upload the GitHub Pages artifact.
7. Deploy through the official GitHub Pages deployment action.

Set the Vite `base` dynamically or configure it for the repository name.

Example:

```ts
export default defineConfig({
  base: "/pokeatlas/"
});
```

If the repository name changes, update this configuration accordingly.

Do not deploy broken builds.

---

## 32. CI Protection Rules

Before merging into the main branch, require:

- Biome check.
- TypeScript check.
- Unit/component tests.
- Build.
- E2E tests when included in mandatory CI.

GitHub Pages deployment should only happen after these checks pass.

---

## 33. Implementation Phases

## Phase 0 — Project Definition

- Choose repository name.
- Confirm final scope.
- Create repository.
- Define supported Node.js version.
- Define pnpm version.
- Add `.gitignore`.
- Add editor configuration if required.
- Establish the "no commit before approval" rule.

### Acceptance criteria

- Project decisions documented locally.
- No implementation commit created without approval.

---

## Phase 1 — Project Bootstrap

- Create React + TypeScript + Vite project.
- Configure pnpm.
- Configure strict TypeScript.
- Configure Biome.
- Configure aliases.
- Add React Router.
- Add TanStack Query.
- Create base folder structure.
- Add global styles.
- Add semantic light/dark design tokens based on `DESIGN.md`.
- Add typed `pt-BR`/`en`/`fr` i18n and persisted language selection.
- Add persisted light/dark theme with system preference fallback before paint.
- Add shared image, icon, button, text, input, React Select, and shimmer
  skeleton primitives.
- Wire React Hook Form into the first search/form surface.
- Add responsive home and detail-route foundations without API coupling.
- Add test environment.

### Acceptance criteria

```text
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

all succeed.

---

## Phase 2 — API Foundation

- Create PokéAPI client.
- Add typed DTOs.
- Add application models.
- Create API mappers.
- Add query keys.
- Create Pokémon list query.
- Create Pokémon details query.
- Add species query.
- Add type query.
- Add evolution query.
- Add API error handling.
- Persist versioned, successful public queries with TanStack Query.
- Ensure storage failure degrades to in-memory caching.
- Resolve the Vite CSS side-effect import declaration for strict TypeScript.

### Tests

Cover:

- Client utilities.
- Mappers.
- Error normalization.
- Pagination.

---

## Phase 3 — Base Pokémon Listing

- Create application header.
- Create Pokémon card.
- Create responsive grid.
- Fetch first page.
- Render loading skeletons.
- Render errors.
- Render artwork fallbacks.
- Add a transparent brand favicon and keep the header pinned without covering
  responsive content.
- Replace deprecated query persistence APIs.
- Prepare a reusable debounced value primitive for later text filters.

### Acceptance criteria

- Works on mobile and desktop.
- First page loads reliably.
- No raw PokéAPI DTO reaches UI components.

---

## Phase 4 — Infinite Scroll

- Implement `useInfiniteQuery`.
- Implement intersection observer sentinel.
- Handle next-page loading.
- Prevent duplicate requests.
- Handle pagination errors.
- Add end-of-list state.
- Keep prior cards visible when a later page fails, with explicit retry and a
  keyboard-accessible manual load action.
- Keep card frames stationary during hover motion while artwork animates.
- Reset scroll on Pokémon detail navigation, and keep the fixed header to one
  mobile row with equal-sized language and theme controls. Remove redundant
  Home/Explore header links.

### Tests

Cover every pagination state and observer transition.

---

## Phase 5 — Search

- Implement search input.
- Add debounce.
- Add name search.
- Add numeric search.
- Preserve search in navigation state or URL.

### Tests

Cover normalization, partial matching, IDs, reset, and empty results.

---

## Phase 6 — Filters and Sorting

Implement:

- Type filter.
- Generation filter.
- Sorting.
- Filter chips.
- Clear individual filter.
- Clear all.
- Mobile filter drawer/bottom sheet.

Then extend with:

- Ability.
- Weakness.
- Height.
- Weight.

### Important

Evaluate API capabilities before deciding which filters are server-driven and which are client-composed.

Keep filter logic separated from presentation.

---

## Phase 7 — Pokémon Detail Page

Implement:

- Route.
- Hero.
- Pokémon artwork.
- Number/name/types.
- Height/weight.
- Abilities.
- Stats.
- Species information.
- Weaknesses/resistances.
- Evolution chain.
- Loading state.
- Error state.

Add prefetching from cards if it improves perceived performance.

---

## Phase 8 — Type-Aware Themes

Create a centralized configuration for all Pokémon types:

- Normal
- Fire
- Water
- Electric
- Grass
- Ice
- Fighting
- Poison
- Ground
- Flying
- Psychic
- Bug
- Rock
- Ghost
- Dragon
- Dark
- Steel
- Fairy

Implement:

- Theme tokens.
- Primary type styling.
- Dual-type accents.
- Accessible contrast.
- Theme tests for every type.

---

## Phase 9 — Advanced Detail Features

Add progressively:

- Flavor text.
- Evolution requirements.
- Forms.
- Gender information where available.
- Egg groups.
- Capture rate.
- Growth rate.
- Relevant moves.

Avoid overloading the first version.

---

## Phase 10 — UX Polish

Add:

- Skeletons.
- Empty states.
- Retry states.
- Subtle animations.
- Reduced-motion support.
- Better mobile navigation.
- Filter transition polish.
- Hover/focus states.
- Image loading behavior.

Run accessibility review.

---

## Phase 11 — Full Automated Test Pass

Expand tests across:

- Domain utilities.
- API layer.
- Hooks.
- Components.
- Feature integration.
- Routing.
- E2E workflows.

Review missing branches instead of blindly increasing coverage numbers.

---

## Phase 12 — CI

Create GitHub Actions CI workflow.

Validate:

- Installation.
- Biome.
- TypeScript.
- Tests.
- Coverage.
- Build.
- E2E.

The same commands should work locally and in CI.

---

## Phase 13 — GitHub Pages

- Configure Vite base path.
- Configure hash routing.
- Create deployment workflow.
- Configure repository Pages settings.
- Verify production asset URLs.
- Verify direct navigation and refresh.
- Verify mobile production layout.

---

## Phase 14 — Final Review

Before the first release:

- Remove debug prints.
- Confirm all remaining logs are English.
- Remove dead code.
- Remove unused assets.
- Remove temporary comments.
- Remove temporary Markdown documents if no longer useful.
- Run Biome.
- Run TypeScript.
- Run all tests.
- Run production build.
- Run Playwright.
- Run Lighthouse.
- Review accessibility.
- Review mobile layouts.

Do not commit until changes are explicitly reviewed and approved.

---

## 34. Definition of Done

A feature is complete only when:

- Implementation is modular.
- Public behavior is tested.
- Edge cases are handled.
- Loading states exist.
- Error states exist.
- Mobile layout is verified.
- Desktop layout is verified.
- Accessibility is considered.
- Biome passes.
- TypeScript passes.
- Tests pass.
- Production build succeeds.
- Relevant comments are in English.
- No unnecessary debug logs remain.
- Changes have been reviewed before committing.

---

## 35. Future Ideas

Possible post-MVP features:

- Favorites.
- Compare Pokémon.
- Team builder.
- Dark mode.
- Shiny artwork toggle.
- Sprite generation selector.
- Region browsing.
- Generation landing pages.
- Ability explorer.
- Move explorer.
- Evolution explorer.
- Random Pokémon.
- Shareable Pokémon cards.
- Offline/PWA support.
- Local recently viewed history.
- Keyboard command palette.
- Pokémon comparison charts.

These should not block the MVP.

---

## 36. Initial MVP Scope

The first production-ready release should contain:

1. Responsive React application.
2. PokéAPI integration.
3. Pokémon grid.
4. Infinite scrolling.
5. Name/number search.
6. Type filtering.
7. Generation filtering.
8. Sorting.
9. Pokémon detail pages.
10. Stats.
11. Abilities.
12. Type effectiveness.
13. Evolution chains.
14. Type-aware visual themes.
15. Comprehensive automated tests.
16. Biome formatting/linting.
17. GitHub Actions CI.
18. GitHub Pages deployment.
19. Mobile-friendly UX.
20. No commits before explicit review and approval.

---

## 37. External References

### PokéAPI

Primary API documentation:

- https://pokeapi.co/docs/v2

### Official Pokémon Pokédex

Useful product/UX reference:

- https://www.pokemon.com/us/pokedex

Reference ideas include:

- Search by name or number.
- Type and weakness filters.
- Ability filters.
- Height and weight filters.
- Sorting.
- Pokémon detail information.
- Evolution presentation.

The application should use these products as inspiration while retaining its own architecture and visual identity.
