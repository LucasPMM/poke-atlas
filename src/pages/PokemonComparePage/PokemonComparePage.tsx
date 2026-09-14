import { useLayoutEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { getValidPokemonId } from '@/features/pokemon-compare/compare-params'
import { CompareForm } from '@/features/pokemon-compare/components/CompareForm'
import { CompareResults } from '@/features/pokemon-compare/components/CompareResults'
import { useI18n } from '@/lib/i18n'

export const PokemonComparePage = () => {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const first = getValidPokemonId(searchParams.get('first'))
  const second = getValidPokemonId(searchParams.get('second'))
  const hasPair = first.length > 0 && second.length > 0 && first !== second
  const samePair = first.length > 0 && first === second

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="page-container min-h-[70vh] py-10 md:py-16">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-action"
        to="/"
      >
        <Icon name="arrowLeft" size={18} />
        {t('compare.back')}
      </Link>
      <Text className="mt-7" variant="eyebrow">
        {t('brand.name')}
      </Text>
      <Text as="h1" className="mt-3" variant="heading">
        {t('compare.title')}
      </Text>
      <Text className="mt-4 max-w-2xl" variant="muted">
        {t('compare.description')}
      </Text>
      <CompareForm
        first={first}
        key={`${first}-${second}`}
        onCompare={({ first: nextFirst, second: nextSecond }) =>
          setSearchParams({ first: nextFirst, second: nextSecond })
        }
        second={second}
      />
      <ShouldRender if={!hasPair}>
        <Text className="mt-10 text-center" variant="muted">
          {t(
            samePair
              ? 'compare.same'
              : first
                ? 'compare.selectSecond'
                : 'compare.empty'
          )}
        </Text>
      </ShouldRender>
      <ShouldRender if={hasPair}>
        <CompareResults first={first} second={second} />
      </ShouldRender>
    </section>
  )
}
