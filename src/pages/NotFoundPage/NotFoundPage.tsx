import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

export const NotFoundPage = () => {
  const { t } = useI18n()

  return (
    <section className="page-container flex min-h-[60vh] flex-col items-start justify-center py-16">
      <Text as="h1" variant="heading">
        {t('notFound.title')}
      </Text>
      <Text className="mt-4" variant="muted">
        {t('notFound.description')}
      </Text>
      <Link
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-action"
        to="/"
      >
        <Icon name="arrowLeft" size={18} />
        {t('notFound.back')}
      </Link>
    </section>
  )
}
