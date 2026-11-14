import { useEffect, useRef } from 'react'

// Use only glyphs in the existing pixel-grid brand font, avoiding fallback punctuation.
const CODE = 'MEMORY: NODE("THOUGHT"); LINKS: 01; SEARCH(CONTEXT); .KNODE / '
const LIVE_GLYPHS = '01KNODEMEMORYSEARCH:;=/0101'
const GLYPHS = Array.from(new Set((CODE + LIVE_GLYPHS).replace(/ /g, '')))
const CODE_GLYPHS = Array.from(CODE, (c) => GLYPHS.indexOf(c))
const LIVE = Array.from(LIVE_GLYPHS, (c) => GLYPHS.indexOf(c))
// Energy below this is invisible, so the cell rests again.
const REST = 0.03
// Colour steps between the muted ink and indigo, pre-rendered once per theme.
const SHADES = 16
// Above this many cells the grid gets coarser, so a 4K screen costs what a laptop does.
const MAX_CELLS = 12000
// Backing-store pixels at most (a 4K screen at 1x), whatever the device pixel ratio.
const MAX_PIXELS = 3840 * 2160
// Character changes need a live clock, but thirty frames per second is ample here.
const FRAME = 1000 / 30
const SIGMA = 65
// Beyond this distance the pointer adds less than the energy cut-off, so cells are skipped.
const REACH = 200

