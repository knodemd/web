import Button from '@/components/Button'
import Icon from '@/components/Icon'
import type { IconName } from '@/brand/icons'

const GH = 'https://github.com/knodemd'

const pieces: { icon: IconName; title: string; state: string; text: string }[] = [
  {
    icon: 'file',
    title: 'The .knode format',
    state: 'In design',
    text: 'One open, documented file per map. Plain JSON you can read, diff and keep in git.',
  },
  {
    icon: 'code',
    title: 'Library',
    state: 'In design',
    text: 'Read and write .knode files from your own app, in Swift and TypeScript. Apache 2.0.',
  },
  {
    icon: 'terminal',
    title: 'CLI',
    state: 'After the format',
    text: 'One verb per action: import, search, link and export from the terminal.',
  },
  {
    icon: 'connect',
    title: 'MCP',
    state: 'After the CLI',
    text: 'Your map in Claude and other assistants, served from your own machine.',
  },
]

export default function DevelopersPage() {
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)]">
        <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          Developers
        </p>
        <h1 className="m-0 font-block text-[clamp(32px,8vw,92px)] leading-[1.06] font-normal uppercase text-balance">
          Your map,
          <br />
          <span className="highlight">programmable.</span>
        </h1>
        <p className="mt-8 mb-0 max-w-[34em] text-[clamp(18px,2vw,21px)] text-muted">
          Your knowledge lives in an open{' '}
          <code className="font-mono text-[.9em] text-fg">.knode</code> file. These are the tools to
          read and write it from your own apps, your terminal and your assistant. Nothing to install
          yet: it's being designed in public.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={GH} primary>
            <Icon name="github" />
            Follow on GitHub
          </Button>
          <Button href={'/handbook/roadmap'}>
            <Icon name="map" />
            Read the roadmap
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="h-coming"
        className="mx-auto max-w-[1120px] px-6 pt-[clamp(64px,9vw,112px)]"
      >
        <h2
          id="h-coming"
          className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase"
        >
          What's coming
        </h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {pieces.map((p) => (
            <li key={p.title} className="rounded-[18px] border border-line bg-panel p-7">
              <span className="text-accent">
                <Icon name={p.icon} className="size-7" />
              </span>
              <h3 className="mt-[22px] mb-1 font-block text-[22px] leading-none font-normal uppercase">
                {p.title}
              </h3>
              <p className="m-0 mb-3 font-mono text-[13px] text-accent">{p.state}</p>
              <p className="m-0 text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
