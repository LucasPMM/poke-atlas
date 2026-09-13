import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { removeOldestQuery } from '@tanstack/react-query-persist-client'
import { ApiError } from '@/api/errors'

const DAY_MS = 24 * 60 * 60 * 1000

const getStorage = (): Storage | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const storage = window.localStorage
    storage.getItem('poke-atlas-query-cache')
    return storage
  } catch (error) {
    console.warn(
      'Persistent Pokémon cache is unavailable; using memory only.',
      error
    )
    return undefined
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY_MS,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          (error.type === 'not-found' || error.type === 'invalid-data')
        ) {
          return false
        }

        return failureCount < 2
      },
      staleTime: 60_000
    }
  }
})

export const pokemonPersister = createAsyncStoragePersister({
  key: 'poke-atlas-query-cache',
  storage: getStorage(),
  retry: ({ persistedClient, error, errorCount }) => {
    console.warn(
      'Persistent Pokémon cache write failed; removing oldest query.',
      error
    )
    return removeOldestQuery({ persistedClient, error, errorCount })
  }
})

export const pokemonPersistOptions = {
  buster: 'poke-atlas-api-v1',
  maxAge: DAY_MS,
  persister: pokemonPersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: {
      queryKey: ReadonlyArray<unknown>
      state: { status: string }
    }) => query.state.status === 'success' && query.queryKey[0] === 'pokemon'
  }
}
