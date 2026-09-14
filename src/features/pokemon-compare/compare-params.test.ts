import { describe, expect, it } from 'vitest'
import { getValidPokemonId } from './compare-params'

describe('comparison URL identifiers', () => {
  it('allows positive safe integer IDs and ignores malformed paths', () => {
    expect(getValidPokemonId('25')).toBe('25')
    for (const value of [
      null,
      '',
      '0',
      'undefined',
      '-1',
      '1/2',
      '1a',
      '9007199254740992'
    ]) {
      expect(getValidPokemonId(value)).toBe('')
    }
  })
})
