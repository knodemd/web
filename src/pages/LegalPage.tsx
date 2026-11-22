import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Icon from '@/components/Icon'
import type { LegalDoc } from '@/content/legal'

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(32px,6vw,72px)]">
      <article className="min-w-0">
        <p className="m-0 mb-5 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          {doc.kicker}
        </p>
        <h1 className="m-0 mb-4 text-[clamp(30px,4.4vw,48px)] leading-[1.1] font-semibold tracking-[-.02em] text-balance">
          {doc.title}
        </h1>
        <p className="m-0 mb-8 font-mono text-[13px] text-muted">Last updated {doc.updated}</p>
        {!doc.reviewed && (
          <p
            role="note"
            className="m-0 mb-8 flex max-w-[44em] gap-2.5 rounded-[14px] border border-line bg-panel p-4 text-[15px] text-muted"
          >
            <span className="mt-[3px] text-accent">
              <Icon name="info" className="size-4" />
            </span>
            This page is a draft under review and may change before it takes effect.
          </p>
        )}
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{doc.body}</Markdown>
        </div>
      </article>
    </section>
  )
}
