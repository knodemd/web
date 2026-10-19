import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Icon from '@/components/Icon'
import { handbookPage, handbookPages, handbookRepo } from '@/content/handbook'

const chapters = handbookPages.filter((p) => p.kind === 'chapter')
const decisions = handbookPages.filter((p) => p.kind === 'decision' && p.number)

function Nav({ current }: { current: string }) {
  const item = (slug: string, label: string, number?: string | null) => (
    <li key={slug}>
      <a
        href={`/handbook${slug ? `/${slug}` : ''}`}
        aria-current={slug === current ? 'page' : undefined}
        className={`flex gap-2.5 rounded-lg px-3 py-1.5 text-[15px] no-underline ${
          slug === current ? 'bg-panel text-fg' : 'link-nav'
        }`}
      >
        {number && (
          <span className="w-9 shrink-0 font-mono text-[13px] leading-6 text-muted">{number}</span>
        )}
        <span>{label}</span>
      </a>
    </li>
  )
  return (
    <nav aria-label="Handbook" className="grid gap-6 text-sm">
      <ul className="m-0 grid list-none gap-0.5 p-0">{item('', 'Introduction')}</ul>
      <div>
        <p className="m-0 mb-2 px-3 font-line text-[13px] text-muted uppercase">Chapters</p>
        <ul className="m-0 grid list-none gap-0.5 p-0">
          {chapters.map((p) => item(p.slug, p.title, p.number))}
        </ul>
      </div>
      <div>
        <p className="m-0 mb-2 px-3 font-line text-[13px] text-muted uppercase">Decisions</p>
        <ul className="m-0 grid list-none gap-0.5 p-0">
          {item('decisions', 'All decisions')}
          {decisions.map((p) => item(p.slug, p.title, p.number))}
        </ul>
      </div>
    </nav>
  )
}

export default function HandbookPage({ slug }: { slug: string }) {
  const page = handbookPage(slug) ?? handbookPage('')!
  const kicker =
    page.kind === 'chapter'
      ? `Chapter ${page.number}`
      : page.number
        ? `Decision ${page.number}`
        : 'Handbook'
  return (
    <section className="mx-auto grid max-w-[1120px] gap-10 px-6 pt-[clamp(32px,6vw,72px)] md:grid-cols-[240px_minmax(0,1fr)] md:gap-14">
      <aside className="md:sticky md:top-24 md:self-start">
        <details className="md:hidden" open={false}>
          <summary className="cursor-pointer font-line text-[13px] text-muted uppercase">
            Contents
          </summary>
          <div className="mt-4">
            <Nav current={page.slug} />
          </div>
        </details>
        <div className="hidden md:block">
          <Nav current={page.slug} />
        </div>
      </aside>
      <article className="min-w-0">
        <p className="m-0 mb-5 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          {kicker}
        </p>
        <h1 className="m-0 mb-8 text-[clamp(30px,4.4vw,48px)] leading-[1.1] font-semibold tracking-[-.02em] text-balance">
          {page.title}
        </h1>
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{page.body}</Markdown>
        </div>
        <p className="mt-14 mb-0 border-t border-line pt-6">
          <a
            href={`${handbookRepo}/blob/main/${page.file}`}
            className="link-nav inline-flex items-center gap-2 text-[15px]"
          >
            <Icon name="github" />
            Edit on GitHub
          </a>
        </p>
      </article>
    </section>
  )
}
