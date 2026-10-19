import Icon from './Icon'
import { Logo } from './Logo'
import type { IconName } from '@/brand/icons'

const GH = 'https://github.com/knodemd'

const columns: { title: string; links: { label: string; href: string; icon: IconName }[] }[] = [
  {
    title: 'Knode',
    links: [
      { label: "What we're building", href: '/#what', icon: 'node' },
      { label: 'Built in public', href: '/#public', icon: 'people' },
      { label: 'Developers', href: '/developers', icon: 'terminal' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: GH, icon: 'github' },
      { label: 'Handbook', href: `${GH}/handbook`, icon: 'note' },
      { label: 'Roadmap', href: `${GH}/handbook/blob/main/06-roadmap.md`, icon: 'map' },
      { label: 'Brand', href: '/brand', icon: 'knode' },
    ],
  },
  {
    title: 'Contribute',
    links: [
      { label: 'How to contribute', href: `${GH}/.github/blob/main/CONTRIBUTING.md`, icon: 'code' },
      { label: 'Open an issue', href: `${GH}/web/issues/new/choose`, icon: 'chat' },
      {
        label: 'Code of conduct',
        href: `${GH}/.github/blob/main/CODE_OF_CONDUCT.md`,
        icon: 'file',
      },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-[clamp(80px,12vw,140px)] border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-12 px-6 pt-14 pb-12 md:flex-row">
        <div className="flex flex-col items-start gap-4">
          <a href="/" aria-label="Knode, home" className="text-fg">
            <Logo className="h-5" />
          </a>
          <p className="m-0 max-w-[22em] text-[15px] leading-relaxed text-muted">
            Connect your thoughts. Naturally. A map of your knowledge, in an open file that is
            yours.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-14">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="m-0 mb-4 font-line text-[13px] leading-none text-accent uppercase">
                {col.title}
              </p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="link-nav inline-flex items-center gap-2 text-[15px]"
                    >
                      <Icon name={l.icon} />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-6 pb-[max(24px,env(safe-area-inset-bottom))] text-sm text-muted">
          <p className="m-0">
            © 2026 Knode, a project by{' '}
            <a href="https://aaangelmartin.com" className="link-sign">
              aaangelmartin
            </a>
          </p>
          <a href="/licenses" className="link-nav">
            Licenses
          </a>
          <a
            href="mailto:oss@knode.md"
            className="link-nav inline-flex items-center gap-2 font-mono text-[13px]"
          >
            <Icon name="mail" />
            oss@knode.md
          </a>
        </div>
      </div>
    </footer>
  )
}
