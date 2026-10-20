import { useEffect, useRef } from 'react'
import { logo } from '@/brand/logo'

// The cell screen from the brand guidelines: the mark sampled on a grid of cells, each cell a dot
// of the system's radius, with a slow wave running across it. Still with reduced motion, and
// paused while it is off screen.
const W = 25
const H = 10
const COLS = 34
const PAD = 4

function sample() {
  const gw = COLS
  const gh = Math.round((H / W) * (COLS - 2 * PAD)) + 2 * PAD
  const ss = 8
  const off = document.createElement('canvas')
  off.width = gw * ss
  off.height = gh * ss
  const ox = off.getContext('2d')!
  const sc = ((gw - 2 * PAD) * ss) / W
  ox.setTransform(sc, 0, 0, sc, PAD * ss, (gh * ss - H * sc) / 2)
  ox.fill(new Path2D(logo.symbol))
  const px = ox.getImageData(0, 0, off.width, off.height).data
  const g: number[] = []
  for (let j = 0; j < gh; j++)
    for (let i = 0; i < gw; i++) {
      let s = 0
      for (let a = 0; a < ss; a++)
        for (let b = 0; b < ss; b++) s += px[((j * ss + a) * off.width + i * ss + b) * 4 + 3] ?? 0
      g.push(s / (ss * ss * 255))
    }
  return { g, gw, gh }
}

export default function CellScreen({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    const { g, gw, gh } = sample()
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let t = 0
    let cw = 0
    let ch = 0
    let cell = 0
    let x0 = 0
    let y0 = 0
    let on = '#818cf8'
    let offInk = '#262640'

    function size() {
      const r = cv!.getBoundingClientRect()
      const dpr = devicePixelRatio || 1
      cv!.width = r.width * dpr
      cv!.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cw = r.width
      ch = r.height
      cell = Math.min(cw / gw, ch / gh)
      x0 = (cw - cell * gw) / 2
      y0 = (ch - cell * gh) / 2
      const css = getComputedStyle(cv!)
      on = css.getPropertyValue('--mark').trim() || on
      offInk = css.getPropertyValue('--line').trim() || offInk
    }

    function paint() {
      ctx.clearRect(0, 0, cw, ch)
      for (let j = 0; j < gh; j++)
        for (let i = 0; i < gw; i++) {
          const c = g[j * gw + i] ?? 0
          const w = 0.5 + 0.5 * Math.sin(t * 0.05 - (i + j) * 0.32)
          const v = c > 0.02 ? Math.sqrt(c) * (0.72 + 0.28 * w) : 0.1 + 0.1 * w
          ctx.fillStyle = c > 0.02 ? on : offInk
          ctx.beginPath()
          ctx.arc(
            x0 + (i + 0.5) * cell,
            y0 + (j + 0.5) * cell,
            Math.max(0.6, cell * 0.46 * v),
            0,
            6.2832,
          )
          ctx.fill()
        }
    }

    size()
    paint()
    const ro = new ResizeObserver(() => {
      size()
      paint()
    })
    ro.observe(cv)
    const scheme = matchMedia('(prefers-color-scheme: light)')
    const repaint = () => {
      size()
      paint()
    }
    scheme.addEventListener('change', repaint)

    // the brand's pace: about twenty frames a second, only while visible
    let timer = 0
    let frame = 0
    let visible = false
    function loop() {
      t++
      paint()
      timer = window.setTimeout(() => (frame = requestAnimationFrame(loop)), 50)
    }
    const io = new IntersectionObserver(([e]) => {
      if (still || !e || e.isIntersecting === visible) return
      visible = e.isIntersecting
      if (visible) loop()
      else {
        clearTimeout(timer)
        cancelAnimationFrame(frame)
      }
    })
    io.observe(cv)

    return () => {
      io.disconnect()
      ro.disconnect()
      scheme.removeEventListener('change', repaint)
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`block ${className}`} />
}
