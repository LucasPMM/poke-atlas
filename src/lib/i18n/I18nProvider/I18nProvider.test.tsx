import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider, useI18n } from './I18nProvider'

const LocaleProbe = () => {
  const { locale, setLocale } = useI18n()
  return (
    <button onClick={() => setLocale('pt-BR')} type="button">
      {locale}
    </button>
  )
}

beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-FR', 'en-US'])
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('locale preference', () => {
  it('starts with the first supported browser language and persists a choice', () => {
    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>
    )

    expect(screen.getByRole('button').textContent).toBe('fr')
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').textContent).toBe('pt-BR')
    expect(window.localStorage.getItem('poke-atlas-locale')).toBe('pt-BR')
  })

  it('prefers a saved locale over browser languages', () => {
    window.localStorage.setItem('poke-atlas-locale', 'en')
    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>
    )
    expect(screen.getByRole('button').textContent).toBe('en')
  })
})
