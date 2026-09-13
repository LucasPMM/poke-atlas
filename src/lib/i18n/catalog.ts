import catalog from './translations.json'

export const SUPPORTED_LOCALES = ['pt-BR', 'en', 'fr'] as const
export const DEFAULT_LOCALE = 'en' as const
export const LOCALE_STORAGE_KEY = 'poke-atlas-locale'

export type Locale = (typeof SUPPORTED_LOCALES)[number]
export type TranslationKey = keyof (typeof catalog)['en']
export type TranslationParams = Record<string, string | number>
export type Translate = (
  key: TranslationKey,
  params?: TranslationParams
) => string

const translations: Record<Locale, Record<TranslationKey, string>> = catalog

export const resolveLocale = (languages: ReadonlyArray<string>): Locale => {
  const locale = languages
    .map((language) => language.toLowerCase())
    .find((language) => {
      return (
        language.startsWith('pt') ||
        language.startsWith('fr') ||
        language.startsWith('en')
      )
    })

  if (locale?.startsWith('pt')) {
    return 'pt-BR'
  }

  if (locale?.startsWith('fr')) {
    return 'fr'
  }

  return 'en'
}

export const isLocale = (value: string | null): value is Locale => {
  return SUPPORTED_LOCALES.some((locale) => locale === value)
}

export const translate = (
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams
): string => {
  const template = translations[locale][key]

  if (params === undefined) {
    return template
  }

  return Object.entries(params).reduce((result, [name, value]) => {
    return result.replaceAll(`{${name}}`, String(value))
  }, template)
}
