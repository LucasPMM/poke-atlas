import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { Image } from '@/components/ui/Image'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'
import type { PokemonSummary } from '@/models/pokemon'

type PokemonCardProps = {
  pokemon: PokemonSummary
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const { t } = useI18n()
  const name = pokemon.name.replaceAll('-', ' ')

  return (
    <Link
      className="group block min-w-0 rounded-2xl bg-surface p-3 transition-shadow duration-200 hover:shadow-lg focus-visible:shadow-lg motion-reduce:transition-none sm:p-4"
      to={`/pokemon/${pokemon.id}`}
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface-muted">
        <Image
          alt={t('list.artworkAlt', { name })}
          className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:p-5"
          fallbackLabel={t('details.artworkFallback')}
          src={pokemon.artworkUrl}
        />
      </div>
      <div className="flex items-end justify-between gap-2 px-1 pb-1 pt-4">
        <div className="min-w-0">
          <Text
            className="text-xs font-medium tracking-wide text-muted"
            variant="unstyled"
          >
            {t('list.number', { number: String(pokemon.id).padStart(4, '0') })}
          </Text>
          <Text
            as="h3"
            className="mt-1 min-h-10 break-words font-display text-sm font-semibold capitalize leading-5 tracking-tight text-ink sm:text-lg"
            variant="unstyled"
          >
            {name}
          </Text>
        </div>
        <Icon
          className="hidden shrink-0 text-action sm:block"
          name="arrowUpRight"
          size={18}
        />
      </div>
    </Link>
  )
}
