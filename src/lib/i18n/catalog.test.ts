import { describe, expect, it } from 'vitest'
import { resolveLocale, translate } from './catalog'
import catalog from './translations.json'

describe('translation catalog', () => {
  it('keeps the same keys and placeholders in every locale', () => {
    const englishKeys = Object.keys(catalog.en).sort()
    const placeholders = (text: string) =>
      [...text.matchAll(/\{[^{}]+\}/g)].map(([value]) => value).sort()

    for (const locale of [catalog['pt-BR'], catalog.fr]) {
      expect(Object.keys(locale).sort()).toEqual(englishKeys)

      for (const key of englishKeys) {
        const translationKey = key as keyof typeof catalog.en
        expect(placeholders(locale[translationKey])).toEqual(
          placeholders(catalog.en[translationKey])
        )
      }
    }
  })

  it('resolves the first supported browser preference', () => {
    expect(resolveLocale(['de-DE', 'fr-CA', 'pt-BR'])).toBe('fr')
    expect(resolveLocale(['pt-PT'])).toBe('pt-BR')
    expect(resolveLocale(['de-DE'])).toBe('en')
  })

  it('interpolates values', () => {
    expect(
      translate('en', 'details.description', { name: 'Pikachu' })
    ).toContain('Pikachu')
  })
})
