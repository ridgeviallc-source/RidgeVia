import { useEffect, useRef } from 'react'

// The living gradient behind the page, painted from the scheme's three wash colors (--wash-1..3).
// Legibility is guaranteed by the colors, not by fading the art: every wash keeps every text color
// above its contrast threshold even at full opacity, and everything here uses normal blending, so
// overlaps stay inside that range. Overall intensity is dialed down a fifth (COLOR_STRENGTH).
//
// It moves in two ways, and neither runs script per frame, so it stays smooth on a phone:
//   Over time: a color wheel turning once every 150s, long ribbons of light sweeping and tilting, mesh
//     blobs drifting and breathing, and slow color shimmer fading in and out. These are CSS keyframes on
//     transform and opacity only (index.css), so the compositor runs them and the main thread stays free.
//   With the page: as you scroll, a wide band of the three colors slides across the whole screen, the
//     color wheel turns most of the way round, and three mixing layers cross-fade and slide, so peach,
//     sage and lavender clearly trade places from the top of the page to the bottom. One CSS variable
//     (--flow, 0 at the top and 1 at the bottom) drives all of it; a small loop eases it toward the scroll
//     position and stops the moment it arrives.
// Reduced-motion visitors get it still.

const COLOR_STRENGTH = 0.8

const RIBBONS = [
  { a: 1, b: 2, w: '170vmax', h: '36vmax', left: '-35%', top: '6%', r: [-20, -8], x: 150, dur: 54 },
  { a: 3, b: 1, w: '160vmax', h: '32vmax', left: '-28%', top: '40%', r: [16, 28], x: -170, dur: 66 },
  { a: 2, b: 3, w: '150vmax', h: '28vmax', left: '-20%', top: '70%', r: [-10, 4], x: 120, dur: 48 },
]
const BLOBS = [
  { c: 1, size: '74vmax', left: '-20%', top: '-22%', dx: [130, -50], dy: [80, -40], s: [1.14, 0.96], dur: 28 },
  { c: 2, size: '66vmax', left: '54%', top: '-16%', dx: [-120, 60], dy: [70, 120], s: [0.92, 1.12], dur: 34 },
  { c: 3, size: '78vmax', left: '4%', top: '46%', dx: [90, -90], dy: [-70, 50], s: [1.1, 0.94], dur: 38 },
  { c: 1, size: '54vmax', left: '62%', top: '56%', dx: [-80, 60], dy: [60, -80], s: [1.16, 0.92], dur: 26 },
  { c: 2, size: '46vmax', left: '30%', top: '18%', dx: [70, -70], dy: [-50, 60], s: [0.9, 1.1], dur: 32 },
]
// Slow color breathing over time: the same wash colors fading in and out. A shimmer starts each loop at a
// middling strength (not at its weakest), so a reload opens at the same color intensity it settles into
// instead of dipping and then filling in. `o` is the strength at the peak and at the trough.
const SHIMMER = [
  { c: 2, size: '60vmax', left: '-10%', top: '30%', o: [0.7, 0.05], dur: 22 },
  { c: 3, size: '64vmax', left: '50%', top: '5%', o: [0.6, 0.05], dur: 26 },
  { c: 1, size: '56vmax', left: '40%', top: '55%', o: [0.65, 0.05], dur: 30 },
  { c: 3, size: '50vmax', left: '-15%', top: '-10%', o: [0.6, 0.05], dur: 34 },
]
const SHIMMER_START = 0.35
// Mixing layers tied to page scroll. `fade` is the layer's opacity at the top, middle and bottom of the
// page; `slide` is how far it drifts sideways (in viewport widths) from top to bottom. Together they
// hand the view from one color to the next as you scroll.
const MIX = [
  { c: 2, size: '90vmax', left: '-20%', top: '14%', fade: [1, 0.05, 0.85], slide: 36 },
  { c: 3, size: '86vmax', left: '36%', top: '32%', fade: [0.05, 1, 0.1], slide: -40 },
  { c: 1, size: '82vmax', left: '6%', top: '50%', fade: [0.1, 0.1, 1], slide: 32 },
]

