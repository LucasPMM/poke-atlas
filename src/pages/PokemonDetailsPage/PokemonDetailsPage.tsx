import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '@/api/errors'
import { pokemonDetailsOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Image } from '@/components/ui/Image'
import { Text } from '@/components/ui/Text'
import { PokemonDetailsSkeleton } from '@/features/pokemon-details/components/PokemonDetailsSkeleton'
import { useI18n } from '@/lib/i18n'

export const PokemonDetailsPage = () => {
  const { id = '' } = useParams()
  const { locale, t } = useI18n()

  useLayoutEffect(() => {
    if (id.length === 0) {
      return
    }

    window.scrollTo(0, 0)
  }, [id])

  const pokemonQuery = useQuery({
    ...pokemonDetailsOptions(id),
    enabled: id.length > 0
  })

  if (pokemonQuery.isPending) {
    return <PokemonDetailsSkeleton />
  }

  if (pokemonQuery.isError) {
    const message =
      pokemonQuery.error instanceof ApiError &&
      pokemonQuery.error.type === 'not-found'
        ? t('details.notFound')
        : t('details.error')

    return (
      <section className="page-container flex min-h-[60vh] flex-col items-start justify-center py-16">
        <Text as="h1" variant="heading">
          {message}
        </Text>
        <Button className="mt-7" onClick={() => void pokemonQuery.refetch()}>
          {t('details.retry')}
        </Button>
        <Link
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-action"
          to="/"
        >
          <Icon name="arrowLeft" size={18} />
          {t('details.back')}
        </Link>
      </section>
    )
  }

  const pokemon = pokemonQuery.data
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)

  return (
    <section className="page-container min-h-[60vh] py-16 md:py-24">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-action"
        to="/"
      >
        <Icon name="arrowLeft" size={18} />
        {t('details.back')}
      </Link>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div>
          <Text variant="eyebrow">
            {t('details.number', {
              number: String(pokemon.id).padStart(4, '0')
            })}
          </Text>
          <Text as="h1" className="mt-5 capitalize" variant="heading">
            {pokemon.name.replaceAll('-', ' ')}
          </Text>
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-4">
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
        <div className="flex aspect-square items-center justify-center rounded-3xl bg-surface">
          <Image
            alt={t('details.artworkAlt', { name: pokemon.name })}
            className="aspect-square w-full object-contain p-8"
            fallbackLabel={t('details.artworkFallback')}
            loading="eager"
            src={pokemon.artworkUrl}
          />
        </div>
      </div>
    </section>
  )
}
