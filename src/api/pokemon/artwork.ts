const OFFICIAL_ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'

export const getOfficialArtworkUrl = (id: number): string => {
  return `${OFFICIAL_ARTWORK_BASE}${id}.png`
}
