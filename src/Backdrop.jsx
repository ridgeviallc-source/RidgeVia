import { useEffect } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

// The living gradient behind the page, painted from the scheme's three wash colors (--wash-1..3).
// Legibility is guaranteed by the colors, not by fading the art: every wash keeps every text color
// above its contrast threshold even at full opacity, and everything here uses normal blending, so
// overlaps stay inside that range. Overall intensity is dialed down a fifth (COLOR_STRENGTH).
//
// It moves in two ways, both with transforms and opacity only, so it stays smooth on a phone:
//   Over time: a huge conic color wheel turning once every 150s, long ribbons of light sweeping and
//     tilting, mesh blobs drifting and breathing, and slow color shimmer fading in and out.
//   With the page: as you scroll, a wide band of the three colors slides across the whole screen, the
//     color wheel turns most of the way round, and three mixing layers cross-fade and slide, so peach,
//     sage and lavender clearly trade places from the top of the page to the bottom.
// Reduced-motion visitors get it still.

const COLOR_STRENGTH = 0.8
const loop = (duration) => ({ duration, repeat: Infinity, ease: 'easeInOut' })

const RIBBONS = [
  { a: 1, b: 2, w: '170vmax', h: '36vmax', left: '-35%', top: '6%', r: [-20, -8, -20], x: [0, 150, 0], dur: 54 },
  { a: 3, b: 1, w: '160vmax', h: '32vmax', left: '-28%', top: '40%', r: [16, 28, 16], x: [0, -170, 0], dur: 66 },
  { a: 2, b: 3, w: '150vmax', h: '28vmax', left: '-20%', top: '70%', r: [-10, 4, -10], x: [0, 120, 0], dur: 48 },
]
const BLOBS = [
  { c: 1, size: '74vmax', left: '-20%', top: '-22%', dx: [0, 130, -50, 0], dy: [0, 80, -40, 0], s: [1, 1.14, 0.96, 1], dur: 28 },
  { c: 2, size: '66vmax', left: '54%', top: '-16%', dx: [0, -120, 60, 0], dy: [0, 70, 120, 0], s: [1, 0.92, 1.12, 1], dur: 34 },
  { c: 3, size: '78vmax', left: '4%', top: '46%', dx: [0, 90, -90, 0], dy: [0, -70, 50, 0], s: [1, 1.1, 0.94, 1], dur: 38 },
  { c: 1, size: '54vmax', left: '62%', top: '56%', dx: [0, -80, 60, 0], dy: [0, 60, -80, 0], s: [1, 1.16, 0.92, 1], dur: 26 },
  { c: 2, size: '46vmax', left: '30%', top: '18%', dx: [0, 70, -70, 0], dy: [0, -50, 60, 0], s: [1.05, 0.9, 1.1, 1.05], dur: 32 },
]
// Slow color breathing over time: the same wash colors fading in and out.
const SHIMMER = [
  { c: 2, size: '60vmax', left: '-10%', top: '30%', o: [0.05, 0.7, 0.05], dur: 22 },
  { c: 3, size: '64vmax', left: '50%', top: '5%', o: [0.6, 0.05, 0.6], dur: 26 },
  { c: 1, size: '56vmax', left: '40%', top: '55%', o: [0.05, 0.65, 0.05], dur: 30 },
  { c: 3, size: '50vmax', left: '-15%', top: '-10%', o: [0.55, 0.05, 0.55], dur: 34 },
]
// A shimmer starts each loop at a middling strength (not at its weakest), so a reload opens at the same
// color intensity it settles into instead of dipping and then filling in.
const SHIMMER_START = 0.35
const shimmerCycle = (o) => [SHIMMER_START, Math.max(...o), Math.min(...o), SHIMMER_START]

// Mixing layers tied to page scroll. `fade` is the layer's opacity at the top, middle and bottom of the
// page; `slide` is how far it drifts sideways (in viewport widths) from top to bottom. Together they
// hand the view from one color to the next as you scroll.
const MIX = [
  { c: 2, size: '90vmax', left: '-20%', top: '14%', fade: [1, 0.05, 0.85], slide: 36 },
  { c: 3, size: '86vmax', left: '36%', top: '32%', fade: [0.05, 1, 0.1], slide: -40 },
  { c: 1, size: '82vmax', left: '6%', top: '50%', fade: [0.1, 0.1, 1], slide: 32 },
]

