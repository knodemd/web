import Layout from '@/components/Layout'
import ChangelogPage from '@/pages/ChangelogPage'
import BrandPage from '@/pages/BrandPage'
import DevelopersPage from '@/pages/DevelopersPage'
import DocsPage from '@/pages/DocsPage'
import HandbookPage from '@/pages/HandbookPage'
import HomePage from '@/pages/HomePage'
import InstallPage from '@/pages/InstallPage'
import LegalPage from '@/pages/LegalPage'
import LicensesPage from '@/pages/LicensesPage'
import PlanPage from '@/pages/PlanPage'
import { docsPages } from '@/content/docs'
import { privacy, terms } from '@/content/legal'
import { handbookPages } from '@/content/handbook'
import NotFoundPage from '@/pages/NotFoundPage'

// A handbook page is 'handbook' plus its slug: 'handbook', 'handbook/roadmap', 'handbook/decisions/0003-licences'.
// A docs page is 'docs' plus its slug: 'docs', 'docs/install'.
export type Page =
  | 'home'
  | 'changelog'
  | 'brand'
  | 'developers'
  | 'install'
  | 'licenses'
  | 'privacy'
  | 'terms'
  | 'plan'
  | 'not-found'
  | `handbook${string}`
  | `docs${string}`

const routes: Record<string, Page> = {
  '/handbook': 'handbook',
  '/docs': 'docs',
  '/': 'home',
  '/changelog': 'changelog',
  '/brand': 'brand',
  '/developers': 'developers',
  '/install': 'install',
  '/licenses': 'licenses',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/plan': 'plan',
}

export const handbookRoutes: Page[] = handbookPages.map((p) =>
  p.slug ? (`handbook/${p.slug}` as Page) : 'handbook',
)

export const docsRoutes: Page[] = docsPages.map((p) =>
  p.slug ? (`docs/${p.slug}` as Page) : 'docs',
)

export function pageForPath(path: string): Page {
  const clean = path.replace(/(.)\/$/, '$1')
  const handbook = clean.replace(/^\//, '')
  if (handbookRoutes.includes(handbook as Page)) return handbook as Page
  if (docsRoutes.includes(handbook as Page)) return handbook as Page
  return routes[clean] ?? 'not-found'
}

export default function App({ page }: { page: Page }) {
  return (
    <Layout>
      {page.startsWith('handbook') ? (
        <HandbookPage slug={page.replace(/^handbook\/?/, '')} />
      ) : page.startsWith('docs') ? (
        <DocsPage slug={page.replace(/^docs\/?/, '')} />
      ) : page === 'home' ? (
        <HomePage />
      ) : page === 'changelog' ? (
        <ChangelogPage />
      ) : page === 'brand' ? (
        <BrandPage />
      ) : page === 'developers' ? (
        <DevelopersPage />
      ) : page === 'install' ? (
        <InstallPage />
      ) : page === 'plan' ? (
        <PlanPage />
      ) : page === 'licenses' ? (
        <LicensesPage />
      ) : page === 'privacy' ? (
        <LegalPage doc={privacy} />
      ) : page === 'terms' ? (
        <LegalPage doc={terms} />
      ) : (
        <NotFoundPage />
      )}
    </Layout>
  )
}
