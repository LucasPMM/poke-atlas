import type { PokemonSummary } from '@/models/pokemon'

export const SORT_VALUES = [
  'number-asc',
  'number-desc',
  'name-asc',
  'name-desc'
] as const

export type CatalogSort = (typeof SORT_VALUES)[number]

export type CatalogFilters = {
  search: string
  type: string
  generation: string
  ability: string
  sort: CatalogSort
}

export type CatalogMemberships = {
  type: ReadonlySet<number> | null
  generation: ReadonlySet<number> | null
  ability: ReadonlySet<number> | null
}

export const normalizeSearch = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replaceAll('-', ' ')
    .trim()

export const isCatalogSort = (value: string | null): value is CatalogSort =>
  SORT_VALUES.some((option) => option === value)

const nameCollator = new Intl.Collator('en', { sensitivity: 'base' })
const comparators: Record<
  CatalogSort,
  (first: PokemonSummary, second: PokemonSummary) => number
> = {
  'number-asc': (first, second) => first.id - second.id,
  'number-desc': (first, second) => second.id - first.id,
  'name-asc': (first, second) =>
    nameCollator.compare(first.name, second.name) || first.id - second.id,
  'name-desc': (first, second) =>
    nameCollator.compare(second.name, first.name) || first.id - second.id
}

export const filterCatalog = (
  pokemon: ReadonlyArray<PokemonSummary>,
  filters: CatalogFilters,
  memberships: CatalogMemberships
): Array<PokemonSummary> => {
  const search = normalizeSearch(filters.search)
  const numericId = /^\d+$/.test(search) ? Number(search) : null

  return pokemon
    .filter((entry) => {
      if (numericId !== null && entry.id !== numericId) {
        return false
      }

      if (
        numericId === null &&
        search.length > 0 &&
        !normalizeSearch(entry.name).includes(search)
      ) {
        return false
      }

      if (memberships.type !== null && !memberships.type.has(entry.id)) {
        return false
      }

      if (
        memberships.generation !== null &&
        !memberships.generation.has(entry.id)
      ) {
        return false
      }

      return memberships.ability === null || memberships.ability.has(entry.id)
    })
    .sort(comparators[filters.sort])
}
