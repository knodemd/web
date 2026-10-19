import { useEffect, useRef, useState, type ReactNode } from 'react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import type { IconName } from '@/brand/icons'

const GH = 'https://github.com/knodemd'
const PROJECT = 'https://github.com/orgs/knodemd/projects/1/'

const later: { icon: IconName; title: string; where: ReactNode; when: string }[] = [
  {
    icon: 'node',
    title: 'iPhone and iPad',
    where: 'From the App Store.',
    when: 'v0.4',
  },
  {
    icon: 'web',
    title: 'Web app',
    where: (
      <>
        At <span className="font-mono text-[.92em] text-fg">app.knode.md</span>.
      </>
    ),
    when: 'v0.5',
  },
  {
    icon: 'code',
    title: 'Rust crates',
    where: (
      <>
        <span className="font-mono text-[.92em] text-fg">knode-format</span> and{' '}
        <span className="font-mono text-[.92em] text-fg">knode-md</span> on crates.io.
      </>
    ),
    when: 'With the releases',
  },
  {
    icon: 'file',
    title: 'Swift package',
    where: (
      <>
        Add{' '}
        <span className="font-mono text-[.92em] [overflow-wrap:anywhere] text-fg">{`${GH}/knode`}</span>{' '}
        in Xcode.
      </>
    ),
    when: 'With the releases',
  },
]

const Label = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2
    id={id}
    className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase"
  >
    {children}
  </h2>
)
const section = 'mx-auto max-w-[1120px] px-6 pt-[clamp(64px,9vw,112px)]'
const card = 'rounded-[18px] border border-line bg-panel'

