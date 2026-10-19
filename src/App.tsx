import Layout from '@/components/Layout'
import BrandPage from '@/pages/BrandPage'
import DevelopersPage from '@/pages/DevelopersPage'
import HomePage from '@/pages/HomePage'
import LicensesPage from '@/pages/LicensesPage'
import NotFoundPage from '@/pages/NotFoundPage'

export type Page = 'home' | 'brand' | 'developers' | 'licenses' | 'not-found'

const routes: Record<string, Page> = {
  '/': 'home',
  '/brand': 'brand',
  '/developers': 'developers',
  '/licenses': 'licenses',
}

export const pageForPath = (path: string): Page =>
  routes[path.replace(/(.)\/$/, '$1')] ?? 'not-found'

export default function App({ page }: { page: Page }) {
  return (
    <Layout>
      {page === 'home' ? (
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
