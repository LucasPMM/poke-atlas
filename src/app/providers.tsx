import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { ReactNode } from 'react'
import { HashRouter } from 'react-router'
import { I18nProvider } from '@/lib/i18n'
import { pokemonPersistOptions, queryClient } from '@/lib/query/client'
import { ThemeProvider } from '@/lib/theme'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={pokemonPersistOptions}
        >
          <HashRouter>{children}</HashRouter>
        </PersistQueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
