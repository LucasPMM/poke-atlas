import type { z } from 'zod'
import { ApiError, errorFromStatus } from './errors'

const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const REQUEST_TIMEOUT_MS = 15_000

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch (error) {
    throw new ApiError('invalid-data', 'PokéAPI returned invalid JSON.', {
      cause: error
    })
  }
}

export const apiGet = async <T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal
): Promise<T> => {
  const timeoutController = new AbortController()
  const timeout = setTimeout(
    () => timeoutController.abort(),
    REQUEST_TIMEOUT_MS
  )
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal

  try {
    const response = await fetch(new URL(path, API_BASE_URL), {
      headers: { Accept: 'application/json' },
      signal: requestSignal
    })

    if (!response.ok) {
      throw errorFromStatus(response.status)
    }

    const result = schema.safeParse(await readJson(response))

    if (!result.success) {
      throw new ApiError(
        'invalid-data',
        'PokéAPI returned an unexpected payload.',
        {
          cause: result.error
        }
      )
    }

    return result.data
  } catch (error) {
    if (error instanceof ApiError || signal?.aborted) {
      throw error
    }

    if (timeoutController.signal.aborted) {
      throw new ApiError('timeout', 'PokéAPI request timed out.', {
        cause: error
      })
    }

    throw new ApiError('network', 'Unable to reach PokéAPI.', { cause: error })
  } finally {
    clearTimeout(timeout)
  }
}
