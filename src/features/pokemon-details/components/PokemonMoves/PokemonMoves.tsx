import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'
import type { Pokemon } from '@/models/pokemon'

export const PokemonMoves = ({ pokemon }: { pokemon: Pokemon }) => {
  const { t } = useI18n()
  const moves = pokemon.moves.slice(-8)

  return (
    <section className="rounded-3xl bg-surface p-6 md:p-8" id="moves">
      <Text
        as="h2"
        className="font-display text-2xl font-medium md:text-3xl"
        variant="unstyled"
      >
        {t('details.moves')}
      </Text>
      <Text className="mt-3 text-sm" variant="muted">
        {pokemon.moveVersion
          ? t('details.movesVersion', {
              version: pokemon.moveVersion.replaceAll('-', ' ')
            })
          : t('details.movesDescription')}
      </Text>
      <ShouldRender if={moves.length === 0}>
        <Text className="mt-6" variant="muted">
          {t('details.noMoves')}
        </Text>
      </ShouldRender>
      <ShouldRender if={moves.length > 0}>
        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {moves.map((move) => (
            <li
              className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted px-4 py-3"
              key={`${move.name}-${move.level}`}
            >
              <Text className="min-w-0 capitalize" variant="unstyled">
                {move.name.replaceAll('-', ' ')}
              </Text>
              <Text className="shrink-0 text-sm" variant="muted">
                {move.level === 0
                  ? t('details.startingMove')
                  : t('details.evolutionLevel', { level: move.level })}
              </Text>
            </li>
          ))}
        </ol>
      </ShouldRender>
    </section>
  )
}
