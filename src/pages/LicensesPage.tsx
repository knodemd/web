import Button from '@/components/Button'
import Icon from '@/components/Icon'
import type { IconName } from '@/brand/icons'

const licenses: {
  icon: IconName
  name: string
  covers: string
  can: string[]
  cannot: string[]
  href: string
  label: string
}[] = [
  {
    icon: 'code',
    name: 'Apache 2.0',
    covers: 'Code, docs and the .knode format, in every Knode repository.',
    can: [
      'Use Knode for free, for anything',
      'Change it and ship your own version',
      'Build apps that read and write .knode files',
    ],
    cannot: ['Remove the NOTICE that credits Knode', 'Use the Knode name or logo for your version'],
    href: 'https://www.apache.org/licenses/LICENSE-2.0',
    label: 'Read Apache 2.0',
  },
  {
    icon: 'knode',
    name: 'Knode Brand License',
    covers: 'The names Knode and .knode, the logo, the icons, Knode Block and Knode Line.',
    can: [
      'Use the logo, unmodified, to talk about Knode',
      'Link to Knode with its logo, like any platform',
      'Use the brand in contributions to Knode',
    ],
    cannot: [
      'Change or imitate the brand',
      'Use it in another product',
      'Present yourself as Knode',
    ],
    href: 'https://github.com/knodemd/brand-license',
    label: 'Read the brand license',
  },
]

export default function LicensesPage() {
  return (
    <>
      <section className="mx-auto max-w-[1120px] px-6 pt-[clamp(40px,8vw,96px)]">
        <p className="m-0 mb-6 font-line text-[15px] leading-[1.2] tracking-[.02em] text-accent uppercase">
          Licenses
        </p>
        <h1 className="m-0 font-block text-[clamp(32px,8vw,92px)] leading-[1.06] font-normal uppercase text-balance">
          Open code.
          <br />
          <span className="highlight">Our brand.</span>
        </h1>
        <p className="mt-8 mb-0 max-w-[34em] text-[clamp(18px,2vw,21px)] text-muted">
          Anyone can use, change and build on Knode. The name and the logo stay with the project, so
          nobody else can present themselves as Knode.
        </p>
      </section>

      <section
        aria-label="The two licenses"
        className="mx-auto max-w-[1120px] px-6 pt-[clamp(56px,8vw,96px)]"
      >
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4 p-0">
          {licenses.map((l) => (
            <li
              key={l.name}
              className="flex flex-col gap-6 rounded-[18px] border border-line bg-panel p-8"
            >
              <div className="flex flex-col gap-4">
                <span className="text-accent">
                  <Icon name={l.icon} className="size-7" />
                </span>
                <h2 className="m-0 font-block text-[clamp(24px,3vw,30px)] leading-none font-normal uppercase">
                  {l.name}
                </h2>
                <p className="m-0 text-muted">{l.covers}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="m-0 mb-3 font-line text-[13px] leading-none text-accent uppercase">
                    You can
                  </p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px]">
                    {l.can.map((c) => (
                      <li key={c} className="flex gap-2.5">
                        <span className="mt-[5px] text-accent">
                          <Icon name="done" className="size-3.5" />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="m-0 mb-3 font-line text-[13px] leading-none text-muted uppercase">
                    You can't
                  </p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-muted">
                    {l.cannot.map((c) => (
                      <li key={c} className="flex gap-2.5">
                        <span className="mt-[5px]">
                          <Icon name="close" className="size-3.5" />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-auto">
                <Button href={l.href}>
                  <Icon name="note" />
                  {l.label}
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-1 text-[15px] text-muted">
          <p className="m-0">
            Geist and Geist Mono are by Vercel, under the{' '}
            <a href="https://openfontlicense.org" className="link-text">
              SIL Open Font License
            </a>
            .
          </p>
          <p className="m-0">
            Why we chose these licenses:{' '}
            <a href="/handbook/decisions/0003-licences" className="link-text">
              read it in the handbook
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
