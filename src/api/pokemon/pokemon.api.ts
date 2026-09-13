import type { PokemonSummary } from '@/models/pokemon'
import { apiGet } from '../client'
import {
  evolutionChainSchema,
  generationMembersSchema,
  pokemonMembersSchema,
  pokemonSchema,
  resourceListSchema,
  speciesSchema,
  typeSchema
} from '../dto'
import { ApiError } from '../errors'
import { extractNextOffset, extractResourceId } from '../resource-id'
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

export const getPokemonCatalog = async (
  signal?: AbortSignal
): Promise<Array<PokemonSummary>> => {
  const load = async (
    offset: number,
    accumulated: Array<PokemonSummary>
  ): Promise<Array<PokemonSummary>> => {
    const page = await getPokemonListPage(offset, 500, signal)
    const results = [...accumulated, ...page.results]

    if (page.nextOffset === null) {
      return results
    }

    if (page.nextOffset <= offset) {
      throw new ApiError(
        'invalid-data',
        'Pokémon catalog pagination did not advance.'
      )
    }

    return load(page.nextOffset, results)
  }

  return load(0, [])
}

export const getPokemonTypeMembers = async (
  type: string,
  signal?: AbortSignal
): Promise<Array<number>> => {
  const dto = await apiGet(
    `type/${normalizeIdentifier(type)}`,
    pokemonMembersSchema,
    signal
  )
  return dto.pokemon.map(({ pokemon }) => extractResourceId(pokemon.url))
}

export const getPokemonGenerationMembers = async (
  generation: string,
  signal?: AbortSignal
): Promise<Array<number>> => {
  const dto = await apiGet(
    `generation/${normalizeIdentifier(generation)}`,
    generationMembersSchema,
    signal
  )
  return dto.pokemon_species.map(({ url }) => extractResourceId(url))
}

export const getPokemonAbilityMembers = async (
  ability: string,
  signal?: AbortSignal
): Promise<Array<number>> => {
  const dto = await apiGet(
    `ability/${normalizeIdentifier(ability)}`,
    pokemonMembersSchema,
    signal
  )
  return dto.pokemon.map(({ pokemon }) => extractResourceId(pokemon.url))
}

export const getPokemonAbilityNames = async (
  signal?: AbortSignal
): Promise<Array<string>> => {
  const load = async (
    offset: number,
    accumulated: Array<string>
  ): Promise<Array<string>> => {
    const dto = await apiGet(
      `ability?limit=500&offset=${offset}`,
      resourceListSchema,
      signal
    )
    const names = [...accumulated, ...dto.results.map(({ name }) => name)]
    const nextOffset = extractNextOffset(dto.next)

    if (nextOffset === null) {
      return names
    }

    if (nextOffset <= offset) {
      throw new ApiError('invalid-data', 'Ability pagination did not advance.')
    }

    return load(nextOffset, names)
  }

  return load(0, [])
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
