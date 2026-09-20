// Animated shadow states, built per color scheme. Motion can only tween box-shadow between
// strings with the same number of layers in the same order, so every state is four layers:
// [outer dark, outer light, inset dark, inset light]. Unused layers sit at alpha zero.
export function buildNeu(s) {
  const dark = (a) => `rgba(${s.shade.join(', ')}, ${Math.min(1, +(a * s.shadeK).toFixed(3))})`
  const light = `rgba(${s.lit.join(', ')}, ${s.litA})`
  const layer = (x, y, blur, color, inset = false) => `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${color}`

  const zeroOuter = [layer(0, 0, 0, dark(0)), layer(0, 0, 0, `rgba(${s.lit.join(', ')}, 0)`)]
  const zeroInset = [layer(0, 0, 0, dark(0), true), layer(0, 0, 0, `rgba(${s.lit.join(', ')}, 0)`, true)]
  const outer = (d, b, a = 0.2) => [layer(d, d, b, dark(a)), layer(-d, -d, b, light)]
  const inner = (d, b, a = 0.18) => [layer(d, d, b, dark(a), true), layer(-d, -d, b, light, true)]

  return {
    flat: [...zeroOuter, ...zeroInset].join(', '),
    raised: [...outer(9, 20), ...zeroInset].join(', '),
    raisedSm: [...outer(5, 12), ...zeroInset].join(', '),
    raisedLift: [...outer(7, 16, 0.24), ...zeroInset].join(', '),
    well: [...zeroOuter, ...inner(6, 14)].join(', '),
    pressed: [...zeroOuter, ...inner(4, 9, 0.28)].join(', '),
  }
}

export const spring = { type: 'spring', stiffness: 380, damping: 32 }
export const ease = [0.16, 1, 0.3, 1]
