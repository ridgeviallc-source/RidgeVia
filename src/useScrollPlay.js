import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

// Scroll-triggered, play-once timeline (the same idea as Base Camp's own landing-page demos).
// Once the returned `ref` is 30% visible (in the page or inside a scroll container), `step` advances 1..N on the given per-step timers,
// then holds on the final value. It never resets. Visitors who prefer reduced motion get the
// finished state immediately.
export function useScrollPlay(stepDurationsMs) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setStep(stepDurationsMs.length)
      return
    }
    let elapsed = 0
    const timers = stepDurationsMs.map((duration, i) => {
      elapsed += duration
      return setTimeout(() => setStep(i + 1), elapsed)
    })
    return () => timers.forEach(clearTimeout)
    // stepDurationsMs is a module-level constant at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced])

  return { ref, step }
}
