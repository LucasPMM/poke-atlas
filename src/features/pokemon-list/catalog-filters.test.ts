import { describe, expect, it } from 'vitest'
import type { PokemonSummary } from '@/models/pokemon'
import {
  type CatalogFilters,
  type CatalogMemberships,
  filterCatalog,
  normalizeSearch
} from './catalog-filters'

const pokemon: Array<PokemonSummary> = [
  { id: 25, name: 'pikachu', artworkUrl: '' },
  { id: 4, name: 'charmander', artworkUrl: '' },
  { id: 122, name: 'mr-mime', artworkUrl: '' },
  { id: 1, name: 'bulbasaur', artworkUrl: '' }
]
const defaults: CatalogFilters = {
  search: '',
  type: '',
  generation: '',
  ability: '',
  sort: 'number-asc'
}
const noMemberships = { type: null, generation: null, ability: null }
const names = (
  filters: CatalogFilters,
  memberships: CatalogMemberships = noMemberships
) => filterCatalog(pokemon, filters, memberships).map(({ name }) => name)

describe('catalog filters', () => {
  it('normalizes case, diacritics, hyphens, and whitespace', () => {
    expect(normalizeSearch('  Mr-Mimé  ')).toBe('mr mime')
    expect(names({ ...defaults, search: ' PIKA ' })).toEqual(['pikachu'])
    expect(names({ ...defaults, search: 'MR MIM' })).toEqual(['mr-mime'])
  })

  it('matches a national number exactly, including leading zeroes', () => {
    expect(names({ ...defaults, search: '0025' })).toEqual(['pikachu'])
    expect(names({ ...defaults, search: '2' })).toEqual([])
  })

  it('combines type, generation, and ability membership without changing the source', () => {
    const memberships = {
      type: new Set([4, 25]),
      generation: new Set([1, 4, 25]),
      ability: new Set([4])
    }
    expect(
      names(
        { ...defaults, type: 'fire', generation: '1', ability: 'blaze' },
        memberships
      )
    ).toEqual(['charmander'])
    expect(pokemon.map(({ id }) => id)).toEqual([25, 4, 122, 1])
  })

  it('sorts by number and name in both directions', () => {
    expect(names({ ...defaults, sort: 'number-desc' })).toEqual([
      'mr-mime',
      'pikachu',
      'charmander',
      'bulbasaur'
    ])
    expect(names({ ...defaults, sort: 'name-asc' })).toEqual([
      'bulbasaur',
      'charmander',
      'mr-mime',
      'pikachu'
    ])
    expect(names({ ...defaults, sort: 'name-desc' })).toEqual([
      'pikachu',
      'mr-mime',
      'charmander',
      'bulbasaur'
    ])
  })
})
