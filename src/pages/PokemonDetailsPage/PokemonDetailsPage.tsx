import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ApiError } from '@/api/errors'
import { pokemonDetailsOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Text } from '@/components/ui/Text'
import { PokemonDetailsContent } from '@/features/pokemon-details/components/PokemonDetailsContent'
import { PokemonDetailsSkeleton } from '@/features/pokemon-details/components/PokemonDetailsSkeleton'
import { useI18n } from '@/lib/i18n'

export const PokemonDetailsPage = () => {
  const { id = '' } = useParams()
  const location = useLocation()
  const { t } = useI18n()
  const backTo =
    typeof location.state?.from === 'string' &&
    (location.state.from === '/' || location.state.from.startsWith('/?'))
      ? location.state.from
      : '/'

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
          to={backTo}
        >
          <Icon name="arrowLeft" size={18} />
          {t('details.back')}
        </Link>
      </section>
    )
  }

  return <PokemonDetailsContent backTo={backTo} pokemon={pokemonQuery.data} />
}
