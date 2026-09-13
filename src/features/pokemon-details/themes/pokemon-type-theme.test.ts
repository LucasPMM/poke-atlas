import { describe, expect, it } from 'vitest'
import { POKEMON_TYPES } from '@/lib/i18n'
import {
  getPokemonTypeHue,
  POKEMON_TYPE_HUES,
  resolvePokemonTypeTheme
} from './pokemon-type-theme'

describe('Pokémon type themes', () => {
  it.each(POKEMON_TYPES)('provides a distinct theme for %s', (type) => {
    const theme = resolvePokemonTypeTheme([type])

    expect(theme).toEqual({ primary: type, secondary: null })
    expect(getPokemonTypeHue(type)).toBeGreaterThanOrEqual(0)
    expect(getPokemonTypeHue(type)).toBeLessThan(360)
  })

  it('covers all 18 types with distinct hues', () => {
    expect(Object.keys(POKEMON_TYPE_HUES).sort()).toEqual(
      [...POKEMON_TYPES].sort()
    )
    expect(new Set(Object.values(POKEMON_TYPE_HUES)).size).toBe(18)
  })

  it('uses the first known type as primary and the second as a subtle accent', () => {
    expect(resolvePokemonTypeTheme(['unknown', 'water', 'flying'])).toEqual({
      primary: 'water',
      secondary: 'flying'
    })
    expect(resolvePokemonTypeTheme(['unknown'])).toEqual({
      primary: 'normal',
      secondary: null
    })
    expect(getPokemonTypeHue('unknown')).toBe(POKEMON_TYPE_HUES.normal)
  })
})
