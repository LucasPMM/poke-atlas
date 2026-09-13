import { Route, Routes } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PokemonDetailsPage } from '@/pages/PokemonDetailsPage'

export const App = () => {
  return (
    <div className="app-shell min-h-screen bg-canvas text-ink">
      <Header />
      <main>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
