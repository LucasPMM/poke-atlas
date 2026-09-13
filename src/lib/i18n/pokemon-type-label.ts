import type { Translate } from './catalog'

export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
] as const

export const getPokemonTypeLabel = (name: string, t: Translate): string => {
  const knownType = POKEMON_TYPES.find((type) => type === name)
  return knownType ? t(`types.${knownType}`) : name.replaceAll('-', ' ')
}