// A command with a copy button. The clipboard API needs a secure context; when it is missing or
// refused, the command is selected so it can be copied by hand.
function Code({ children }: { children: string }) {
  const pre = useRef<HTMLPreElement>(null)
  const [state, setState] = useState<'idle' | 'copied' | 'selected'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(t)
  }, [state])

  function select() {
    const el = pre.current
    const sel = window.getSelection()
    if (!el || !sel) return
    const range = document.createRange()
    range.selectNodeContents(el)
    sel.removeAllRanges()
    sel.addRange(range)
    setState('selected')
  }

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard')
      await navigator.clipboard.writeText(children)
      setState('copied')
    } catch {
      select()
    }
  }

  return (
    <div className="flex min-w-0 items-start gap-2 rounded-xl border border-line bg-bg py-2 pr-2 pl-4">
      <pre
        ref={pre}
        className="m-0 min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-[14px] leading-relaxed"
      >
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${children}`}
        className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel px-2.5 text-[13px] sm:px-3 font-medium text-muted transition hover:border-muted hover:text-fg"
      >
        <Icon name={state === 'copied' ? 'done' : 'note'} />
        <span aria-live="polite" className="sr-only sm:not-sr-only">
          {state === 'copied' ? 'Copied' : state === 'selected' ? 'Selected' : 'Copy'}
        </span>
      </button>
    </div>
  )
}

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-3">
      <p className="m-0 text-[15px] text-muted">{title}</p>
      {children}
    </div>
  )
}

function Card({
  icon,
  title,
  badge,
  children,
}: {
  icon: IconName
  title: string
  badge?: string
  children: ReactNode
}) {
  return (
    <div className={`${card} grid content-start gap-6 p-6 sm:p-7`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="text-accent">
          <Icon name={icon} className="size-7" />
        </span>
        <h3 className="m-0 font-block text-[22px] leading-none font-normal uppercase">{title}</h3>
        {badge && (
          <span className="rounded-full border border-line px-2.5 py-1 font-line text-[12px] leading-none text-muted uppercase">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export default function InstallPage() {
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)]">
        <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          Install
        </p>
        <h1 className="m-0 font-block text-[clamp(32px,8vw,92px)] leading-[1.06] font-normal uppercase text-balance">
          One command.
          <br />
          <span className="highlight">Every agent.</span>
        </h1>
        <p className="mt-8 mb-0 max-w-[34em] text-[clamp(18px,2vw,21px)] text-muted">
          Knode comes as one command, <code className="font-mono text-[.9em] text-fg">knode</code>,
          and as a Mac app. The command is enough to give every agent a shared memory; the app lets
          you see and organise it.
        </p>

        <div
          role="status"
          className="mt-10 grid gap-5 rounded-[18px] border border-indigo bg-panel p-6 sm:p-7 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-7"
        >
          <span className="text-accent">
            <Icon name="info" className="size-7" />
          </span>
          <div>
            <p className="m-0 font-block text-[19px] leading-[1.15] uppercase">Not released yet</p>
            <p className="mt-2 mb-0 text-[15px] text-muted">
              Knode is in development and nothing on this page installs yet. The commands below work
              from v0.1, which is coming next. Follow along to know when it lands.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={PROJECT} primary>
              <Icon name="map" />
              Follow the roadmap
            </Button>
            <Button href="/plan">
              <Icon name="node" />
              The plan
            </Button>
          </div>
        </div>
      </section>

      <section className={section} aria-labelledby="h-get">
        <Label id="h-get">Get Knode</Label>
        <div className="grid gap-4 md:grid-cols-2">
          <Card icon="terminal" title="Command line">
            <p className="m-0 text-[15px] text-muted">
              The CLI, the MCP server for your agents and Knode Service, the process that keeps your
              spaces open. All in one binary.
            </p>
            <Step title="On macOS, with Homebrew:">
              <Code>brew install knodemd/tap/knode</Code>
            </Step>
            <Step title="Check it works:">
              <Code>knode --version</Code>
            </Step>
            <p className="m-0 flex gap-3 text-[15px] text-muted">
              <span className="mt-1 text-accent">
                <Icon name="history" />
              </span>
              <span>
                <b className="font-semibold text-fg">Linux from v0.2,</b> with the same Homebrew
                command or with{' '}
                <code className="font-mono text-[.9em] [overflow-wrap:anywhere] text-fg">
                  curl -fsSL https://knode.md/install.sh | sh
                </code>
                .
              </span>
            </p>
          </Card>

          <Card icon="knode" title="Mac app">
            <p className="m-0 text-[15px] text-muted">
              See and organise your memory. The app carries the{' '}
              <code className="font-mono text-[.9em] text-fg">knode</code> command inside and offers
              to install it; if you already have it from Homebrew, it uses that one.
            </p>
            <Step title="With Homebrew:">
              <Code>brew install --cask knodemd/tap/knode</Code>
            </Step>
            <Step title="Or download it:">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex min-h-12 cursor-not-allowed items-center gap-2.5 rounded-xl border border-dashed border-line px-[22px] text-base leading-none font-semibold text-muted opacity-70 [&_svg]:size-[18px]"
                >
                  <Icon name="import" />
                  Download for Mac
                </button>
                <span className="font-line text-[13px] leading-none text-accent uppercase">
                  Coming with v0.1
                </span>
              </div>
            </Step>
          </Card>
        </div>
      </section>

      <section className={section} aria-labelledby="h-connect">
        <Label id="h-connect">Connect your agents</Label>
        <div className={`${card} grid gap-8 p-6 sm:p-7 md:grid-cols-2`}>
          <Step title="One command per agent:">
            <Code>knode connect claude-code</Code>
            <Code>knode connect codex</Code>
            <Code>knode connect gemini</Code>
            <Code>knode connect claude-desktop</Code>
          </Step>
          <Step title="Or add the MCP server by hand, for example in Claude Code:">
            <Code>claude mcp add knode -- knode mcp</Code>
            <p className="m-0 text-[15px] text-muted">
              Any agent that speaks MCP can run{' '}
              <code className="font-mono text-[.9em] text-fg">knode mcp</code> the same way.
            </p>
          </Step>
        </div>
      </section>

      <section className={section} aria-labelledby="h-later">
        <Label id="h-later">Later</Label>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {later.map((l) => (
            <li key={l.title} className={`${card} p-6`}>
              <span className="text-accent">
                <Icon name={l.icon} className="size-7" />
              </span>
              <h3 className="mt-5 mb-1 font-block text-[19px] leading-[1.15] font-normal uppercase">
                {l.title}
              </h3>
              <p className="m-0 mb-3 font-mono text-[13px] text-accent">{l.when}</p>
              <p className="m-0 text-[15px] text-muted">{l.where}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="h-more">
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`${card} p-6 sm:p-7`}>
            <Label id="h-more">Requirements</Label>
            <ul className="m-0 grid list-none gap-4 p-0 text-[15px] text-muted">
              <li className="flex gap-3">
                <span className="mt-1 text-accent">
                  <Icon name="knode" />
                </span>
                <span>
                  <b className="font-semibold text-fg">macOS 26 or later,</b> on Apple silicon or
                  Intel.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-accent">
                  <Icon name="terminal" />
                </span>
                <span>
                  <b className="font-semibold text-fg">Linux on x86_64 or arm64,</b> from v0.2.
                </span>
              </li>
            </ul>
          </div>
          <div className={`${card} grid content-start p-6 sm:p-7`}>
            <h2 className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase">
              Uninstall
            </h2>
            <div className="grid gap-3">
              <Code>brew uninstall knode</Code>
              <Code>brew uninstall --cask knode</Code>
            </div>
            <p className="mt-4 mb-0 text-[15px] text-muted">
              Your spaces are <code className="font-mono text-[.9em] text-fg">.knode</code> files
              and stay where you saved them.
            </p>
          </div>
        </div>
        <p className="mt-8 mb-0 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted">
          <a href="/docs/install" className="link-text inline-flex items-center gap-2">
            <Icon name="info" />
            Every detail in the docs
          </a>
          <a
            href="/handbook/decisions/0007-distribution"
            className="link-text inline-flex items-center gap-2"
          >
            <Icon name="file" />
            Why it is installed this way
          </a>
          <a href={`${GH}/knode`} className="link-text inline-flex items-center gap-2">
            <Icon name="github" />
            The source
          </a>
        </p>
      </section>
    </>
  )
}
