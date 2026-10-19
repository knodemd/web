import { asciiLogotype, iconCategories } from '@/brand/kit'
import Button from '@/components/Button'
import Icon from '@/components/Icon'

const KIT = 'https://github.com/knodemd/brand'
const ZIP = `${KIT}/archive/refs/heads/main.zip`
const GUIDE = `${KIT}/blob/main/01%20Brand%20Guidelines/Knode%20Brand%20Guidelines.pdf`

const inks = [
  {
    name: 'Ink',
    hex: '#0B0B14',
    rgb: '11 11 20',
    use: 'Backgrounds and text',
    swatch: 'bg-ink text-paper',
  },
  {
    name: 'Paper',
    hex: '#F3F2EE',
    rgb: '243 242 238',
    use: 'Backgrounds and text',
    swatch: 'bg-paper text-ink',
  },
  {
    name: 'Indigo',
    hex: '#818CF8',
    rgb: '129 140 248',
    use: 'The mark and accents, never text on paper',
    swatch: 'bg-indigo text-ink',
  },
]

const logos = [
  { name: 'Horizontal', file: 'knode-horizontal', folder: 'Horizontal', size: 'h-9' },
  { name: 'Symbol', file: 'knode-symbol', folder: 'Symbol', size: 'h-14' },
  { name: 'Stacked', file: 'knode-stacked', folder: 'Stacked', size: 'h-20' },
]

const type = [
  {
    name: 'Knode Block',
    use: 'Headlines and the brand. Uppercase.',
    sample: 'Connect your thoughts',
    cls: 'font-block text-[clamp(28px,4vw,44px)] uppercase leading-none',
  },
  {
    name: 'Knode Line',
    use: 'Labels and short interface text. Uppercase.',
    sample: 'What we are building',
    cls: 'font-line text-[clamp(20px,2.6vw,28px)] uppercase leading-none',
  },
  {
    name: 'Geist',
    use: 'Everything that is read.',
    sample: 'A map of your knowledge, in an open file that is yours.',
    cls: 'text-[clamp(20px,2.4vw,26px)] leading-snug',
  },
  {
    name: 'Geist Mono',
    use: 'Code, file names, data and the terminal.',
    sample: 'knode import ~/notes.md',
    cls: 'font-mono text-[clamp(18px,2.2vw,24px)] leading-snug',
  },
]

const H2 = ({ id, children }: { id: string; children: string }) => (
  <h2
    id={id}
    className="m-0 mb-8 font-line text-[15px] leading-none font-normal text-muted uppercase"
  >
    {children}
  </h2>
)

const section = 'mx-auto max-w-[1120px] px-6 pt-[clamp(64px,9vw,112px)]'

