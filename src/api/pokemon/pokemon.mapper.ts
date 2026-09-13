import type {
  EvolutionChain,
  EvolutionNode,
  Pokemon,
  PokemonListPage,
  PokemonSpecies,
  PokemonType
} from '@/models/pokemon'
import type {
  ChainLinkDto,
  EvolutionChainDto,
  PokemonDto,
  PokemonSpeciesDto,
  PokemonTypeDto,
  ResourceListDto
} from '../dto'
import { extractNextOffset, extractResourceId } from '../resource-id'
import { getOfficialArtworkUrl } from './artwork'

export const mapPokemonList = (dto: ResourceListDto): PokemonListPage => ({
  count: dto.count,
  nextOffset: extractNextOffset(dto.next),
  results: dto.results.map((resource) => {
    const id = extractResourceId(resource.url)

    return {
      id,
      name: resource.name,
      artworkUrl: getOfficialArtworkUrl(id)
    }
  })
})

export const mapPokemon = (dto: PokemonDto): Pokemon => {
  const spriteUrl = dto.sprites.front_default ?? null

  return {
    id: dto.id,
    speciesId: extractResourceId(dto.species.url),
    name: dto.name,
    artworkUrl:
      dto.sprites.other?.['official-artwork']?.front_default ?? spriteUrl,
    spriteUrl,
    types: [...dto.types]
      .sort((first, second) => first.slot - second.slot)
      .map(({ type }) => type.name),
    abilities: [...dto.abilities]
      .sort((first, second) => first.slot - second.slot)
      .map(({ ability, is_hidden }) => ({
        name: ability.name,
        isHidden: is_hidden
      })),
    stats: dto.stats.map(({ base_stat, stat }) => ({
      name: stat.name,
      value: base_stat
    })),
    heightMeters: dto.height / 10,
    weightKilograms: dto.weight / 10
  }
}

export const mapPokemonSpecies = (dto: PokemonSpeciesDto): PokemonSpecies => ({
  id: dto.id,
  name: dto.name,
  generation: extractResourceId(dto.generation.url),
  evolutionChainId: dto.evolution_chain
    ? extractResourceId(dto.evolution_chain.url)
    : null,
  names: Object.fromEntries(
    dto.names.map(({ language, name }) => [language.name, name])
  ),
  genera: Object.fromEntries(
    dto.genera.map(({ genus, language }) => [language.name, genus])
  ),
  flavorTexts: Object.fromEntries(
    dto.flavor_text_entries.map(({ flavor_text, language }) => [
      language.name,
      flavor_text.replace(/\s+/g, ' ').trim()
    ])
  )
})

export const mapPokemonType = (dto: PokemonTypeDto): PokemonType => ({
  id: dto.id,
  name: dto.name,
  doubleDamageFrom: dto.damage_relations.double_damage_from.map(
    ({ name }) => name
  ),
  halfDamageFrom: dto.damage_relations.half_damage_from.map(({ name }) => name),
  noDamageFrom: dto.damage_relations.no_damage_from.map(({ name }) => name)
})

const mapEvolutionNode = (dto: ChainLinkDto): EvolutionNode => {
  const id = extractResourceId(dto.species.url)

  return {
    id,
    name: dto.species.name,
    artworkUrl: getOfficialArtworkUrl(id),
    minimumLevel: dto.evolution_details?.[0]?.min_level ?? null,
    trigger: dto.evolution_details?.[0]?.trigger?.name ?? null,
    evolvesTo: dto.evolves_to.map(mapEvolutionNode)
  }
}

export const mapEvolutionChain = (dto: EvolutionChainDto): EvolutionChain => ({
  id: dto.id,
  root: mapEvolutionNode(dto.chain)
})
