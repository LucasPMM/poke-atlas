import type {
  EvolutionChain,
  EvolutionMethod,
  EvolutionNode,
  EvolutionRequirement,
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

const preferredMoveVersions = [
  'scarlet-violet',
  'legends-arceus',
  'brilliant-diamond-and-shining-pearl',
  'sword-shield',
  'ultra-sun-ultra-moon',
  'sun-moon',
  'omega-ruby-alpha-sapphire',
  'x-y',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
  'emerald',
  'firered-leafgreen',
  'ruby-sapphire',
  'crystal',
  'gold-silver',
  'yellow',
  'red-blue'
]

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
  const levelUpMoves = (dto.moves ?? []).flatMap(
    ({ move, version_group_details }) =>
      version_group_details
        .filter(
          ({ move_learn_method }) => move_learn_method.name === 'level-up'
        )
        .map(({ level_learned_at, version_group }) => ({
          name: move.name,
          level: level_learned_at,
          versionGroup: version_group.name,
          versionGroupId: extractResourceId(version_group.url)
        }))
  )
  const preferredVersion = preferredMoveVersions.find((version) =>
    levelUpMoves.some(({ versionGroup }) => versionGroup === version)
  )
  const latestVersionId = Math.max(
    0,
    ...levelUpMoves.map(({ versionGroupId }) => versionGroupId)
  )
  const latestMoves = levelUpMoves
    .filter(({ versionGroup, versionGroupId }) =>
      preferredVersion
        ? versionGroup === preferredVersion
        : versionGroupId === latestVersionId
    )
    .sort(
      (first, second) =>
        first.level - second.level || first.name.localeCompare(second.name)
    )

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
    moves: latestMoves.map(({ name, level }) => ({ name, level })),
    moveVersion: latestMoves[0]?.versionGroup ?? null,
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
  ),
  genderRate: dto.gender_rate ?? null,
  eggGroups: dto.egg_groups?.map(({ name }) => name) ?? [],
  captureRate: dto.capture_rate ?? null,
  growthRate: dto.growth_rate?.name ?? null,
  varieties:
    dto.varieties?.map(({ is_default, pokemon }) => ({
      id: extractResourceId(pokemon.url),
      name: pokemon.name,
      isDefault: is_default
    })) ?? []
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

const mapEvolutionMethod = (
  detail: NonNullable<ChainLinkDto['evolution_details']>[number]
): EvolutionMethod => {
  const candidates: Array<EvolutionRequirement | null> = [
    detail.min_level !== null && detail.min_level !== undefined
      ? { kind: 'level', value: detail.min_level }
      : null,
    detail.item ? { kind: 'item', value: detail.item.name } : null,
    detail.held_item
      ? { kind: 'heldItem', value: detail.held_item.name }
      : null,
    detail.min_happiness !== null && detail.min_happiness !== undefined
      ? { kind: 'happiness', value: detail.min_happiness }
      : null,
    detail.min_affection !== null && detail.min_affection !== undefined
      ? { kind: 'affection', value: detail.min_affection }
      : null,
    detail.min_beauty !== null && detail.min_beauty !== undefined
      ? { kind: 'beauty', value: detail.min_beauty }
      : null,
    detail.time_of_day ? { kind: 'time', value: detail.time_of_day } : null,
    detail.known_move
      ? { kind: 'knownMove', value: detail.known_move.name }
      : null,
    detail.known_move_type
      ? { kind: 'knownMoveType', value: detail.known_move_type.name }
      : null,
    detail.location ? { kind: 'location', value: detail.location.name } : null,
    detail.gender !== null && detail.gender !== undefined
      ? { kind: 'gender', value: detail.gender }
      : null,
    detail.near_special_rock ? { kind: 'specialRock', value: 1 } : null,
    detail.needs_overworld_rain ? { kind: 'rain', value: 1 } : null,
    detail.needs_multiplayer ? { kind: 'multiplayer', value: 1 } : null,
    detail.party_species
      ? { kind: 'partySpecies', value: detail.party_species.name }
      : null,
    detail.party_type
      ? { kind: 'partyType', value: detail.party_type.name }
      : null,
    detail.relative_physical_stats !== null &&
    detail.relative_physical_stats !== undefined
      ? { kind: 'relativeStats', value: detail.relative_physical_stats }
      : null,
    detail.trade_species
      ? { kind: 'tradeSpecies', value: detail.trade_species.name }
      : null,
    detail.turn_upside_down ? { kind: 'upsideDown', value: 1 } : null,
    detail.region ? { kind: 'region', value: detail.region.name } : null,
    detail.base_form
      ? { kind: 'baseForm', value: detail.base_form.name }
      : null,
    detail.evolved_form
      ? { kind: 'evolvedForm', value: detail.evolved_form.name }
      : null,
    detail.used_move
      ? { kind: 'usedMove', value: detail.used_move.name }
      : null,
    detail.min_move_count !== null && detail.min_move_count !== undefined
      ? { kind: 'moveCount', value: detail.min_move_count }
      : null,
    detail.min_steps !== null && detail.min_steps !== undefined
      ? { kind: 'steps', value: detail.min_steps }
      : null,
    detail.min_damage_taken !== null && detail.min_damage_taken !== undefined
      ? { kind: 'damageTaken', value: detail.min_damage_taken }
      : null
  ]

  return {
    trigger: detail.trigger?.name ?? null,
    requirements: candidates.filter(
      (candidate): candidate is EvolutionRequirement => candidate !== null
    )
  }
}

const mapEvolutionNode = (dto: ChainLinkDto): EvolutionNode => {
  const id = extractResourceId(dto.species.url)

  return {
    id,
    name: dto.species.name,
    artworkUrl: getOfficialArtworkUrl(id),
    methods: dto.evolution_details?.map(mapEvolutionMethod) ?? [],
    evolvesTo: dto.evolves_to.map(mapEvolutionNode)
  }
}

export const mapEvolutionChain = (dto: EvolutionChainDto): EvolutionChain => ({
  id: dto.id,
  root: mapEvolutionNode(dto.chain)
})
