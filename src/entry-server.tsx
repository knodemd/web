import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App, { type Page } from '@/App'

export function render(page: Page) {
  return renderToString(
    <StrictMode>
      <App page={page} />
    </StrictMode>,
  )
}
