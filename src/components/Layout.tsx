import { useEffect, type ReactNode } from 'react'
import { reveal } from '@/motion'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(reveal, [])

  return (
    <>
      <a
        href="#main"
        className="absolute top-2 -left-[999px] z-[60] rounded-lg bg-accent px-3 py-2 text-on-accent focus:left-2"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
