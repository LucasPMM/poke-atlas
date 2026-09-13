import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { HashRouter } from 'react-router'
import { I18nProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000
    }
  }
})

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <HashRouter>{children}</HashRouter>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
