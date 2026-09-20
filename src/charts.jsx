import { useId } from 'react'
import { motion } from 'motion/react'
import { useDesign } from './design'
import { ease } from './neu'

// Small, honest charts drawn from theme tokens, so they follow every color scheme and typeface.
// Numbers use the "data" font (a monospace when one is chosen) with tabular figures.
export const DATA = { fontFamily: 'var(--font-data, var(--font-head))', fontVariantNumeric: 'tabular-nums' }

function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`
  }
  const l = pts[pts.length - 1]
  return `${d} L${l[0].toFixed(1)} ${l[1].toFixed(1)}`
}

const draw = { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.1, ease } }

/* A tiny trend line for stat tiles. `alert` colors the end dot as a warning. */
export function Spark({ values, alert = false, w = 96, h = 34 }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => [3 + (i / (values.length - 1)) * (w - 6), 4 + (1 - (v - min) / span) * (h - 8)])
  const last = pts[pts.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0">
      <motion.path d={smooth(pts)} fill="none" style={{ stroke: 'var(--foreground)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...draw} />
      <circle cx={last[0]} cy={last[1]} r="3.6" style={{ fill: alert ? 'var(--destructive)' : 'var(--health)' }} />
    </svg>
  )
}

/* Line chart with soft grid, optional target band, area fill, and an emphasized last point. */
export function LineChart({ values, labels, band, bandLabel = 'Target', alert = false, label, h = 168 }) {
  const gid = useId().replace(/:/g, '')
  const W = 340
  const pad = { l: 10, r: 14, t: 14, b: 26 }
  const lo = Math.min(...values, band ? band[0] : Infinity)
  const hi = Math.max(...values, band ? band[1] : -Infinity)
  const span = hi - lo || 1
  const min = lo - span * 0.18
  const max = hi + span * 0.18
  const x = (i) => pad.l + (i / (values.length - 1)) * (W - pad.l - pad.r)
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b)
  const pts = values.map((v, i) => [x(i), y(v)])
  const line = smooth(pts)
  const last = pts[pts.length - 1]
  const grid = [0.2, 0.5, 0.8].map((t) => pad.t + t * (h - pad.t - pad.b))
  return (
    <svg viewBox={`0 0 ${W} ${h}`} role="img" aria-label={label} className="mt-3 block h-auto w-full">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--health)', stopOpacity: 0.32 }} />
          <stop offset="100%" style={{ stopColor: 'var(--health)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      {grid.map((g) => (
        <line key={g} x1={pad.l} x2={W - pad.r} y1={g} y2={g} style={{ stroke: 'var(--foreground)' }} strokeOpacity="0.1" strokeDasharray="3 5" />
      ))}
      {band && (
        <g>
          <rect x={pad.l} y={y(band[1])} width={W - pad.l - pad.r} height={y(band[0]) - y(band[1])} rx="6" style={{ fill: 'var(--health)' }} fillOpacity="0.14" />
          <text x={W - pad.r - 6} y={y(band[1]) + 13} textAnchor="end" fontSize="11.5" style={{ fill: 'var(--muted-foreground)', ...DATA }}>
            {bandLabel}
          </text>
        </g>
      )}
      <motion.path d={`${line} L${last[0]} ${h - pad.b} L${pts[0][0]} ${h - pad.b}Z`} style={{ fill: `url(#${gid})` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
      <motion.path d={line} fill="none" style={{ stroke: 'var(--foreground)' }} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...draw} />
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={i === pts.length - 1 ? 5 : 2.8} style={{ fill: i === pts.length - 1 ? (alert ? 'var(--destructive)' : 'var(--health)') : 'var(--foreground)' }} />
      ))}
      {labels && [0, labels.length - 1].map((i) => (
        <text key={i} x={x(i)} y={h - 6} textAnchor={i === 0 ? 'start' : 'end'} fontSize="11.5" style={{ fill: 'var(--muted-foreground)', ...DATA }}>
          {labels[i]}
        </text>
      ))}
    </svg>
  )
}

/* Raised bar columns; the latest bar is filled with the signal color. */
export function Bars({ values, labels, unit = '' }) {
  const { neu } = useDesign()
  const max = Math.max(...values)
  const last = values.length - 1
  return (
    <div className="mt-4 flex h-[168px] items-end gap-2.5 sm:gap-3" role="img" aria-label={`Bar chart: ${labels.map((l, i) => `${l} ${values[i]}`).join(', ')}`}>
      {values.map((v, i) => (
        <div key={labels[i]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[12px] font-bold" style={{ ...DATA, opacity: i === last ? 1 : 0 }}>
            {v}
            {unit}
          </span>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.07 }}
            className="w-full max-w-10 rounded-xl"
            style={{
              height: `${Math.max(8, (v / max) * 108)}px`,
              transformOrigin: 'bottom',
              boxShadow: neu.raisedSm,
              backgroundColor: i === last ? 'var(--health)' : 'transparent',
            }}
          />
          <span className="text-[12px] text-muted-foreground" style={DATA}>
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

/* Semicircle gauge with a big centered figure. */
export function Gauge({ value, caption }) {
  return (
    <div className="mt-3">
      <svg viewBox="0 0 200 118" role="img" aria-label={`${value} percent, ${caption}`} className="block h-auto w-full max-w-[280px]">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" style={{ stroke: 'var(--foreground)' }} strokeOpacity="0.13" strokeWidth="16" strokeLinecap="round" />
        <motion.path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" style={{ stroke: 'var(--health)' }} strokeWidth="16" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: value / 100 }} transition={{ duration: 1.2, ease }} />
        <text x="100" y="92" textAnchor="middle" fontSize="38" fontWeight="700" style={{ fill: 'var(--foreground)', ...DATA }}>
          {value}%
        </text>
      </svg>
      <p className="mt-1 text-[14px] text-muted-foreground" style={DATA}>
        {caption}
      </p>
    </div>
  )
}

/* Horizontal share bars in inset tracks. */
export function HBars({ rows }) {
  return (
    <ul className="mt-4 flex flex-col gap-3.5">
      {rows.map(([name, pct], i) => (
        <li key={name}>
          <div className="flex items-baseline justify-between gap-3 text-[15px]">
            <span className="font-semibold">{name}</span>
            <span className="font-bold" style={DATA}>
              {pct}%
            </span>
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full shadow-well">
            <motion.div
              className="h-full origin-left rounded-full"
              style={{ width: `${pct}%`, backgroundColor: i === 0 ? 'var(--health)' : 'var(--foreground)', opacity: i === 0 ? 1 : 0.5 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.08 }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
