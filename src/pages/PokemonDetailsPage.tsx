import { Link, useParams } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

export const PokemonDetailsPage = () => {
  const { id = '' } = useParams()
  const { t } = useI18n()

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
          <Text variant="eyebrow">{t('details.eyebrow')}</Text>
          <Text as="h1" className="mt-5" variant="heading">
            {t('details.title')}
          </Text>
          <Text className="mt-5" variant="muted">
            {t('details.description', { name: id })}
          </Text>
        </div>
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center rounded-3xl bg-surface"
        >
          <span className="brand-mark scale-[5]">
            <span className="brand-mark-center" />
          </span>
        </div>
      </div>
    </section>
  )
}
