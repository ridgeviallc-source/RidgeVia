import { motion, useScroll, useTransform } from 'motion/react'

// The living gradient behind the page, painted from the scheme's three wash colors (--wash-1..3).
// Legibility is guaranteed by the colors, not by fading the art: every wash keeps every text color
// above its contrast threshold even at full opacity, and everything here uses normal blending, so
// overlaps stay inside that range. Three moving layers, slowest at the bottom:
//   1. a huge conic color wheel turning once every 150s (the slow color travel),
//   2. long soft ribbons of light that sweep and tilt,
//   3. mesh blobs that drift, breathe and swap places.
// Fine grain sits on top so it reads as printed color, not a screensaver. Everything moves with
// transforms only, so it stays smooth on a phone, and reduced-motion visitors get it still.

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

function Fluid() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1400], [0, -120])
  return (
    <motion.div style={{ y }} className="absolute inset-x-0 -top-[12vh] -bottom-[24vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, ease: 'linear', repeat: Infinity }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '230vmax',
          height: '230vmax',
          marginLeft: '-115vmax',
          marginTop: '-115vmax',
          opacity: 0.6,
          background: 'conic-gradient(from 20deg, var(--wash-1), var(--wash-2), var(--wash-3), var(--wash-1))',
          willChange: 'transform',
        }}
      />
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
            background: `radial-gradient(closest-side, var(--wash-${b.c}) 0%, var(--wash-${b.c}) 38%, transparent 100%)`,
            willChange: 'transform',
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--grain)', opacity: 'var(--grain-opacity)' }} />
    </motion.div>
  )
}

export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
        <Fluid />
      </motion.div>
    </div>
  )
}
