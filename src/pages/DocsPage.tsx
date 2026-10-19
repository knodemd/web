import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Icon from '@/components/Icon'
import { docsPage, docsPages, docsRepo } from '@/content/docs'

function Nav({ current }: { current: string }) {
  return (
    <nav aria-label="Docs" className="text-sm">
      <ul className="m-0 grid list-none gap-0.5 p-0">
        {docsPages.map((p) => (
          <li key={p.slug}>
            <a
              href={`/docs${p.slug ? `/${p.slug}` : ''}`}
              aria-current={p.slug === current ? 'page' : undefined}
              className={`flex gap-2.5 rounded-lg px-3 py-1.5 text-[15px] no-underline ${
                p.slug === current ? 'bg-panel text-fg' : 'link-nav'
              }`}
            >
              {p.number && (
                <span className="w-6 shrink-0 font-mono text-[13px] leading-6 text-muted">
                  {p.number}
                </span>
              )}
              <span>{p.slug ? p.title : 'Introduction'}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function DocsPage({ slug }: { slug: string }) {
  const page = docsPage(slug) ?? docsPage('')!
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
          Docs
        </p>
        <h1 className="m-0 mb-8 text-[clamp(30px,4.4vw,48px)] leading-[1.1] font-semibold tracking-[-.02em] text-balance">
          {page.title}
        </h1>
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{page.body}</Markdown>
        </div>
        <p className="mt-14 mb-0 border-t border-line pt-6">
          <a
            href={`${docsRepo}/blob/main/${page.file}`}
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
