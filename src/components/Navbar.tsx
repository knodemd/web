import { useEffect, useState } from 'react'
import Icon from './Icon'
import { Logo } from './Logo'

export default function Navbar() {
  // the bar gets a border once the page has scrolled under it
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-bg/85 backdrop-blur-md transition-colors ${
        scrolled ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between gap-4 px-6">
        <a href="/" aria-label="Knode, home" className="text-fg">
          <Logo className="h-[22px] sm:h-[26px]" />
        </a>
        <nav aria-label="Main" className="flex items-center gap-4 min-[480px]:gap-5 sm:gap-7">
          <a
            href="/developers"
            className="hidden items-center gap-2 link-nav text-[15px] font-medium sm:inline-flex"
          >
            <Icon name="terminal" />
            Developers
          </a>
          <a
            href="/install"
            className="hidden items-center gap-2 link-nav text-[15px] font-medium md:inline-flex"
          >
            <Icon name="import" />
            Install
          </a>
          <a
            href="/docs"
            className="inline-flex items-center gap-2 link-nav text-[15px] font-medium"
            aria-label="Docs"
          >
            <Icon name="info" />
            <span className="hidden min-[480px]:inline">Docs</span>
          </a>
          <a
            href="/handbook"
            className="inline-flex items-center gap-2 link-nav text-[15px] font-medium"
            aria-label="Handbook"
          >
            <Icon name="note" />
            <span className="hidden min-[480px]:inline">Handbook</span>
          </a>
          <a
            href="https://github.com/knodemd"
            className="inline-flex items-center gap-2 link-nav text-[15px] font-medium"
            aria-label="GitHub"
          >
            <Icon name="github" />
            <span className="hidden min-[480px]:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
