import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import {
  getEvolutionChain,
  getPokemon,
  getPokemonAbilityMembers,
  getPokemonAbilityNames,
  getPokemonCatalog,
  getPokemonGenerationMembers,
  getPokemonListPage,
  getPokemonSpecies,
  getPokemonType,
  getPokemonTypeMembers
} from './pokemon.api'

const DAY_MS = 24 * 60 * 60 * 1000

export const pokemonKeys = {
  infiniteList: (limit: number) => ['pokemon', 'infinite-list', limit] as const,
  catalog: () => ['pokemon', 'catalog'] as const,
  typeMembers: (type: string) => ['pokemon', 'type-members', type] as const,
  generationMembers: (generation: string) =>
    ['pokemon', 'generation-members', generation] as const,
  abilityMembers: (ability: string) =>
    ['pokemon', 'ability-members', ability] as const,
  abilityNames: () => ['pokemon', 'ability-names'] as const,
  details: (identifier: string | number) =>
    ['pokemon', 'details', identifier] as const,
  species: (identifier: string | number) =>
    ['pokemon', 'species', identifier] as const,
  type: (identifier: string | number) =>
    ['pokemon', 'type', identifier] as const,
  evolution: (id: number) => ['pokemon', 'evolution', id] as const
}

export const pokemonInfiniteListOptions = (limit = 24) =>
  infiniteQueryOptions({
    queryKey: pokemonKeys.infiniteList(limit),
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      getPokemonListPage(pageParam, limit, signal),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    staleTime: DAY_MS
  })

export const pokemonCatalogOptions = () =>
  queryOptions({
    queryKey: pokemonKeys.catalog(),
    queryFn: ({ signal }) => getPokemonCatalog(signal),
    staleTime: DAY_MS
  })

export const pokemonTypeMembersOptions = (type: string) =>
  queryOptions({
    queryKey: pokemonKeys.typeMembers(type),
    queryFn: ({ signal }) => getPokemonTypeMembers(type, signal),
    staleTime: DAY_MS
  })

export const pokemonGenerationMembersOptions = (generation: string) =>
  queryOptions({
    queryKey: pokemonKeys.generationMembers(generation),
    queryFn: ({ signal }) => getPokemonGenerationMembers(generation, signal),
    staleTime: DAY_MS
  })

export const pokemonAbilityMembersOptions = (ability: string) =>
  queryOptions({
    queryKey: pokemonKeys.abilityMembers(ability),
    queryFn: ({ signal }) => getPokemonAbilityMembers(ability, signal),
    staleTime: DAY_MS
  })

export const pokemonAbilityNamesOptions = () =>
  queryOptions({
    queryKey: pokemonKeys.abilityNames(),
    queryFn: ({ signal }) => getPokemonAbilityNames(signal),
    staleTime: DAY_MS
  })

export const pokemonDetailsOptions = (identifier: string | number) =>
  queryOptions({
    queryKey: pokemonKeys.details(identifier),
    queryFn: ({ signal }) => getPokemon(identifier, signal),
    staleTime: DAY_MS
  })

export const pokemonSpeciesOptions = (identifier: string | number) =>
  queryOptions({
    queryKey: pokemonKeys.species(identifier),
    queryFn: ({ signal }) => getPokemonSpecies(identifier, signal),
    staleTime: DAY_MS
  })

export const pokemonTypeOptions = (identifier: string | number) =>
  queryOptions({
    queryKey: pokemonKeys.type(identifier),
    queryFn: ({ signal }) => getPokemonType(identifier, signal),
    staleTime: DAY_MS
  })

export const evolutionChainOptions = (id: number) =>
  queryOptions({
    queryKey: pokemonKeys.evolution(id),
    queryFn: ({ signal }) => getEvolutionChain(id, signal),
    staleTime: DAY_MS
  })
