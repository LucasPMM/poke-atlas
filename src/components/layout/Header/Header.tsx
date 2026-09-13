import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Text } from '@/components/ui/Text'
import { type Locale, useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

export const Header = () => {
  const headerRef = useRef<HTMLElement>(null)
  const { locale, setLocale, t } = useI18n()
  const { theme, setTheme } = useTheme()
  const localeOptions: Array<SelectOption<Locale>> = [
    {
      value: 'pt-BR',
      label: t('controls.languagePortuguese'),
      shortLabel: 'PT'
    },
    { value: 'en', label: t('controls.languageEnglish'), shortLabel: 'EN' },
    { value: 'fr', label: t('controls.languageFrench'), shortLabel: 'FR' }
  ]

  useLayoutEffect(() => {
    const header = headerRef.current

    if (header === null) {
      return
    }

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.getBoundingClientRect().height}px`
      )
    }

    syncHeight()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(syncHeight)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-surface"
      ref={headerRef}
    >
      <div className="page-container flex min-h-20 items-center justify-between gap-2 py-3">
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
        <div className="flex shrink-0 items-center gap-2">
          <div className="w-11">
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
