import { describe, expect, it } from 'vitest'
import { ApiError } from './errors'
import { extractNextOffset, extractResourceId } from './resource-id'

describe('PokéAPI resource URLs', () => {
  it('extracts identifiers from resource URLs', () => {
    expect(extractResourceId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(
      extractResourceId('https://pokeapi.co/api/v2/pokemon-species/1')
    ).toBe(1)
  })

  it('rejects malformed identifiers', () => {
    expect(() =>
      extractResourceId('https://pokeapi.co/api/v2/pokemon/pikachu/')
    ).toThrow(ApiError)
    expect(() =>
      extractResourceId('https://pokeapi.co/api/v2/pokemon/0/')
    ).toThrow(ApiError)
  })

  it('extracts pagination offsets and rejects malformed page URLs', () => {
    expect(
      extractNextOffset('https://pokeapi.co/api/v2/pokemon?offset=30&limit=30')
    ).toBe(30)
    expect(extractNextOffset(null)).toBeNull()
    expect(() =>
      extractNextOffset('https://pokeapi.co/api/v2/pokemon?limit=30')
    ).toThrow(ApiError)
  })
})
