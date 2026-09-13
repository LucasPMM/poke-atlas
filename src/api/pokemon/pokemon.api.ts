import { apiGet } from '../client'
import {
  evolutionChainSchema,
  pokemonSchema,
  resourceListSchema,
  speciesSchema,
  typeSchema
} from '../dto'
import { ApiError } from '../errors'
import {
  mapEvolutionChain,
  mapPokemon,
  mapPokemonList,
  mapPokemonSpecies,
  mapPokemonType
} from './pokemon.mapper'

const normalizeIdentifier = (identifier: string | number): string => {
  const normalized = String(identifier).trim().toLowerCase()

  if (normalized.length === 0) {
    throw new ApiError('unknown', 'A Pokémon resource identifier is required.')
  }

  return encodeURIComponent(normalized)
}

export const getPokemonListPage = async (
  offset = 0,
  limit = 30,
  signal?: AbortSignal
) => {
  if (
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(limit) ||
    limit < 1
  ) {
    throw new ApiError('unknown', 'Pokémon pagination parameters are invalid.')
  }

  const dto = await apiGet(
    `pokemon?limit=${limit}&offset=${offset}`,
    resourceListSchema,
    signal
  )
  return mapPokemonList(dto)
}

export const getPokemon = async (
  identifier: string | number,
  signal?: AbortSignal
) => {
  const dto = await apiGet(
    `pokemon/${normalizeIdentifier(identifier)}`,
    pokemonSchema,
    signal
  )
  return mapPokemon(dto)
}

export const getPokemonSpecies = async (
  identifier: string | number,
  signal?: AbortSignal
) => {
  const dto = await apiGet(
    `pokemon-species/${normalizeIdentifier(identifier)}`,
    speciesSchema,
    signal
  )
  return mapPokemonSpecies(dto)
}

export const getPokemonType = async (
  identifier: string | number,
  signal?: AbortSignal
) => {
  const dto = await apiGet(
    `type/${normalizeIdentifier(identifier)}`,
    typeSchema,
    signal
  )
  return mapPokemonType(dto)
}

export const getEvolutionChain = async (id: number, signal?: AbortSignal) => {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ApiError('unknown', 'Evolution chain identifier is invalid.')
  }

  const dto = await apiGet(
    `evolution-chain/${normalizeIdentifier(id)}`,
    evolutionChainSchema,
    signal
  )
  return mapEvolutionChain(dto)
}
