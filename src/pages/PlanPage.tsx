import type { ReactNode } from 'react'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import type { IconName } from '@/brand/icons'

const GH = 'https://github.com/knodemd'
const PROJECT = 'https://github.com/orgs/knodemd/projects/1/'
const MAP = 'https://raw.githubusercontent.com/knodemd/.github/main/profile'

const pillars: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'connect',
    title: 'One memory for every agent',
    text: 'Claude Code, Codex, Gemini and Claude Desktop read and write the same memory through MCP.',
  },
  {
    icon: 'chat',
    title: 'Notes and conversations',
    text: 'Your notes and everything that comes out of each conversation, connected as nodes and links.',
  },
  {
    icon: 'private',
    title: 'Spaces with permissions',
    text: 'Work and personal apart. Each agent only sees what you let it.',
  },
  {
    icon: 'file',
    title: 'Local and open',
    text: 'Your files, on your Mac, in an open format. No AI inside the app: the agent is the AI.',
  },
]

const sources: { icon: IconName; title: string; where: string }[] = [
  { icon: 'terminal', title: 'Claude Code', where: '~/.claude/projects' },
  { icon: 'terminal', title: 'Codex', where: '~/.codex/sessions' },
  { icon: 'terminal', title: 'Gemini, Cursor, Copilot…', where: 'their own folders' },
  { icon: 'connect', title: 'Any agent', where: 'through MCP' },
  { icon: 'import', title: 'Chat exports', where: 'Claude, ChatGPT, Gemini' },
  { icon: 'note', title: 'Notes', where: 'Obsidian, Apple Notes, Bear, Notion' },
]

const versions: { v: string; title: string; text: string; now?: boolean }[] = [
  {
    v: 'v0.1',
    title: 'You use it',
    text: 'The format, the core, Knode Service, MCP, capture from Claude Code and Codex, a first Mac app.',
    now: true,
  },
  {
    v: 'v0.2',
    title: 'Spaces',
    text: 'Several spaces, permissions per agent, every agent, Markdown in and out.',
  },
  {
    v: 'v0.3',
    title: 'Map',
    text: 'Graph and canvas, importers, semantic search, editing together.',
  },
  {
    v: 'v0.4',
    title: 'Sync and iPhone',
    text: 'iCloud and Knode Cloud, end-to-end encrypted. The iPhone and iPad app.',
  },
  { v: 'v0.5', title: 'Collaboration', text: 'Links, shared and team spaces, the web app.' },
  { v: 'v1.0', title: 'Launch', text: 'Everything polished, the format 1.0 published.' },
]

const Label = ({ children }: { children: ReactNode }) => (
  <h2 className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase">
    {children}
  </h2>
)
const section = 'mx-auto max-w-[1120px] px-6 pt-[clamp(64px,9vw,112px)]'
const card = 'rounded-[18px] border border-line bg-panel p-6'

