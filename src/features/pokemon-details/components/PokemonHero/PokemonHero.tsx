import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { Image } from '@/components/ui/Image'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { getPokemonTypeLabel, useI18n } from '@/lib/i18n'
import type { Pokemon, PokemonSpecies } from '@/models/pokemon'

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
          <Text variant="eyebrow">
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
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink"
                key={type}
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
        </div>
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-surface-muted">
          <Image
            alt={t('details.artworkAlt', { name })}
            className="aspect-square w-full object-contain p-8 md:p-12"
            fallbackLabel={t('details.artworkFallback')}
            loading="eager"
            src={pokemon.artworkUrl}
          />
        </div>
      </div>
    </section>
  )
}
