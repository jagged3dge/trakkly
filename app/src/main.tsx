import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AdaptersProvider } from './providers/AdaptersProvider'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdaptersProvider>
      <RouterProvider router={router} />
    </AdaptersProvider>
  </StrictMode>,
)
