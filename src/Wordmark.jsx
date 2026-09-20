import WORDMARKS from './wordmarks.json'
import mark from './mark.png'
import { useDesign } from './design'

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
      <span style={{ ...face(wm.health), color: 'var(--health)' }}>Health</span>
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
