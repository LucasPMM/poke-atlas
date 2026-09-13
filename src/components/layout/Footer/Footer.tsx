import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

export const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className="mt-20 bg-footer text-footer-ink">
      <div className="page-container flex flex-col justify-between gap-6 py-12 md:flex-row md:items-end md:py-16">
        <div>
          <Text
            className="font-display text-2xl font-medium tracking-[-0.04em] text-footer-ink"
            variant="unstyled"
          >
            poke-atlas
          </Text>
          <Text
            className="mt-3 max-w-sm text-sm leading-6 text-footer-muted"
            variant="unstyled"
          >
            {t('footer.note')}
          </Text>
        </div>
        <Text className="text-sm text-footer-muted" variant="unstyled">
          © {new Date().getFullYear()} poke-atlas
        </Text>
      </div>
    </footer>
  )
}