const radial = (c, core) => `radial-gradient(closest-side, var(--wash-${c}) 0%, var(--wash-${c}) ${core}%, transparent 100%)`

function MixLayer({ layer, flow, reduced }) {
  const opacity = useTransform(flow, [0, 0.5, 1], layer.fade)
  const x = useTransform(flow, [0, 1], ['0vw', `${layer.slide}vw`])
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: layer.left,
        top: layer.top,
        width: layer.size,
        height: layer.size,
        borderRadius: '50%',
        opacity: reduced ? layer.fade[0] : opacity,
        x: reduced ? 0 : x,
        background: radial(layer.c, 46),
        willChange: 'opacity, transform',
      }}
    />
  )
}

// The band: three washes in a row, three screens wide, drawn once and slid sideways by the scroll.
function Veil({ flow, reduced }) {
  const x = useTransform(flow, [0, 1], ['0vw', '-170vw'])
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: '-20%',
        width: '320vw',
        height: '140%',
        opacity: 0.62,
        x: reduced ? 0 : x,
        background:
          'linear-gradient(100deg, var(--wash-2) 0%, var(--wash-3) 25%, var(--wash-1) 50%, var(--wash-2) 75%, var(--wash-3) 100%)',
        willChange: 'transform',
      }}
    />
  )
}

function Fluid() {
  const reduced = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const y = useTransform(scrollY, [0, 1400], [0, -120])
  // Smoothed page progress (0 at the top, 1 at the bottom), so colors flow instead of tracking every wheel tick.
  const flow = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 })
  const wheelTurn = useTransform(flow, [0, 1], [0, 300])

  return (
    <motion.div style={{ y }} className="absolute inset-x-0 -top-[12vh] -bottom-[24vh]">
      <div className="absolute inset-0" style={{ opacity: COLOR_STRENGTH }}>
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '230vmax',
            height: '230vmax',
            marginLeft: '-115vmax',
            marginTop: '-115vmax',
            rotate: reduced ? 0 : wheelTurn,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 150, ease: 'linear', repeat: Infinity }}
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.6,
              background: 'conic-gradient(from 20deg, var(--wash-1), var(--wash-2), var(--wash-3), var(--wash-1))',
              willChange: 'transform',
            }}
          />
        </motion.div>
        {RIBBONS.map((b, i) => (
          <motion.div
            key={`rib${i}`}
            animate={{ rotate: b.r, x: b.x }}
            transition={loop(b.dur)}
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              width: b.w,
              height: b.h,
              borderRadius: '50%',
              background: `linear-gradient(90deg, transparent 0%, var(--wash-${b.a}) 30%, var(--wash-${b.b}) 70%, transparent 100%)`,
              WebkitMaskImage: 'radial-gradient(closest-side, #000 35%, transparent 100%)',
              maskImage: 'radial-gradient(closest-side, #000 35%, transparent 100%)',
              willChange: 'transform',
            }}
          />
        ))}
        {BLOBS.map((b, i) => (
          <motion.div
            key={`blob${i}`}
            animate={{ x: b.dx, y: b.dy, scale: b.s }}
            transition={loop(b.dur)}
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              opacity: 0.85,
              // Flat color core, then a long fade: a cloud of color, not a faint smudge.
              background: radial(b.c, 38),
              willChange: 'transform',
            }}
          />
        ))}
        {SHIMMER.map((b, i) => (
          <motion.div
            key={`shimmer${i}`}
            animate={reduced ? { opacity: SHIMMER_START } : { opacity: shimmerCycle(b.o), x: [0, 40, 0], y: [0, -30, 0] }}
            transition={loop(b.dur)}
            style={{
              position: 'absolute',
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              opacity: SHIMMER_START,
              background: radial(b.c, 30),
              willChange: 'opacity, transform',
            }}
          />
        ))}
        <Veil flow={flow} reduced={reduced} />
        {MIX.map((layer, i) => (
          <MixLayer key={`mix${i}`} layer={layer} flow={flow} reduced={reduced} />
        ))}
      </div>
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--grain)', opacity: 'var(--grain-opacity)' }} />
    </motion.div>
  )
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
  useEffect(retireBootBackdrop, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
        <Fluid />
      </motion.div>
    </div>
  )
}
