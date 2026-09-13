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

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const THEME_STORAGE_KEY = 'poke-atlas-theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

const getSavedTheme = (): string | null => {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY)
  } catch (error) {
    console.warn(
      'Unable to read the saved theme; using the system preference.',
      error
    )
    return null
  }
}

const isTheme = (value: string | null): value is Theme => {
  return value === 'light' || value === 'dark'
}

const getPreferredTheme = (): Theme => {
  if (typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const resolveTheme = (): Theme => {
  const saved = getSavedTheme()

  if (isTheme(saved)) {
    return saved
  }

  return getPreferredTheme()
}

const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  const canvasColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--surface-canvas')
    .trim()
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', canvasColor)
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(resolveTheme)
  const hasExplicitTheme = useRef(isTheme(getSavedTheme()))

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (hasExplicitTheme.current) {
        return
      }

      setThemeState(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    hasExplicitTheme.current = true
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch (error) {
      console.warn(
        'Unable to save the theme; keeping the in-memory choice.',
        error
      )
      setThemeState(nextTheme)
      return
    }

    setThemeState(nextTheme)
  }, [])
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error('useTheme must be used inside ThemeProvider.')
  }

  return context
}
