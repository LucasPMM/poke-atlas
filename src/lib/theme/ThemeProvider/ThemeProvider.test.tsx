import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeProvider'

const ThemeProbe = () => {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme('light')} type="button">
      {theme}
    </button>
  )
}

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('theme preference', () => {
  it('starts with the browser color scheme and persists a user choice', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )

    expect(screen.getByRole('button').textContent).toBe('dark')
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').textContent).toBe('light')
    expect(window.localStorage.getItem('poke-atlas-theme')).toBe('light')
  })

  it('prefers a saved choice over the browser color scheme', () => {
    window.localStorage.setItem('poke-atlas-theme', 'light')
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )
    expect(screen.getByRole('button').textContent).toBe('light')
  })
})
