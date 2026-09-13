import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  pokemonAbilityNamesOptions,
  pokemonCatalogOptions,
  pokemonInfiniteListOptions
} from '@/api/pokemon'
import { I18nProvider } from '@/lib/i18n'
import { LOCALE_STORAGE_KEY } from '@/lib/i18n/catalog'
import { ThemeProvider } from '@/lib/theme'
import { App } from './App'

const renderApp = (path = '/') => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  client.setQueryData(pokemonAbilityNamesOptions().queryKey, [])
  client.setQueryData(pokemonInfiniteListOptions(24).queryKey, {
    pages: [
      {
        count: 2,
        nextOffset: null,
        results: [
          { id: 1, name: 'bulbasaur', artworkUrl: '/1.png' },
          { id: 25, name: 'pikachu', artworkUrl: '/25.png' }
        ]
      }
    ],
    pageParams: [0]
  })
  client.setQueryData(pokemonCatalogOptions().queryKey, [
    { id: 1, name: 'bulbasaur', artworkUrl: '/1.png' },
    { id: 25, name: 'pikachu', artworkUrl: '/25.png' }
  ])

  return render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
})

describe('App routes and global controls', () => {
  it('submits the hero search through routing and exposes only matching cards', async () => {
    renderApp()
    expect(screen.getByRole('link', { name: /bulbasaur/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Search$/ }))
    expect(
      await screen.findByText('Enter a name or number to search.')
    ).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: 'Search Pokémon' }), {
      target: { value: '  pika  ' }
    })
    fireEvent.click(screen.getByRole('button', { name: /^Search$/ }))

    expect(
      await screen.findByRole('link', { name: /pikachu/i })
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.queryByRole('link', { name: /bulbasaur/i })
      ).not.toBeInTheDocument()
    })
    expect(
      screen.getByRole('searchbox', { name: 'Search the collection' })
    ).toHaveValue('pika')
  })

  it('recovers from an unknown route and switches theme from the header', async () => {
    renderApp('/unmapped-trail')
    expect(
      screen.getByRole('heading', { name: "This trail doesn't exist." })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    fireEvent.click(screen.getByRole('link', { name: 'Go home' }))

    expect(
      await screen.findByRole('heading', { name: /Your next favorite/ })
    ).toBeInTheDocument()
  })
})
