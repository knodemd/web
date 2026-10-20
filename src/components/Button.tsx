import type { ReactNode } from 'react'

export default function Button({
  href,
  primary = false,
  children,
}: {
  href: string
  primary?: boolean
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center gap-2.5 rounded-xl border px-[22px] text-base leading-none font-semibold no-underline transition duration-150 ease-out active:scale-[.97] motion-reduce:active:scale-100 [&_svg]:size-[18px] ${
        primary
          ? 'border-accent bg-accent text-on-accent hover:brightness-110'
          : 'border-line text-fg hover:border-muted'
      }`}
    >
      {children}
    </a>
  )
}
