import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { Image } from '@/components/ui/Image'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { getPokemonTypeLabel, useI18n } from '@/lib/i18n'
import type { Pokemon, PokemonSpecies } from '@/models/pokemon'
import {
  getPokemonTypeStyle,
  resolvePokemonTypeTheme
} from '../../themes/pokemon-type-theme'

type PokemonHeroProps = {
  pokemon: Pokemon
  species?: PokemonSpecies
  backTo: string
}

export const PokemonHero = ({ pokemon, species, backTo }: PokemonHeroProps) => {
  const { locale, t } = useI18n()
  const name =
    pokemon.id === pokemon.speciesId
      ? (species?.names[locale] ?? species?.names.en ?? pokemon.name)
      : pokemon.name
  const flavorText =
    species?.flavorTexts[locale] ?? species?.flavorTexts.en ?? null
  const theme = resolvePokemonTypeTheme(pokemon.types)
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)

  return (
    <section className="page-container pt-10 pb-12 md:pt-16 md:pb-20">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-action"
        to={backTo}
      >
        <Icon name="arrowLeft" size={18} />
        {t('details.back')}
      </Link>
      <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div>
          <Text className="pokemon-accent-text" variant="eyebrow">
            {t('details.number', {
              number: String(pokemon.speciesId).padStart(4, '0')
            })}
          </Text>
          <Text as="h1" className="mt-4 capitalize" variant="heading">
            {name.replaceAll('-', ' ')}
          </Text>
          <div className="mt-6 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <Text
                className="pokemon-type-badge rounded-full px-4 py-2 text-sm font-medium"
                key={type}
                style={getPokemonTypeStyle(type)}
                variant="unstyled"
              >
                {getPokemonTypeLabel(type, t)}
              </Text>
            ))}
          </div>
          <ShouldRender if={Boolean(flavorText)}>
            <Text className="mt-7 max-w-lg" variant="muted">
              {flavorText}
            </Text>
          </ShouldRender>
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-2xl bg-surface p-5">
              <Text className="text-sm text-muted" variant="unstyled">
                {t('details.height')}
              </Text>
              <Text
                className="mt-2 text-xl font-medium text-ink"
                variant="unstyled"
              >
                {t('details.meters', {
                  value: formatNumber(pokemon.heightMeters)
                })}
              </Text>
            </div>
            <div className="rounded-2xl bg-surface p-5">
              <Text className="text-sm text-muted" variant="unstyled">
                {t('details.weight')}
              </Text>
              <Text
                className="mt-2 text-xl font-medium text-ink"
                variant="unstyled"
              >
                {t('details.kilograms', {
                  value: formatNumber(pokemon.weightKilograms)
                })}
              </Text>
            </div>
          </div>
          <Link
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
            to={`/compare?first=${pokemon.id}`}
          >
            <Icon name="layers" size={18} />
            {t('compare.open')}
            <Icon name="arrowUpRight" size={16} />
          </Link>
        </div>
        <div className="pokemon-artwork-frame flex aspect-square items-center justify-center overflow-hidden rounded-3xl">
          <ShouldRender if={theme.secondary !== null}>
            <div
              aria-hidden="true"
              className="pokemon-type-swatch"
              style={getPokemonTypeStyle(theme.secondary ?? 'normal')}
            />
          </ShouldRender>
          <Image
            alt={t('details.artworkAlt', { name })}
            className="pokemon-artwork-motion aspect-square w-full object-contain p-8 md:p-12"
            fallbackLabel={t('details.artworkFallback')}
            loading="eager"
            src={pokemon.artworkUrl}
          />
        </div>
      </div>
    </section>
  )
}
