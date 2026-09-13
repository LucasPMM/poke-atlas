import '@fontsource-variable/dm-sans'
import '@fontsource-variable/inter'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { Providers } from './app/providers'
import './styles/global.css'

const root = document.getElementById('root')

if (root === null) {
  throw new Error('Application root element is missing.')
}

createRoot(root).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
)
