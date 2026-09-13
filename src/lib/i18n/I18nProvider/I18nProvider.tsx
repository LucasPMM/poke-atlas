import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
  resolveLocale,
  type Translate,
  translate
} from '../catalog'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translate
}

const I18nContext = createContext<I18nContextValue | null>(null)

const getSavedLocale = (): string | null => {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY)
  } catch (error) {
    console.warn(
      'Unable to read the saved locale; using browser preferences.',
      error
    )
    return null
  }
}

const persistLocale = (locale: Locale): void => {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch (error) {
    console.warn(
      'Unable to save the locale; keeping the in-memory choice.',
      error
    )
    return
  }
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const hasExplicitLocale = useRef(isLocale(getSavedLocale()))
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof navigator === 'undefined') {
      return DEFAULT_LOCALE
    }

    const saved = getSavedLocale()

    if (isLocale(saved)) {
      return saved
    }

    return resolveLocale(navigator.languages)
  })

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const handleLanguageChange = () => {
      if (hasExplicitLocale.current) {
        return
      }

      setLocaleState(resolveLocale(navigator.languages))
    }

    window.addEventListener('languagechange', handleLanguageChange)
    return () =>
      window.removeEventListener('languagechange', handleLanguageChange)
  }, [])

  const setLocale = useCallback((nextLocale: Locale) => {
    hasExplicitLocale.current = true
    persistLocale(nextLocale)
    setLocaleState(nextLocale)
  }, [])
  const t = useCallback<Translate>(
    (key, params) => translate(locale, key, params),
    [locale]
  )
  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext)

  if (context === null) {
    throw new Error('useI18n must be used inside I18nProvider.')
  }

  return context
}
