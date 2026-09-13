import { describe, expect, it } from 'vitest'
import { ApiError } from '@/api/errors'
import { pokemonPersistOptions, queryClient } from './client'

describe('Pokémon query policies', () => {
  it('does not retry missing or malformed resources, but retries transient errors once', () => {
    const retry = queryClient.getDefaultOptions().queries?.retry

    if (typeof retry !== 'function') {
      throw new Error('The query retry policy must be a function.')
    }

    expect(retry(0, new ApiError('not-found', 'Missing Pokémon'))).toBe(false)
    expect(retry(0, new ApiError('invalid-data', 'Invalid payload'))).toBe(
      false
    )
    expect(retry(0, new Error('Temporary outage'))).toBe(true)
    expect(retry(1, new Error('Temporary outage'))).toBe(true)
    expect(retry(2, new Error('Temporary outage'))).toBe(false)
  })

  it('persists only successful Pokémon queries', () => {
    const shouldDehydrate =
      pokemonPersistOptions.dehydrateOptions.shouldDehydrateQuery
    const pokemon = queryClient.getQueryCache().build(queryClient, {
      queryKey: ['pokemon', 'test-persist'],
      queryFn: async () => 1
    })
    const unrelated = queryClient.getQueryCache().build(queryClient, {
      queryKey: ['local', 'test-persist'],
      queryFn: async () => 1
    })

    expect(shouldDehydrate(pokemon)).toBe(false)
    pokemon.setData(1)
    unrelated.setData(1)
    expect(shouldDehydrate(pokemon)).toBe(true)
    expect(shouldDehydrate(unrelated)).toBe(false)
    queryClient.removeQueries({ queryKey: ['pokemon', 'test-persist'] })
    queryClient.removeQueries({ queryKey: ['local', 'test-persist'] })
  })
})
