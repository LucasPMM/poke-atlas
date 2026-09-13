export type ApiErrorType =
  | 'network'
  | 'timeout'
  | 'not-found'
  | 'rate-limit'
  | 'server'
  | 'invalid-data'
  | 'unknown'

export class ApiError extends Error {
  readonly type: ApiErrorType
  readonly status?: number

  constructor(
    type: ApiErrorType,
    message: string,
    options?: { status?: number; cause?: unknown }
  ) {
    super(message, { cause: options?.cause })
    this.name = 'ApiError'
    this.type = type
    this.status = options?.status
  }
}

export const errorFromStatus = (status: number): ApiError => {
  if (status === 404) {
    return new ApiError('not-found', 'Pokémon resource was not found.', {
      status
    })
  }

  if (status === 429) {
    return new ApiError('rate-limit', 'PokéAPI rate limit was reached.', {
      status
    })
  }

  if (status >= 500) {
    return new ApiError('server', 'PokéAPI returned a server error.', {
      status
    })
  }

  return new ApiError('unknown', 'PokéAPI returned an unexpected response.', {
    status
  })
}
