import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdaptersProvider } from './providers/AdaptersProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdaptersProvider>
      <App />
    </AdaptersProvider>
  </StrictMode>,
)
