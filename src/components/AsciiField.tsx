import { useEffect, useRef } from 'react'

// Use only glyphs in the existing pixel-grid brand font, avoiding fallback punctuation.
const CODE = 'MEMORY: NODE("THOUGHT"); LINKS: 01; SEARCH(CONTEXT); .KNODE / '
const LIVE_GLYPHS = '01KNODEMEMORYSEARCH:;=/0101'

// A quiet field of code. Pointer energy decays per cell, leaving a short indigo wake.
// The hero owns the pointer events so the canvas never intercepts links or text selection.
export default function AsciiField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return

    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const scheme = matchMedia('(prefers-color-scheme: light)')
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let energy = new Float32Array(0)
    let shape = new Uint8ClampedArray(0)
    let ink = ''
    let accent = ''
    let font = ''
    let palette: string[] = []
    let frame = 0
    let previous = 0
    let animationTime = 0
    let visible = false
    let pointer: { x: number; y: number } | null = null
    let lastPointer: { x: number; y: number } | null = null
    const stepX = 12
    const stepY = 16
    const field = new Image()

    function paint() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.font = `400 16px ${font}`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col
          const value = energy[index] ?? 0
          const node = (shape[index * 4 + 3] ?? 0) / 255
          const character = CODE.charAt((col + row * 19) % CODE.length)
          ctx!.fillStyle = palette[Math.round(value * 127)] ?? ink
          const opacity = Math.min(1, 0.16 + node * 0.25 + value * 0.8)
          const x = (col + 0.5) * stepX
          const y = (row + 0.5) * stepY
          const blend = character === ' ' ? 0 : Math.min(1, Math.max(0, (value - 0.06) / 0.45))
          ctx!.globalAlpha = opacity * (1 - blend)
          ctx!.fillText(character, x, y)
          if (blend > 0) {
            // Stagger the changes so the wake ripples instead of flashing as one block.
            const seed = col * 17 + row * 31
            const phase = animationTime / (150 + (seed % 5) * 25) + seed * 0.37
            const cycle = Math.floor(phase)
            const crossfade = Math.min(1, (phase - cycle) / 0.4)
            ctx!.globalAlpha = opacity * blend * (1 - crossfade)
            ctx!.fillText(LIVE_GLYPHS.charAt((seed + cycle) % LIVE_GLYPHS.length), x, y)
            ctx!.globalAlpha = opacity * blend * crossfade
            ctx!.fillText(LIVE_GLYPHS.charAt((seed + cycle + 1) % LIVE_GLYPHS.length), x, y)
          }
        }
      }
      ctx!.globalAlpha = 1
    }

    function stop() {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
    }

    function tick(now: number) {
      frame = 0
      // Character changes need a live clock, but thirty frames per second is ample here.
      if (previous && now - previous < 1000 / 30) {
        frame = requestAnimationFrame(tick)
        return
      }
      const elapsed = previous ? Math.min(now - previous, 64) : 16
      previous = now
      animationTime += elapsed
      const decay = Math.exp(-elapsed / 500)
      let active = false
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col
          const before = energy[index] ?? 0
          let value = before * decay
          if (pointer) {
            // Illuminate the whole movement segment, so quick gestures leave no gaps.
            const start = lastPointer ?? pointer
            const dx = pointer.x - start.x
            const dy = pointer.y - start.y
            const x = (col + 0.5) * stepX - start.x
            const y = (row + 0.5) * stepY - start.y
            const length = dx * dx + dy * dy
            const along = length ? Math.max(0, Math.min(1, (x * dx + y * dy) / length)) : 0
            const distanceSquared = (x - along * dx) ** 2 + (y - along * dy) ** 2
            const target = Math.exp(-distanceSquared / (2 * 65 ** 2))
            if (target > value) value += (target - value) * (1 - Math.exp(-elapsed / 45))
          }
          energy[index] = value > 0.01 ? value : 0
          if (energy[index]! > 0.06 || Math.abs(energy[index]! - before) > 0.0001) active = true
        }
      }
      lastPointer = pointer
      paint()
      if (active && !motion.matches && visible && !document.hidden)
        frame = requestAnimationFrame(tick)
      else previous = 0
    }

    function wake() {
      if (!frame && !motion.matches && visible && !document.hidden)
        frame = requestAnimationFrame(tick)
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / stepX)
      rows = Math.ceil(height / stepY)
      energy = new Float32Array(cols * rows)
      const css = getComputedStyle(canvas!)
      ink = css.getPropertyValue('--muted').trim()
      accent = css.getPropertyValue('--color-indigo').trim()
      font = css.getPropertyValue('--font-line').trim()
      const rgb = (hex: string) =>
        [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16))
      const from = rgb(ink)
      const to = rgb(accent)
      palette = Array.from({ length: 128 }, (_, i) => {
        const channels = from.map((channel, j) =>
          Math.round(channel + (to[j]! - channel) * (i / 127)),
        )
        return `rgb(${channels.join(',')})`
      })
      if (field.complete && field.naturalWidth) {
        // Sample the existing brand illustration on the same grid as the code. The nodes
        // emerge from the characters rather than sitting on top as a separate SVG layer.
        const sampler = document.createElement('canvas')
        sampler.width = cols
        sampler.height = rows
        const sample = sampler.getContext('2d')!
        const band = Math.min(260, Math.max(120, width * 0.2))
        const imageHeight = Math.max(band, (width * field.naturalHeight) / field.naturalWidth)
        sample.drawImage(field, 0, (height - band) / stepY, cols, imageHeight / stepY)
        shape = sample.getImageData(0, 0, cols, rows).data
        host!.dataset.asciiReady = ''
      }
      paint()
    }

    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || motion.matches) return
      const rect = canvas!.getBoundingClientRect()
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      wake()
    }

    function leave() {
      pointer = null
      lastPointer = null
      wake()
    }

    function reset() {
      stop()
      pointer = null
      lastPointer = null
      resize()
    }

    function visibility() {
      if (document.hidden) reset()
      else paint()
    }

    field.onload = resize
    field.src = '/assets/img/node-field.svg'
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      if (!visible) reset()
    })
    io.observe(canvas)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    motion.addEventListener('change', reset)
    scheme.addEventListener('change', reset)
    document.addEventListener('visibilitychange', visibility)
    // Repaint with the local font once it is available, without keeping an animation running.
    let disposed = false
    void document.fonts.load('16px "Knode Line"').then(() => {
      if (!disposed) paint()
    })

    return () => {
      disposed = true
      field.onload = null
      delete host.dataset.asciiReady
      stop()
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', reset)
      scheme.removeEventListener('change', reset)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="ascii-field" />
}
