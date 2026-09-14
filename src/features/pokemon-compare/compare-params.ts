export const getValidPokemonId = (value: string | null): string => {
  if (value === null || !/^[1-9]\d*$/.test(value)) {
    return ''
  }

  return Number.isSafeInteger(Number(value)) ? value : ''
}
