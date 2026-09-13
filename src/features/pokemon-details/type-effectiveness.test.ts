import { describe, expect, it } from 'vitest'
import type { PokemonType } from '@/models/pokemon'
import { calculateTypeEffectiveness } from './type-effectiveness'

const type = (
  name: string,
  doubleDamageFrom: Array<string>,
  halfDamageFrom: Array<string>,
  noDamageFrom: Array<string> = []
): PokemonType => ({
  id: 1,
  name,
  doubleDamageFrom,
  halfDamageFrom,
  noDamageFrom
})

describe('type effectiveness', () => {
  it('multiplies dual-type relations and cancels opposing effects', () => {
    const result = calculateTypeEffectiveness([
      type('grass', ['fire', 'ice', 'flying'], ['water', 'electric']),
      type('poison', ['ground', 'psychic'], ['fighting', 'grass', 'fire'])
    ])

    expect(result.weaknesses).toEqual([
      { name: 'flying', multiplier: 2 },
      { name: 'ground', multiplier: 2 },
      { name: 'ice', multiplier: 2 },
      { name: 'psychic', multiplier: 2 }
    ])
    expect(result.weaknesses).not.toContainEqual({
      name: 'fire',
      multiplier: 2
    })
    expect(result.resistances).toContainEqual({
      name: 'water',
      multiplier: 0.5
    })
  })

  it('keeps a fourfold weakness and lets immunity override other relations', () => {
    const result = calculateTypeEffectiveness([
      type('grass', ['fire'], ['water']),
      type('steel', ['fire'], ['water'], ['ground'])
    ])

    expect(result.weaknesses).toEqual([{ name: 'fire', multiplier: 4 }])
    expect(result.resistances).toContainEqual({
      name: 'water',
      multiplier: 0.25
    })
    expect(result.immunities).toEqual([{ name: 'ground', multiplier: 0 }])
  })
})
