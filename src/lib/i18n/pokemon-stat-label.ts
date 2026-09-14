import type { Translate, TranslationKey } from './catalog'

const statLabels: Record<string, TranslationKey> = {
  hp: 'details.stat.hp',
  attack: 'details.stat.attack',
  defense: 'details.stat.defense',
  'special-attack': 'details.stat.special-attack',
  'special-defense': 'details.stat.special-defense',
  speed: 'details.stat.speed'
}

export const getPokemonStatLabel = (name: string, t: Translate): string => {
  const labelKey = statLabels[name]
  return labelKey ? t(labelKey) : name.replaceAll('-', ' ')
}
