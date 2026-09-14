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
  const description = document.createElement('meta')
  description.name = 'description'
  document.head.append(description)
})

afterEach(() => {
  cleanup()
  document.querySelector('meta[name="description"]')?.remove()
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
    expect(document.title).toBe('Poké Atlas — Explorez les Pokémon')
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
    ).toBe(
      'Explorez les Pokémon, comparez les types et découvrez leurs histoires dans un Pokédex multilingue.'
    )
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').textContent).toBe('pt-BR')
    expect(document.title).toBe('Poké Atlas — Explore Pokémon')
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content')
    ).toBe(
      'Explore Pokémon, compare tipos e descubra suas histórias em uma Pokédex multilíngue.'
    )
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
