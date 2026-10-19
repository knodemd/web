import Layout from '@/components/Layout'
import BrandPage from '@/pages/BrandPage'
import DevelopersPage from '@/pages/DevelopersPage'
import HandbookPage from '@/pages/HandbookPage'
import HomePage from '@/pages/HomePage'
import LicensesPage from '@/pages/LicensesPage'
import { handbookPages } from '@/content/handbook'
import NotFoundPage from '@/pages/NotFoundPage'

// A handbook page is 'handbook' plus its slug: 'handbook', 'handbook/roadmap', 'handbook/decisions/0003-licences'
export type Page = 'home' | 'brand' | 'developers' | 'licenses' | 'not-found' | `handbook${string}`

const routes: Record<string, Page> = {
  '/handbook': 'handbook',
  '/': 'home',
  '/brand': 'brand',
  '/developers': 'developers',
  '/licenses': 'licenses',
}

export const handbookRoutes: Page[] = handbookPages.map((p) =>
  p.slug ? (`handbook/${p.slug}` as Page) : 'handbook',
)

export function pageForPath(path: string): Page {
  const clean = path.replace(/(.)\/$/, '$1')
  const handbook = clean.replace(/^\//, '')
  if (handbookRoutes.includes(handbook as Page)) return handbook as Page
  return routes[clean] ?? 'not-found'
}

export default function App({ page }: { page: Page }) {
  return (
    <Layout>
      {page.startsWith('handbook') ? (
        <HandbookPage slug={page.replace(/^handbook\/?/, '')} />
      ) : page === 'home' ? (
        <HomePage />
      ) : page === 'brand' ? (
        <BrandPage />
      ) : page === 'developers' ? (
        <DevelopersPage />
      ) : page === 'licenses' ? (
        <LicensesPage />
      ) : (
        <NotFoundPage />
      )}
    </Layout>
  )
}
