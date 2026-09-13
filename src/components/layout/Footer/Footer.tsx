import { useI18n } from '@/lib/i18n'

export const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className="mt-20 bg-footer text-white">
      <div className="page-container flex flex-col justify-between gap-6 py-12 md:flex-row md:items-end md:py-16">
        <div>
          <p className="font-display text-2xl font-medium tracking-[-0.04em]">
            poke-atlas
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
            {t('footer.note')}
          </p>
        </div>
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} poke-atlas
        </p>
      </div>
    </footer>
  )
}
