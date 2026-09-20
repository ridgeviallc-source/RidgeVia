import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import WORDMARKS from './wordmarks.json'
import mark from './mark.png'
import { useDesign } from './design'

// Where the light band is during one sweep. Values are the band's center in word-widths: below 0 and
// above 1 it is off the word. It enters fast and slows steadily through the first half of the word, so
// the slowest point is the middle itself; there it pulls back a hair, then springs forward and out the
// right, fastest just as it leaves. Sweeps alternate: the normal one ends there. The power one winds up
// harder and springs so hard it shoots through the right edge, then makes a second full pass, left to
// right, very quickly.
const lerp = (a, b, x) => a + (b - a) * x
const easeOut = (x) => 1 - (1 - x) ** 3
const easeIn = (x) => x ** 3
const SLOW_IN = 1.6 // seconds: entering through the first half, decelerating to the middle
const PULL_BACK = 0.25 // seconds: the small anticipation at the middle
const SPRING_OUT = 0.9 // seconds: accelerating out of the word
const POWER_SPRING = 0.55 // seconds: the harder spring of the power sweep
const POWER_PASS = 0.5 // seconds: its quick second pass across the whole word
const sweepSeconds = (power) => SLOW_IN + PULL_BACK + (power ? POWER_SPRING + POWER_PASS : SPRING_OUT)
function sheenAt(seconds, power) {
  if (seconds < SLOW_IN) {
    const u = seconds / SLOW_IN
    return lerp(-0.3, 0.5, 0.75 * easeOut(u) + 0.25 * u) // keeps a little speed at the middle instead of stalling
  }
  const windUp = power ? 0.36 : 0.45
  if (seconds < SLOW_IN + PULL_BACK) return lerp(0.5, windUp, easeOut((seconds - SLOW_IN) / PULL_BACK))
  const t = seconds - SLOW_IN - PULL_BACK
  const spring = power ? POWER_SPRING : SPRING_OUT
  if (t < spring) return lerp(windUp, 1.4, easeIn(t / spring))
  if (!power) return 1.4
  return lerp(-0.3, 1.4, Math.min(1, (t - spring) / POWER_PASS)) // re-enters from the left, unseen, and crosses fast
}

// The first sweep starts within about 1.5 seconds of the page loading; after that, a new sweep starts
// 5 to 10 seconds after the last one began (always longer than the longest sweep, about 3 seconds).
// One frame loop drives each sweep from the clock alone, and a run id retires any earlier loop, so two
// sweeps can never overlap. Every sweep ends with the band off the right edge and stays gone.
const OFF = -1
function Health({ style }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let timer = 0
    let frame = 0
    let run = 0
    let count = 0
    const sweep = () => {
      if (document.hidden) return
      const id = ++run
      const power = count++ % 2 === 1
      const total = sweepSeconds(power)
      const start = performance.now()
      const tick = (now) => {
        if (id !== run) return
        const seconds = Math.max(0, (now - start) / 1000)
        if (seconds >= total) {
          el.style.setProperty('--sheen', OFF)
          return
        }
        el.style.setProperty('--sheen', sheenAt(seconds, power))
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const schedule = (delay) => {
      timer = setTimeout(() => {
        sweep()
        schedule(5000 + Math.random() * 5000)
      }, delay)
    }
    schedule(400 + Math.random() * 1000)
    // A tab opened in the background has nothing to show yet, so the shine starts just after it is first seen.
    const onVisible = () => {
      if (document.hidden) return
      clearTimeout(timer)
      schedule(400 + Math.random() * 600)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      run++
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      el.style.setProperty('--sheen', OFF)
    }
  }, [reduced])
  return (
    <span ref={ref} className="health-gloss" style={style}>
      Health
    </span>
  )
}

// "RidgeVia" in pure black/white, "Health" in mint or blue and a different typeface.
// Size comes from the parent (a text-* class) unless `size` is given.
export default function Wordmark({ id, size, className = '' }) {
  const { design } = useDesign()
  const wm = WORDMARKS.items.find((w) => w.id === (id ?? design.wordmark)) ?? WORDMARKS.items[0]
  const face = (f) => ({
    fontFamily: `'${f.family}', ${f.fallback}`,
    fontWeight: f.weight,
    fontStyle: f.style ?? 'normal',
    letterSpacing: f.tracking,
    fontSize: `${f.scale}em`,
    lineHeight: 1,
    textTransform: f.upper ? 'uppercase' : 'none',
    ...(f.wdth ? { fontVariationSettings: `"wdth" ${f.wdth}` } : {}),
  })
  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap ${className}`}
      style={{ gap: wm.gap, ...(size ? { fontSize: size } : {}), lineHeight: 1 }}
    >
      <span style={{ ...face(wm.ridge), color: 'var(--wm-ink)' }}>RidgeVia</span>
      <Health style={{ ...face(wm.health), color: 'var(--health)' }} />
    </span>
  )
}

// The flame: pure black/white (a mask filled with the wordmark ink), original colors, or hidden.
export function Mark({ size = 28, disc = true }) {
  const { design } = useDesign()
  if (design.mark === 'off') return null
  const glyph =
    design.mark === 'color' ? (
      <img src={mark} alt="" style={{ height: size, width: 'auto' }} />
    ) : (
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          height: size,
          width: Math.round(size * 0.776),
          backgroundColor: 'var(--wm-ink)',
          WebkitMaskImage: `url("${mark}")`,
          maskImage: `url("${mark}")`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    )
  return disc ? <span className="grid size-12 place-items-center rounded-full shadow-raised-sm">{glyph}</span> : glyph
}
