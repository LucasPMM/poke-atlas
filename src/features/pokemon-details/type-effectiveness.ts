import type { PokemonType } from '@/models/pokemon'

export type TypeMatchup = {
  name: string
  multiplier: number
}

export type TypeEffectiveness = {
  weaknesses: Array<TypeMatchup>
  resistances: Array<TypeMatchup>
  immunities: Array<TypeMatchup>
}

const multiplierAgainst = (attack: string, defense: PokemonType): number => {
  if (defense.noDamageFrom.includes(attack)) {
    return 0
  }

  if (defense.doubleDamageFrom.includes(attack)) {
    return 2
  }

  if (defense.halfDamageFrom.includes(attack)) {
    return 0.5
  }

  return 1
}

export const calculateTypeEffectiveness = (
  defensiveTypes: ReadonlyArray<PokemonType>
): TypeEffectiveness => {
  const attackingTypes = new Set(
    defensiveTypes.flatMap((type) => [
      ...type.doubleDamageFrom,
      ...type.halfDamageFrom,
      ...type.noDamageFrom
    ])
  )
  const matchups = [...attackingTypes].map((name) => ({
    name,
    multiplier: defensiveTypes.reduce(
      (product, defense) => product * multiplierAgainst(name, defense),
      1
    )
  }))

  return {
    weaknesses: matchups
      .filter(({ multiplier }) => multiplier > 1)
      .sort(
        (first, second) =>
          second.multiplier - first.multiplier ||
          first.name.localeCompare(second.name)
      ),
    resistances: matchups
      .filter(({ multiplier }) => multiplier > 0 && multiplier < 1)
      .sort(
        (first, second) =>
          first.multiplier - second.multiplier ||
          first.name.localeCompare(second.name)
      ),
    immunities: matchups
      .filter(({ multiplier }) => multiplier === 0)
      .sort((first, second) => first.name.localeCompare(second.name))
  }
}