export default function PlanPage() {
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)]">
        <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          The plan
        </p>
        <h1 className="m-0 font-block text-[clamp(32px,8vw,92px)] leading-[1.06] font-normal uppercase text-balance">
          Your second brain
          <br />
          <span className="highlight">for AI.</span>
        </h1>
        <p className="mt-8 mb-0 max-w-[34em] text-[clamp(18px,2vw,21px)] text-muted">
          A local memory that is yours, that every AI agent you use can read and add to, and that
          you see and organise in a native app. This is how we are building it, in public.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={PROJECT} primary>
            <Icon name="map" />
            Follow the roadmap
          </Button>
          <Button href="/handbook">
            <Icon name="note" />
            Read the handbook
          </Button>
        </div>
      </section>

      <section className={section} aria-labelledby="h-what">
        <Label>
          <span id="h-what">What it is</span>
        </Label>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {pillars.map((p) => (
            <li key={p.title} className={card}>
              <span className="text-accent">
                <Icon name={p.icon} className="size-7" />
              </span>
              <h3 className="mt-5 mb-2 font-block text-[19px] leading-[1.15] font-normal uppercase">
                {p.title}
              </h3>
              <p className="m-0 text-[15px] text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="h-how">
        <Label>
          <span id="h-how">How it works</span>
        </Label>
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)_auto_minmax(0,1fr)]">
          <div className="grid gap-2">
            {['Claude Code', 'Codex', 'Gemini, Cursor…', 'Claude Desktop'].map((a) => (
              <div
                key={a}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-4 py-3 text-[15px]"
              >
                <span className="text-accent">
                  <Icon name="terminal" />
                </span>
                {a}
              </div>
            ))}
          </div>
          <span className="justify-self-center font-line text-[12px] text-accent uppercase">
            MCP
          </span>
          <div className="grid gap-3 rounded-[18px] border border-indigo bg-panel p-6">
            <span className="text-accent">
              <Icon name="knode" className="size-7" />
            </span>
            <b className="font-block text-[19px] font-normal uppercase">Knode Service</b>
            <p className="m-0 text-[15px] text-muted">
              In the menu bar. A Rust core, the only process that opens your spaces, and the one
              that enforces permissions. The Mac app talks to it too.
            </p>
          </div>
          <span className="justify-self-center font-line text-[12px] text-accent uppercase">
            Opens
          </span>
          <div className="grid gap-2">
            {['work.knode', 'personal.knode', 'knode.knode'].map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3 font-mono text-[14px]"
              >
                <img src="/assets/brand/knode-document.svg" alt="" className="h-5 w-auto" />
                {s}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 mb-0 flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="text-accent">
              <Icon name="cloud" />
            </span>
            Sync through iCloud or Knode Cloud, end-to-end encrypted
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-accent">
              <Icon name="node" />
            </span>
            The same core in the iPhone and web apps
          </span>
        </p>
      </section>

      <section className={section} aria-labelledby="h-file">
        <Label>
          <span id="h-file">The .knode file</span>
        </Label>
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="flex min-w-0 items-start gap-6">
            <img
              src="/assets/brand/knode-document.svg"
              alt=""
              className="hidden h-24 w-auto shrink-0 sm:block"
            />
            <pre className="m-0 min-w-0 flex-1 overflow-x-auto rounded-[18px] border border-line bg-panel p-5 font-mono text-[13.5px] leading-relaxed">{`work.knode/
├── manifest.json   version, id, name
├── knode.db        SQLite: nodes, links,
│                   provenance, history,
│                   permissions, search
├── blobs/          attachments by hash
└── sync/           Loro changes`}</pre>
          </div>
          <ul className="m-0 grid list-none gap-4 p-0 text-[15px] text-muted">
            <li className="flex gap-3">
              <span className="mt-1 text-accent">
                <Icon name="file" />
              </span>
              <span>
                <b className="font-semibold text-fg">A package,</b> like a Music library: one file
                in the Finder, a folder inside.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-accent">
                <Icon name="search" />
              </span>
              <span>
                <b className="font-semibold text-fg">Search three ways,</b> locally: by words, by
                meaning, and both at once for agents.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-accent">
                <Icon name="history" />
              </span>
              <span>
                <b className="font-semibold text-fg">Everyone at once:</b> you, Claude and Codex
                write together, and nothing is lost.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-accent">
                <Icon name="import" />
              </span>
              <span>
                <b className="font-semibold text-fg">Markdown in and out,</b> for Obsidian, git and
                anything else.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className={section} aria-labelledby="h-capture">
        <Label>
          <span id="h-capture">Capture</span>
        </Label>
        <p className="m-0 mb-6 max-w-[44em] text-[17px] text-muted">
          Every conversation is kept on its own. Turn it off per project, and choose which folders
          feed each space.
        </p>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-3 p-0">
          {sources.map((s) => (
            <li
              key={s.title}
              className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3"
            >
              <span className="text-accent">
                <Icon name={s.icon} />
              </span>
              <span className="grid">
                <b className="text-[15px] font-semibold">{s.title}</b>
                <small className="font-mono text-[12px] text-muted">{s.where}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={section} aria-labelledby="h-repos">
        <Label>
          <span id="h-repos">Repositories</span>
        </Label>
        {/* The SVG carries its own title for GitHub: crop it, the section label already names it */}
        <a href={GH} className="block overflow-hidden">
          <picture>
            <source media="(prefers-color-scheme: dark)" srcSet={`${MAP}/map-dark.svg`} />
            <img
              src={`${MAP}/map-light.svg`}
              alt="The Knode repositories and how they depend on each other"
              className="mt-[-6.83%] w-full"
            />
          </picture>
        </a>
      </section>

      <section className={section} aria-labelledby="h-roadmap">
        <Label>
          <span id="h-roadmap">Roadmap</span>
        </Label>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-3 p-0">
          {versions.map((v) => (
            <li
              key={v.v}
              className={`grid content-start gap-2 rounded-[14px] border bg-panel p-5 ${v.now ? 'border-indigo' : 'border-line'}`}
            >
              <span className="font-block text-[22px] leading-none text-accent">{v.v}</span>
              <b className="font-semibold">{v.title}</b>
              <p className="m-0 text-[14px] text-muted">{v.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 mb-0 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted">
          <a href={PROJECT} className="link-text">
            Every issue, by version
          </a>
          <a href="/handbook/roadmap" className="link-text">
            What each version contains
          </a>
          <a href="/handbook/decisions/0005-architecture" className="link-text">
            Why it is built this way
          </a>
        </p>
      </section>
    </>
  )
}
