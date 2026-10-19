import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App, { pageForPath, type Page } from '@/App'
import '@/index.css'

// Each page is prerendered at build time (see scripts/prerender.mjs) and says
// which one it is; in development the root is empty and the path decides.
const root = document.getElementById('root')!
const page = (root.dataset.page as Page | undefined) ?? pageForPath(location.pathname)
const app = (
  <StrictMode>
    <App page={page} />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
