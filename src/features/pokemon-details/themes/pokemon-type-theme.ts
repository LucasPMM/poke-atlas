import type { CSSProperties } from 'react'
import { POKEMON_TYPES } from '@/lib/i18n'

export type PokemonTypeName = (typeof POKEMON_TYPES)[number]

export const POKEMON_TYPE_HUES: Record<PokemonTypeName, number> = {
  normal: 90,
  fire: 35,
  water: 240,
  electric: 95,
  grass: 145,
  ice: 195,
  fighting: 25,
  poison: 310,
  ground: 70,
  flying: 255,
  psychic: 350,
  bug: 125,
  rock: 60,
  ghost: 290,
  dragon: 275,
  dark: 265,
  steel: 215,
  fairy: 330
}

const isPokemonType = (value: string): value is PokemonTypeName =>
  POKEMON_TYPES.some((type) => type === value)

export const getPokemonTypeHue = (name: string): number =>
  isPokemonType(name) ? POKEMON_TYPE_HUES[name] : POKEMON_TYPE_HUES.normal

export const getPokemonTypeStyle = (name: string): CSSProperties =>
  ({ '--pokemon-hue': getPokemonTypeHue(name) }) as CSSProperties

export const resolvePokemonTypeTheme = (types: ReadonlyArray<string>) => {
  const knownTypes = types.filter(isPokemonType)
  const primary = knownTypes[0] ?? 'normal'
  const secondary = knownTypes.find((type) => type !== primary) ?? null

  return { primary, secondary }
}
