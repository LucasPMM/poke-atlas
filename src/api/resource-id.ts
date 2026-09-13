import { ApiError } from './errors'

export const extractResourceId = (url: string): number => {
  const match = url.match(/\/(\d+)\/?(?:\?.*)?$/)
  const id = Number(match?.[1])

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ApiError(
      'invalid-data',
      'PokéAPI resource URL has no valid identifier.'
    )
  }

  return id
}

export const extractNextOffset = (url: string | null): number | null => {
  if (url === null) {
    return null
  }

  try {
    const value = new URL(url).searchParams.get('offset')
    const offset = Number(value)

    if (
      value !== null &&
      value !== '' &&
      Number.isSafeInteger(offset) &&
      offset >= 0
    ) {
      return offset
    }
  } catch (error) {
    throw new ApiError(
      'invalid-data',
      'PokéAPI returned an invalid page URL.',
      { cause: error }
    )
  }

  throw new ApiError('invalid-data', 'PokéAPI returned an invalid page offset.')
}
