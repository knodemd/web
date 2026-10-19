import Button from '@/components/Button'
import Icon from '@/components/Icon'
import type { IconName } from '@/brand/icons'

const GH = 'https://github.com/knodemd'

const principles: { icon: IconName; title: string; text: React.ReactNode }[] = [
  {
    icon: 'file',
    title: 'Yours',
    text: (
      <>
        Your thoughts live in <code className="font-mono text-[.9em]">.knode</code> files on your
        own devices. No lock-in, no “our data”.
      </>
    ),
  },
  {
    icon: 'link',
    title: 'Open',
    text: 'An open, documented file format and open-source code, from the very first commit.',
  },
  {
    icon: 'node',
    title: 'Native',
    text: "Built for Mac first, then iPhone and iPad, with each platform's own tools. Works offline.",
  },
  {
    icon: 'note',
    title: 'Markdown',
    text: 'Every node is Markdown. Your agents read it as it is, and any space can live as a folder of .md files too.',
  },
]

const repos = [
  { repo: 'knodemd/handbook', what: 'How the project works' },
  { repo: 'knodemd/brand', what: 'The brand kit' },
  { repo: 'knodemd/web', what: 'This website' },
]

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-[clamp(40px,8vw,96px)] pb-[clamp(140px,22vw,260px)]">
        <div className="relative z-10 mx-auto max-w-[1120px] px-6">
          <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
            Open source. In early development.
          </p>
          <h1 className="m-0 font-block text-[clamp(32px,10.2vw,116px)] leading-[1.06] font-normal uppercase text-balance">
            Connect your
            <br />
            thoughts.
            <br />
            <span className="highlight">Naturally.</span>
          </h1>
          <p className="mt-8 mb-0 max-w-[34em] text-[clamp(18px,2vw,21px)] text-muted">
            Knode turns your notes and your AI conversations into a map of knowledge that is yours,
            saved in an open <code className="font-mono text-[.9em] text-fg">.knode</code> file.
            Native, local first, open source.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={GH} primary>
              <Icon name="github" />
              Follow on GitHub
            </Button>
            <Button href="/handbook">
              <Icon name="note" />
              Read the handbook
            </Button>
          </div>
        </div>
        <img
          src="/assets/img/node-field.svg"
          alt=""
          width={1280}
          height={480}
          className="pointer-events-none absolute right-0 -bottom-0.5 left-0 h-[clamp(120px,20vw,260px)] w-full object-cover object-top opacity-(--field-opacity)"
        />
      </section>

      <section
        id="what"
        aria-labelledby="h-what"
        className="mx-auto max-w-[1120px] px-6 pt-[clamp(64px,9vw,112px)]"
      >
        <h2
          id="h-what"
          className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase"
        >
          What we're building
        </h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {principles.map((p) => (
            <li key={p.title} className="rounded-[18px] border border-line bg-panel p-7">
              <span className="text-accent">
                <Icon name={p.icon} className="size-7" />
              </span>
              <h3 className="mt-[22px] mb-2 font-block text-[26px] leading-none font-normal uppercase">
                {p.title}
              </h3>
              <p className="m-0 text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="public"
        aria-labelledby="h-public"
        className="mx-auto max-w-[1120px] px-6 pt-[clamp(64px,9vw,112px)]"
      >
        <h2
          id="h-public"
          className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase"
        >
          Built in public
        </h2>
        <p className="m-0 max-w-[24em] text-[clamp(24px,3.4vw,36px)] leading-[1.25] font-medium tracking-[-.01em] text-balance">
          Every decision, issue and line of code is on GitHub from day one. Come and watch, or help
          build it.
        </p>
        <ul className="mt-10 list-none border-t border-line p-0">
          {repos.map(({ repo, what }) => (
            <li key={repo}>
              <a
                href={`https://github.com/${repo}`}
                className="group flex flex-wrap justify-between gap-x-6 gap-y-2 border-b border-line py-5 no-underline"
              >
                <span className="inline-flex items-center gap-2.5 font-mono font-medium group-hover:text-indigo">
                  <span className="text-muted">
                    <Icon name="github" />
                  </span>
                  {repo}
                </span>
                <span className="text-muted">{what}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
