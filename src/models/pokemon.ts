export type PokemonSummary = {
  id: number
  name: string
  artworkUrl: string
}

export type PokemonListPage = {
  count: number
  nextOffset: number | null
  results: Array<PokemonSummary>
}

export type PokemonAbility = {
  name: string
  isHidden: boolean
}

export type PokemonStat = {
  name: string
  value: number
}

export type PokemonMove = {
  name: string
  level: number
}

export type Pokemon = {
  id: number
  speciesId: number
  name: string
  artworkUrl: string | null
  spriteUrl: string | null
  types: Array<string>
  abilities: Array<PokemonAbility>
  stats: Array<PokemonStat>
  moves: Array<PokemonMove>
  moveVersion: string | null
  heightMeters: number
  weightKilograms: number
}

export type PokemonSpecies = {
  id: number
  name: string
  generation: number
  evolutionChainId: number | null
  names: Record<string, string>
  genera: Record<string, string>
  flavorTexts: Record<string, string>
  genderRate: number | null
  eggGroups: Array<string>
  captureRate: number | null
  growthRate: string | null
  varieties: Array<{ id: number; name: string; isDefault: boolean }>
}

export type PokemonType = {
  id: number
  name: string
  doubleDamageFrom: Array<string>
  halfDamageFrom: Array<string>
  noDamageFrom: Array<string>
}

export type EvolutionNode = {
  id: number
  name: string
  artworkUrl: string
  methods: Array<EvolutionMethod>
  evolvesTo: Array<EvolutionNode>
}

export type EvolutionRequirement = {
  kind:
    | 'level'
    | 'item'
    | 'heldItem'
    | 'happiness'
    | 'affection'
    | 'beauty'
    | 'time'
    | 'knownMove'
    | 'knownMoveType'
    | 'location'
    | 'gender'
    | 'specialRock'
    | 'rain'
    | 'multiplayer'
    | 'partySpecies'
    | 'partyType'
    | 'relativeStats'
    | 'tradeSpecies'
    | 'upsideDown'
    | 'region'
    | 'baseForm'
    | 'evolvedForm'
    | 'usedMove'
    | 'moveCount'
    | 'steps'
    | 'damageTaken'
  value: string | number
}

export type EvolutionMethod = {
  trigger: string | null
  requirements: Array<EvolutionRequirement>
}

export type EvolutionChain = {
  id: number
  root: EvolutionNode
}
