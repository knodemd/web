import { logo } from '@/brand/logo'

export function Logo({ className = 'h-[26px]' }: { className?: string }) {
  return (
    <svg className={`w-auto ${className}`} viewBox={logo.viewBox} role="img" aria-label="Knode">
      <g transform="scale(.5)">
        <path d={logo.symbol} className="fill-mark" />
      </g>
      <path d={logo.wordmark} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
