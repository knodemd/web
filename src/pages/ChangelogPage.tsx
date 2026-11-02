import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { releases } from '@/content/releases'

export default function ChangelogPage() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)]">
      <div className="hero">
        <p className="m-0 mb-6 font-line text-[15px] text-accent uppercase">Changelog</p>
        <h1 className="m-0 font-block text-[clamp(32px,8vw,80px)] leading-[1.06] font-normal uppercase">
          What changed.
        </h1>
        <p className="mt-8 max-w-[34em] text-[19px] text-muted">
          Release notes from Knode, newest first. The app, the command and your agents share the
          same version.
        </p>
      </div>
      {releases.length === 0 ? (
        <div className="mt-12 max-w-[44em] rounded-[18px] border border-line bg-panel p-7">
          <h2 className="m-0 font-line text-[16px] text-accent uppercase">
            The first release is ahead.
          </h2>
          <p className="mb-0 text-muted">
            Nothing has been released yet. Follow the{' '}
            <a className="link-text" href="/plan">
              roadmap
            </a>{' '}
            to see what is being built; published release notes will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-12 max-w-[44em]">
          {releases.map((release) => (
            <article key={release.tag} id={release.tag} className="border-t border-line py-10">
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="m-0 font-block text-[28px] font-normal uppercase">
                  <a href={release.url} className="link-text">
                    {release.name}
                  </a>
                </h2>
                {release.prerelease && (
                  <span className="font-line text-[12px] text-accent">PRE-RELEASE</span>
                )}
                <time dateTime={release.date} className="text-sm text-muted">
                  {new Date(release.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'UTC',
                  })}
                </time>
              </div>
              <div className="prose">
                {release.body ? (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Release screenshots may be hosted externally; never load them automatically.
                      img: ({ alt }) => <span>{alt}</span>,
                    }}
                  >
                    {release.body}
                  </Markdown>
                ) : (
                  <p>
                    <a href={release.url}>Read this release on GitHub.</a>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