export default function BrandPage() {
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)]">
        <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          Brand
        </p>
        <h1 className="m-0 font-block text-[clamp(32px,8vw,92px)] leading-[1.06] font-normal uppercase text-balance">
          One rule.
          <br />
          <span className="highlight">Every shape.</span>
        </h1>
        <p className="mt-8 mb-0 max-w-[34em] text-[clamp(18px,2vw,21px)] text-muted">
          Everything in Knode is drawn with square cells, and every corner, convex or concave, is
          rounded by half a cell. Logos, letters and icons all follow it.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={ZIP} primary>
            <Icon name="file" />
            Download the brand kit
          </Button>
          <Button href={GUIDE}>
            <Icon name="note" />
            Brand guidelines
          </Button>
        </div>
      </section>

      <section aria-labelledby="h-logo" className={section}>
        <H2 id="h-logo">Logo</H2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 p-0">
          {logos.map((l) => (
            <li key={l.name} className="overflow-hidden rounded-[18px] border border-line">
              <div className="grid h-48 place-items-center bg-ink">
                <img
                  src={`/assets/brand/${l.file}-primary.svg`}
                  alt={`Knode ${l.name.toLowerCase()} logo`}
                  className={`${l.size} w-auto`}
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-line bg-panel px-5 py-4">
                <span className="font-medium">{l.name}</span>
                <a
                  href={`${KIT}/tree/main/02%20Logo/${l.folder}`}
                  className="link-nav font-mono text-sm"
                >
                  SVG, PNG, PDF
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 mb-0 max-w-[44em] text-[15px] text-muted">
          Leave the width of the slot as clear space around the logo. Smallest sizes: the symbol at
          16 px, the horizontal logo at 88 px wide. Never redraw, recolour outside the three inks,
          or stretch it.
        </p>
      </section>

      <section aria-labelledby="h-colour" className={section}>
        <H2 id="h-colour">Colour</H2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 p-0">
          {inks.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-[18px] border border-line">
              <div className={`flex h-40 items-end p-5 font-block text-2xl uppercase ${c.swatch}`}>
                {c.name}
              </div>
              <div className="grid gap-1 bg-panel px-5 py-4">
                <span className="font-mono text-[15px] font-medium select-all">{c.hex}</span>
                <span className="font-mono text-[13px] text-muted">RGB {c.rgb}</span>
                <span className="text-[14px] text-muted">{c.use}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 mb-0 text-[15px] text-muted">
          Three inks, used about 60, 30 and 10. No gradients.
        </p>
      </section>

      <section aria-labelledby="h-type" className={section}>
        <H2 id="h-type">Type</H2>
        <ul className="m-0 list-none border-t border-line p-0">
          {type.map((t) => (
            <li
              key={t.name}
              className="grid gap-x-8 gap-y-3 border-b border-line py-7 md:grid-cols-[14rem_minmax(0,1fr)]"
            >
              <div className="grid content-start gap-1">
                <span className="font-medium">{t.name}</span>
                <span className="text-[14px] text-muted">{t.use}</span>
              </div>
              <p className={`m-0 min-w-0 ${t.cls}`}>{t.sample}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 mb-0 text-[15px] text-muted">
          Knode Block and Knode Line are drawn on the same grid as the logo. Geist and Geist Mono
          are by Vercel.
        </p>
      </section>

      <section aria-labelledby="h-icons" className={section}>
        <H2 id="h-icons">Icons</H2>
        <div className="grid gap-10">
          {iconCategories.map((c) => (
            <div key={c.name}>
              <p className="m-0 mb-4 text-[14px] text-muted">{c.name}</p>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 p-0">
                {c.icons.map((i) => (
                  <li
                    key={i.id}
                    className="grid place-items-center gap-3 rounded-xl border border-line bg-panel px-2 py-5"
                  >
                    <svg className="size-7 text-accent" fill="currentColor" aria-hidden="true">
                      <use href={`/assets/brand/icons.svg#knode-${i.id}`} />
                    </svg>
                    <span className="text-center text-[12px] text-muted">{i.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 mb-0 text-[15px] text-muted">
          A 7 by 7 grid with a one-cell stroke. Fills only for the mark and active states. All 68,
          plus platform icons, in{' '}
          <a href={`${KIT}/tree/main/05%20Icons`} className="link-text">
            the brand kit
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="h-terminal" className={section}>
        <H2 id="h-terminal">In the terminal</H2>
        <div className="overflow-x-auto rounded-[18px] border border-line bg-ink p-[clamp(20px,4vw,40px)]">
          <pre
            aria-label="Knode"
            className="m-0 font-mono text-[clamp(4px,1.25vw,12px)] leading-none text-indigo"
          >
            {asciiLogotype}
          </pre>
          <pre className="mt-8 mb-0 font-mono text-[13px] leading-[1.8] text-paper">
            <span className="text-indigo">[ok]</span> done{'   '}
            <span className="text-[#6e6d8c]">[..]</span> running{'   '}
            <span className="text-[#6e6d8c]">[--]</span> skipped{'   '}
            <span className="bg-paper text-ink"> !! </span> error
          </pre>
        </div>
        <p className="mt-6 mb-0 max-w-[44em] text-[15px] text-muted">
          Where there are only characters, the same shapes are painted with{' '}
          <code className="font-mono text-fg">.:-=+*#%@</code>: the CLI, READMEs and plain text.
        </p>
      </section>

      <section aria-labelledby="h-use" className={section}>
        <H2 id="h-use">Using the brand</H2>
        <p className="m-0 max-w-[40em] text-[clamp(18px,2vw,21px)] text-muted">
          Use the logo to talk about Knode or link to it, unmodified. Don't change it, use it for
          your own product or present yourself as Knode.{' '}
          <a href="/licenses" className="link-text">
            Licenses
          </a>
        </p>
      </section>
    </>
  )
}
