import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

export const SectionError = ({ retry }: { retry: () => void }) => {
  const { t } = useI18n()

  return (
    <div className="rounded-2xl border border-line bg-surface p-5" role="alert">
      <Text variant="muted">{t('details.sectionError')}</Text>
      <Button className="mt-4" onClick={retry} variant="outline">
        {t('details.retry')}
      </Button>
    </div>
  )
}