const radial = (c, core) => `radial-gradient(closest-side, var(--wash-${c}) 0%, var(--wash-${c}) ${core}%, transparent 100%)`
const lobe = (c, at) => `radial-gradient(ellipse 48% 50% at ${at}% 50%, var(--wash-${c}) 0%, var(--wash-${c}) 30%, transparent 100%)`

// Eases --flow toward the page's scroll position, and stops the moment it gets there.
function useFlow(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let target = 0
    let current = 0
    let frame = 0
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    const tick = () => {
      current += (target - current) * 0.1
      if (Math.abs(target - current) < 0.0005) current = target
      root.style.setProperty('--flow', current.toFixed(4))
      frame = current === target ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => {
      measure()
      if (!frame) frame = requestAnimationFrame(tick)
    }
    measure()
    current = target
    root.style.setProperty('--flow', current.toFixed(4))
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake, { passive: true })
    return () => {
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      cancelAnimationFrame(frame)
    }
  }, [rootRef])
}

// index.html carries a static copy of the washes (#boot-backdrop) so the very first paint is already
// colored. It stays at full strength while this backdrop fades in over it, then fades out underneath,
// so the color never dips on a reload.
function retireBootBackdrop() {
  const boot = document.getElementById('boot-backdrop')
  if (!boot) return undefined
  boot.style.transition = 'opacity 0.8s ease 0.6s'
  boot.style.opacity = '0'
  const timer = setTimeout(() => boot.remove(), 1500)
  return () => clearTimeout(timer)
}

export default function Backdrop() {
  const rootRef = useRef(null)
  useEffect(retireBootBackdrop, [])
  useFlow(rootRef)

  return (
    <div ref={rootRef} aria-hidden="true" className="bd pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden">
      <div className="bd-parallax absolute inset-x-0 -top-[12vh] -bottom-[24vh]">
        <div className="absolute inset-0" style={{ opacity: COLOR_STRENGTH }}>
          <div className="bd-turn">
            <div className="bd-wheel" />
          </div>
          {RIBBONS.map((b, i) => (
            <div
              key={`rib${i}`}
              className="bd-ribbon"
              style={{
                left: b.left,
                top: b.top,
                width: b.w,
                height: b.h,
                '--r0': `${b.r[0]}deg`,
                '--r1': `${b.r[1]}deg`,
                '--x1': `${b.x}px`,
                '--dur': `${b.dur}s`,
                background: `${lobe(b.a, 30)}, ${lobe(b.b, 70)}`,
              }}
            />
          ))}
          {BLOBS.map((b, i) => (
            <div
              key={`blob${i}`}
              className="bd-blob"
              style={{
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                '--dx1': `${b.dx[0]}px`,
                '--dy1': `${b.dy[0]}px`,
                '--s1': b.s[0],
                '--dx2': `${b.dx[1]}px`,
                '--dy2': `${b.dy[1]}px`,
                '--s2': b.s[1],
                '--dur': `${b.dur}s`,
                // Flat color core, then a long fade: a cloud of color, not a faint smudge.
                background: radial(b.c, 38),
              }}
            />
          ))}
          {SHIMMER.map((b, i) => (
            <div
              key={`shimmer${i}`}
              className="bd-shimmer"
              style={{
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                '--o0': SHIMMER_START,
                '--o1': b.o[0],
                '--o2': b.o[1],
                '--dur': `${b.dur}s`,
                background: radial(b.c, 30),
              }}
            />
          ))}
          <div className="bd-veil" />
          {MIX.map((layer, i) => (
            <div
              key={`mix${i}`}
              className="bd-mix"
              style={{
                left: layer.left,
                top: layer.top,
                width: layer.size,
                height: layer.size,
                '--a': layer.fade[0],
                '--b': layer.fade[1],
                '--c': layer.fade[2],
                '--slide': layer.slide,
                background: radial(layer.c, 46),
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--grain)', opacity: 'var(--grain-opacity)' }} />
      </div>
    </div>
  )
}
