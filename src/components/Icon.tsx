import { icons, type IconName } from '@/brand/icons'

export default function Icon({
  name,
  className = 'size-3.5',
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 7 7" aria-hidden="true">
      <path d={icons[name]} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
