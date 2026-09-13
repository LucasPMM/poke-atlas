export type PokemonSummary = {
  id: number
  name: string
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

export type Pokemon = {
  id: number
  name: string
  artworkUrl: string | null
  spriteUrl: string | null
  types: Array<string>
  abilities: Array<PokemonAbility>
  stats: Array<PokemonStat>
  heightMeters: number
  weightKilograms: number
}

export type PokemonSpecies = {
  id: number
  name: string
  generation: string
  evolutionChainId: number | null
  names: Record<string, string>
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
  minimumLevel: number | null
  trigger: string | null
  evolvesTo: Array<EvolutionNode>
}

export type EvolutionChain = {
  id: number
  root: EvolutionNode
}
