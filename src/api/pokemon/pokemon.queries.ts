import { queryOptions } from '@tanstack/react-query'
import {
  getEvolutionChain,
  getPokemon,
  getPokemonListPage,
  getPokemonSpecies,
  getPokemonType
} from './pokemon.api'

const DAY_MS = 24 * 60 * 60 * 1000

export const pokemonKeys = {
  list: (offset: number, limit: number) =>
    ['pokemon', 'list', offset, limit] as const,
  details: (identifier: string | number) =>
    ['pokemon', 'details', identifier] as const,
  species: (identifier: string | number) =>
    ['pokemon', 'species', identifier] as const,
  type: (identifier: string | number) =>
    ['pokemon', 'type', identifier] as const,
  evolution: (id: number) => ['pokemon', 'evolution', id] as const
}

export const pokemonListOptions = (offset = 0, limit = 30) =>
  queryOptions({
    queryKey: pokemonKeys.list(offset, limit),
    queryFn: ({ signal }) => getPokemonListPage(offset, limit, signal),
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
