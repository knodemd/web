import { useEffect, useRef } from 'react'

const CODE = '[[memory]]  { node: "thought", links: [] }  search(context)  .knode  01  <>  + '
const GLYPHS = '.:+*#[]{}01'

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
    let frame = 0
    let previous = 0
    let visible = false
    let pointer: { x: number; y: number } | null = null
    const stepX = 16
    const stepY = 24
    const field = new Image()

    function paint() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.font = `600 15px ${font}`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col
          const value = energy[index] ?? 0
          const node = (shape[index * 4 + 3] ?? 0) / 255
          const character = CODE.charAt((col + row * 19) % CODE.length)
          ctx!.fillStyle = ink
          ctx!.globalAlpha = 0.19 + ((col * 7 + row * 13) % 5) * 0.025 + node * 0.28
          ctx!.fillText(character, (col + 0.5) * stepX, (row + 0.5) * stepY)
          if (value > 0.01) {
            ctx!.fillStyle = accent
            ctx!.globalAlpha = value * 0.12
            ctx!.beginPath()
            ctx!.roundRect(col * stepX + 1, row * stepY + 2, stepX - 2, stepY - 4, 2)
            ctx!.fill()
            ctx!.globalAlpha = Math.min(1, value * 1.35)
            ctx!.fillText(
              value > 0.6 ? GLYPHS.charAt((col * 3 + row * 7) % GLYPHS.length) : character,
              (col + 0.5) * stepX,
              (row + 0.5) * stepY,
            )
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
      const elapsed = previous ? Math.min(now - previous, 64) : 16
      previous = now
      const decay = Math.exp(-elapsed / 420)
      let active = false
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col
          const before = energy[index] ?? 0
          let value = before * decay
          if (pointer) {
            const distance = Math.hypot(
              (col + 0.5) * stepX - pointer.x,
              (row + 0.5) * stepY - pointer.y,
            )
            value = Math.max(value, Math.max(0, 1 - distance / 200) ** 1.35)
          }
          energy[index] = value > 0.01 ? value : 0
          if (Math.abs(energy[index]! - before) > 0.0001) active = true
        }
      }
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
      font = css.getPropertyValue('--font-mono').trim()
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
      wake()
    }

    function reset() {
      stop()
      pointer = null
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
    void document.fonts.ready.then(() => {
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
