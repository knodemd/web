// Scroll reveal for the sections below the first screen. Nothing is hidden until this runs, so
// the prerendered page reads the same without JavaScript; whatever is already on screen stays
// as it is, and the rest rises in as it scrolls into view.
const SELECTOR = 'main > section:not(:first-child)'

function targets(): HTMLElement[] {
  const out: HTMLElement[] = []
  for (const section of document.querySelectorAll<HTMLElement>(SELECTOR)) {
    for (const child of section.children) {
      // a list reveals item by item, anything else as one block
      if (child.matches('ul, ol') && child.children.length > 1)
        out.push(...(Array.from(child.children) as HTMLElement[]))
      else out.push(child as HTMLElement)
    }
  }
  return out
}

export function reveal(): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  if (!('IntersectionObserver' in window)) return () => {}

  const els = targets()
  const io = new IntersectionObserver(
    (entries) => {
      // items arriving together go one after another
      let i = 0
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.style.setProperty('--delay', `${Math.min(i++, 6) * 60}ms`)
        el.dataset.shown = ''
        io.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )

  for (const el of els) {
    el.dataset.reveal = ''
    if (el.getBoundingClientRect().top < innerHeight) el.dataset.shown = ''
    else io.observe(el)
  }
  document.documentElement.dataset.motion = ''

  return () => {
    io.disconnect()
    delete document.documentElement.dataset.motion
  }
}
