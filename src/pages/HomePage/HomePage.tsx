import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Text } from '@/components/ui/Text'
import { SearchForm } from '@/features/pokemon-search/components/SearchForm'
import { type TranslationKey, useI18n } from '@/lib/i18n'
import { scrollToSection } from '@/lib/motion/scroll-to-section'

const features: Array<{
  icon: IconName
  title: TranslationKey
  description: TranslationKey
  color: string
}> = [
  {
    icon: 'compass',
    title: 'home.featureDiscover',
    description: 'home.featureDiscoverDescription',
    color: 'bg-feature-discover text-feature-discover-ink'
  },
  {
    icon: 'layers',
    title: 'home.featureCompare',
    description: 'home.featureCompareDescription',
    color: 'bg-feature-compare text-feature-compare-ink'
  },
  {
    icon: 'waypoints',
    title: 'home.featureFollow',
    description: 'home.featureFollowDescription',
    color: 'bg-feature-follow text-feature-follow-ink'
  }
]

export const HomePage = () => {
  const { t } = useI18n()

  return (
    <>
      <section className="page-container grid min-h-[610px] items-center gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div className="relative z-10 max-w-2xl">
          <Text variant="eyebrow">{t('home.eyebrow')}</Text>
          <Text as="h1" className="mt-6" variant="display">
            {t('home.titleStart')}{' '}
            <Text as="span" className="text-action" variant="unstyled">
              {t('home.titleEnd')}
            </Text>
          </Text>
          <Text className="mt-7 max-w-xl" variant="muted">
            {t('home.description')}
          </Text>
          <SearchForm />
          <Button
            className="mt-6 px-0 text-action hover:bg-transparent"
            onClick={() => scrollToSection('preview')}
            variant="ghost"
          >
            {t('home.exploreAction')}
            <Icon name="arrowDownRight" size={18} />
          </Button>
        </div>
        <div aria-hidden="true" className="atlas-illustration">
          <div className="atlas-orbit atlas-orbit-one" />
          <div className="atlas-orbit atlas-orbit-two" />
          <div className="atlas-planet atlas-planet-main">
            <div className="atlas-planet-line" />
            <div className="atlas-planet-button" />
          </div>
          <div className="atlas-planet atlas-planet-small" />
          <div className="atlas-spark atlas-spark-one">✦</div>
          <div className="atlas-spark atlas-spark-two">✦</div>
          <div className="atlas-dot atlas-dot-one" />
          <div className="atlas-dot atlas-dot-two" />
        </div>
      </section>

      <section className="page-container pb-4 pt-8 md:pt-16" id="preview">
        <div className="max-w-2xl">
          <Text variant="eyebrow">{t('home.previewLabel')}</Text>
          <Text as="h2" className="mt-4" variant="heading">
            {t('home.previewTitle')}
          </Text>
          <Text className="mt-4" variant="muted">
            {t('home.previewDescription')}
          </Text>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article className="rounded-2xl bg-surface p-6" key={feature.title}>
              <div
                className={`mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}
              >
                <Icon name={feature.icon} size={21} />
              </div>
              <Text as="h3" className="font-medium" variant="body">
                {t(feature.title)}
              </Text>
              <Text className="mt-2 text-sm" variant="muted">
                {t(feature.description)}
              </Text>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container mt-20 md:mt-28">
        <div className="rounded-3xl bg-surface px-6 py-10 md:flex md:items-end md:justify-between md:gap-10 md:px-12 md:py-12">
          <div className="max-w-xl">
            <Text variant="eyebrow">{t('home.foundationLabel')}</Text>
            <Text as="h2" className="mt-4" variant="heading">
              {t('home.foundationTitle')}
            </Text>
            <Text className="mt-4" variant="muted">
              {t('home.foundationDescription')}
            </Text>
          </div>
          <div
            aria-hidden="true"
            className="mt-8 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-action/10 text-action md:mt-0"
          >
            <Icon name="sparkles" size={30} />
          </div>
        </div>
      </section>
    </>
  )
}
