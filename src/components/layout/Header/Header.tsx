import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Text } from '@/components/ui/Text'
import { type Locale, useI18n } from '@/lib/i18n'
import { scrollToSection } from '@/lib/motion/scroll-to-section'
import { useTheme } from '@/lib/theme'

export const Header = () => {
  const { locale, setLocale, t } = useI18n()
  const { theme, setTheme } = useTheme()
  const { pathname } = useLocation()
  const localeOptions: Array<SelectOption<Locale>> = [
    { value: 'pt-BR', label: t('controls.languagePortuguese') },
    { value: 'en', label: t('controls.languageEnglish') },
    { value: 'fr', label: t('controls.languageFrench') }
  ]

  const explore = () => {
    if (pathname !== '/') {
      window.location.hash = '#/'
      return
    }

    scrollToSection('preview')
  }

  return (
    <header className="relative z-20 border-b border-line/70 bg-surface">
      <div className="page-container flex min-h-20 flex-wrap items-center justify-between gap-3 py-3">
        <Link
          aria-label="poke-atlas"
          className="flex items-center gap-3"
          to="/"
        >
          <div aria-hidden="true" className="brand-mark">
            <div className="brand-mark-center" />
          </div>
          <Text
            as="span"
            className="font-display text-xl font-semibold tracking-[-0.05em] text-ink"
            variant="unstyled"
          >
            poke
            <Text as="span" className="text-action" variant="unstyled">
              -
            </Text>
            atlas
          </Text>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
          <nav
            aria-label={t('nav.home')}
            className="hidden items-center gap-1 md:flex"
          >
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-action"
              to="/"
            >
              {t('nav.home')}
            </Link>
            <Button onClick={explore} variant="ghost">
              {t('nav.explore')}
            </Button>
          </nav>
          <div className="w-32 sm:w-40">
            <Select
              ariaLabel={t('controls.language')}
              onChange={setLocale}
              options={localeOptions}
              value={locale}
            />
          </div>
          <Button
            aria-label={
              theme === 'light' ? t('controls.dark') : t('controls.light')
            }
            className="!w-11 !px-0"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={t('controls.theme')}
            variant="outline"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </Button>
        </div>
      </div>
    </header>
  )
}