// A quiet field of code. Pointer energy decays per cell, leaving a short indigo wake.
// The hero owns the pointer events so the canvas never intercepts links or text selection.
// Only the cells in the wake are redrawn: the resting field is a cached layer and every
// glyph is a tile in a small atlas, so a frame is a few hundred drawImage calls at most.
export default function AsciiField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return

    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const scheme = matchMedia('(prefers-color-scheme: light)')
    const base = document.createElement('canvas')
    const baseCtx = base.getContext('2d')!
    const atlas = document.createElement('canvas')
    const atlasCtx = atlas.getContext('2d')!
    const field = new Image()

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let stepX = 12
    let stepY = 16
    let tileW = 12
    let tileH = 16
    let energy = new Float32Array(0)
    let shape = new Uint8ClampedArray(0)
    // Cells with energy, kept as a list so a frame never walks the whole grid.
    let live = new Uint8Array(0)
    // What each cell shows on screen now, so unchanged cells are not drawn again.
    let drawn = new Float64Array(0)
    let active: number[] = []
    let frame = 0
    let previous = 0
    let animationTime = 0
    let visible = false
    let pointer: { x: number; y: number } | null = null
    let lastPointer: { x: number; y: number } | null = null

    // Index into GLYPHS of the resting character of a cell, -1 for a space.
    const glyphAt = (index: number) => {
      const col = index % cols
      const row = (index - col) / cols
      return CODE_GLYPHS[(col + row * 19) % CODE.length]!
    }
    const restOpacity = (index: number) => 0.16 + ((shape[index * 4 + 3] ?? 0) / 255) * 0.25

    function drawGlyphs() {
      const css = getComputedStyle(canvas!)
      const rgb = (name: string) => {
        const hex = css.getPropertyValue(name).trim()
        return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16))
      }
      const from = rgb('--muted')
      const to = rgb('--color-indigo')
      const font = css.getPropertyValue('--font-line').trim()
      atlas.width = GLYPHS.length * tileW
      atlas.height = SHADES * tileH
      atlasCtx.font = `400 ${tileH}px ${font}`
      atlasCtx.textAlign = 'center'
      atlasCtx.textBaseline = 'middle'
      for (let shade = 0; shade < SHADES; shade++) {
        const t = shade / (SHADES - 1)
        atlasCtx.fillStyle = `rgb(${from.map((c, j) => Math.round(c + (to[j]! - c) * t)).join(',')})`
        GLYPHS.forEach((glyph, i) => {
          atlasCtx.save()
          atlasCtx.beginPath()
          atlasCtx.rect(i * tileW, shade * tileH, tileW, tileH)
          atlasCtx.clip()
          atlasCtx.fillText(glyph, (i + 0.5) * tileW, (shade + 0.5) * tileH)
          atlasCtx.restore()
        })
      }
    }

    // Alpha in 32 steps: fine enough to read as smooth, coarse enough that most cells in a
    // fading wake look the same as last frame and can be skipped.
    const level = (alpha: number) => Math.max(0, Math.min(31, Math.round(alpha * 31)))

    function stamp(
      target: CanvasRenderingContext2D,
      index: number,
      glyph: number,
      shade: number,
      alpha: number,
    ) {
      if (glyph < 0 || !alpha) return
      const col = index % cols
      const row = (index - col) / cols
      target.globalAlpha = alpha / 31
      target.drawImage(
        atlas,
        glyph * tileW,
        shade * tileH,
        tileW,
        tileH,
        col * tileW,
        row * tileH,
        tileW,
        tileH,
      )
    }

    // The resting field, drawn once per size, theme or font change.
    function paintBase() {
      base.width = canvas!.width
      base.height = canvas!.height
      for (let index = 0; index < cols * rows; index++)
        stamp(baseCtx, index, glyphAt(index), 0, level(restOpacity(index)))
      baseCtx.globalAlpha = 1
      ctx!.globalAlpha = 1
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.drawImage(base, 0, 0)
      drawn.fill(0)
    }

    function paintCell(index: number) {
      const col = index % cols
      const row = (index - col) / cols
      const value = energy[index] ?? 0
      let signature = 0
      let shade = 0
      let main = -1
      let mainAlpha = 0
      let first = -1
      let firstAlpha = 0
      let second = -1
      let secondAlpha = 0
      if (value) {
        main = glyphAt(index)
        shade = Math.round(value * (SHADES - 1))
        const opacity = Math.min(1, restOpacity(index) + value * 0.8)
        const blend = main < 0 ? 0 : Math.min(1, Math.max(0, (value - 0.06) / 0.45))
        mainAlpha = level(opacity * (1 - blend))
        if (blend > 0) {
          // Stagger the changes so the wake ripples instead of flashing as one block.
          const seed = col * 17 + row * 31
          const phase = animationTime / (150 + (seed % 5) * 25) + seed * 0.37
          const cycle = Math.floor(phase)
          const crossfade = Math.min(1, (phase - cycle) / 0.4)
          first = LIVE[(seed + cycle) % LIVE.length]!
          second = LIVE[(seed + cycle + 1) % LIVE.length]!
          firstAlpha = level(opacity * blend * (1 - crossfade))
          secondAlpha = level(opacity * blend * crossfade)
          if (!firstAlpha) first = -1
          if (!secondAlpha) second = -1
        }
        // Everything that decides the pixels of this cell, packed in one number (0 = resting).
        signature =
          1 +
          shade +
          SHADES *
            (mainAlpha +
              32 * (first + 1 + 32 * (firstAlpha + 32 * (second + 1 + 32 * secondAlpha))))
      }
      if (drawn[index] === signature) return
      drawn[index] = signature
      const x = col * tileW
      const y = row * tileH
      ctx!.globalAlpha = 1
      ctx!.clearRect(x, y, tileW, tileH)
      if (!signature) {
        ctx!.drawImage(base, x, y, tileW, tileH, x, y, tileW, tileH)
        return
      }
      stamp(ctx!, index, main, shade, mainAlpha)
      stamp(ctx!, index, first, shade, firstAlpha)
      stamp(ctx!, index, second, shade, secondAlpha)
    }

    function quiet() {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
      pointer = null
      lastPointer = null
      for (const index of active) {
        energy[index] = 0
        live[index] = 0
        paintCell(index)
      }
      active = []
    }

    function tick(now: number) {
      frame = 0
      if (previous && now - previous < FRAME - 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      const elapsed = previous ? Math.min(now - previous, 64) : 16
      previous = now
      animationTime += elapsed
      const decay = Math.exp(-elapsed / 500)
      for (const index of active) energy[index]! *= decay

      if (pointer) {
        // Illuminate the whole movement segment, so quick gestures leave no gaps.
        const start = lastPointer ?? pointer
        const dx = pointer.x - start.x
        const dy = pointer.y - start.y
        const length = dx * dx + dy * dy
        const rise = 1 - Math.exp(-elapsed / 45)
        const c0 = Math.max(0, Math.floor((Math.min(start.x, pointer.x) - REACH) / stepX))
        const c1 = Math.min(cols - 1, Math.ceil((Math.max(start.x, pointer.x) + REACH) / stepX))
        const r0 = Math.max(0, Math.floor((Math.min(start.y, pointer.y) - REACH) / stepY))
        const r1 = Math.min(rows - 1, Math.ceil((Math.max(start.y, pointer.y) + REACH) / stepY))
        for (let row = r0; row <= r1; row++) {
          for (let col = c0; col <= c1; col++) {
            const index = row * cols + col
            const x = (col + 0.5) * stepX - start.x
            const y = (row + 0.5) * stepY - start.y
            const along = length ? Math.max(0, Math.min(1, (x * dx + y * dy) / length)) : 0
            const distanceSquared = (x - along * dx) ** 2 + (y - along * dy) ** 2
            const target = Math.exp(-distanceSquared / (2 * SIGMA ** 2))
            const value = energy[index]!
            if (target > value) {
              energy[index] = value + (target - value) * rise
              if (!live[index] && energy[index]! > REST) {
                live[index] = 1
                active.push(index)
              }
            }
          }
        }
      }
      lastPointer = pointer

      const next: number[] = []
      for (const index of active) {
        if (energy[index]! <= REST) {
          energy[index] = 0
          live[index] = 0
        } else next.push(index)
        paintCell(index)
      }
      active = next
      ctx!.globalAlpha = 1

      if (active.length && !motion.matches && visible && !document.hidden)
        frame = requestAnimationFrame(tick)
      else if (active.length) quiet()
      else previous = 0
    }

    function wake() {
      if (!frame && !motion.matches && visible && !document.hidden)
        frame = requestAnimationFrame(tick)
    }

    function resize() {
      quiet()
      const rect = host!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const cells = Math.ceil(width / 12) * Math.ceil(height / 16)
      const scale = cells > MAX_CELLS ? Math.ceil(Math.sqrt(cells / MAX_CELLS) * 2) / 2 : 1
      stepX = 12 * scale
      stepY = 16 * scale
      cols = Math.ceil(width / stepX)
      rows = Math.ceil(height / stepY)
      let dpr = Math.min(devicePixelRatio || 1, 2)
      while (dpr > 1 && width * height * dpr * dpr > MAX_PIXELS) dpr = Math.max(1, dpr - 0.5)
      // Whole-pixel tiles keep neighbouring cells from bleeding into each other.
      tileW = Math.max(1, Math.round(stepX * dpr))
      tileH = Math.max(1, Math.round(stepY * dpr))
      canvas!.width = cols * tileW
      canvas!.height = rows * tileH
      canvas!.style.width = `${cols * stepX}px`
      canvas!.style.height = `${rows * stepY}px`
      energy = new Float32Array(cols * rows)
      live = new Uint8Array(cols * rows)
      drawn = new Float64Array(cols * rows)
      shape = new Uint8ClampedArray(cols * rows * 4)
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
      drawGlyphs()
      paintBase()
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

    function visibility() {
      if (document.hidden) quiet()
    }

    // The canvas is sized in whole cells, so the hero is what gets measured.
    let lastSize = ''
    const ro = new ResizeObserver(() => {
      const rect = host.getBoundingClientRect()
      const size = `${rect.width}x${rect.height}`
      if (size === lastSize) return
      lastSize = size
      resize()
    })
    field.onload = resize
    field.src = '/assets/img/node-field.svg'
    ro.observe(host)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      if (!visible) quiet()
    })
    io.observe(canvas)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    motion.addEventListener('change', resize)
    scheme.addEventListener('change', resize)
    document.addEventListener('visibilitychange', visibility)
    // Redraw the atlas with the local font once it is available.
    let disposed = false
    void document.fonts.load('16px "Knode Line"').then(() => {
      if (!disposed) resize()
    })

    return () => {
      disposed = true
      field.onload = null
      delete host.dataset.asciiReady
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', resize)
      scheme.removeEventListener('change', resize)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="ascii-field" />
}
