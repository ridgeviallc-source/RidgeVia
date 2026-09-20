import { motion } from 'motion/react'
import { ease } from './neu'

// Two charts drawn from theme tokens, so they follow the color scheme. Numbers use the "data" font
// (a monospace) with tabular figures. Each one builds itself when it mounts: the clinOS demo mounts
// them at the moment the agent "produces" them.
export const DATA = { fontFamily: 'var(--font-data, var(--font-head))', fontVariantNumeric: 'tabular-nums' }

const txt = (size, extra = {}) => ({ fontSize: size, style: { fill: 'var(--muted-foreground)', ...DATA }, ...extra })
const pop = (delay) => ({ initial: { scale: 0 }, animate: { scale: 1 }, transition: { duration: 0.35, ease, delay }, style: { transformBox: 'fill-box', transformOrigin: 'center' } })

/* Swimlane of medication requests: one row per drug, one dot per request, dashed red where a refill ran late. */
export function MedTimeline({ rows }) {
  const W = 400
  const left = 92
  const top = 24
  const rowH = 44
  const H = top + rows.length * rowH + 28
  const x = (m) => left + (m / 12) * (W - left - 14)
  const months = ['Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Aug']
  let dot = 0
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Medication requests over twelve months, with one long gap in the metformin row" className="block h-auto w-full">
      {months.map((m, i) => (
        <g key={m}>
          <line x1={x(i * 2)} x2={x(i * 2)} y1={top - 8} y2={H - 26} style={{ stroke: 'var(--foreground)' }} strokeOpacity="0.1" strokeDasharray="3 5" />
          <text x={x(i * 2)} y={H - 8} textAnchor="middle" {...txt(11.5)}>
            {m}
          </text>
        </g>
      ))}
      {rows.map((row, r) => {
        const cy = top + r * rowH + rowH / 2
        const segs = row.at.slice(1).map((m, i) => ({ a: row.at[i], b: m }))
        return (
          <g key={row.name}>
            <text x="0" y={cy + 4} fontSize="13" fontWeight="600" style={{ fill: 'var(--foreground)' }}>
              {row.name}
            </text>
            {segs.map(({ a, b }) => {
              const gap = b - a > 1.5
              return (
                <g key={a}>
                  <motion.line
                    x1={x(a)}
                    x2={x(b)}
                    y1={cy}
                    y2={cy}
                    style={{ stroke: gap ? 'var(--destructive)' : 'var(--foreground)' }}
                    strokeOpacity={gap ? 0.9 : 0.2}
                    strokeWidth={gap ? 2.2 : 1.5}
                    strokeDasharray={gap ? '5 4' : undefined}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + dot * 0.04 }}
                  />
                  {gap && (
                    <motion.text x={(x(a) + x(b)) / 2} y={cy - 10} textAnchor="middle" fontSize="11.5" fontWeight="700" style={{ fill: 'var(--destructive-ink)', ...DATA }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                      {Math.round((b - a) * 30)}-day gap
                    </motion.text>
                  )}
                </g>
              )
            })}
            {row.at.map((m, i) => {
              const late = i > 0 && m - row.at[i - 1] > 1.5
              return <motion.circle key={m} cx={x(m)} cy={cy} r="5" {...pop(0.15 + dot++ * 0.04)} style={{ fill: late ? 'var(--destructive)' : 'var(--health)', transformBox: 'fill-box', transformOrigin: 'center' }} />
            })}
          </g>
        )
      })}
    </svg>
  )
}

/* Horizontal box-and-whisker plot with the raw points behind each box. The first and last groups are the comparison. */
export function BoxPlot({ groups }) {
  const W = 400
  const left = 124
  const right = 20
  const top = 12
  const rowH = 60
  const H = top + groups.length * rowH + 30
  const max = Math.ceil(Math.max(...groups.map((g) => g.stats.max)) / 5) * 5
  const x = (v) => left + (v / max) * (W - left - right)
  const ticks = Array.from({ length: max / 5 + 1 }, (_, i) => i * 5)
  const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))
  const fill = (i) => (i === 0 ? 'var(--health)' : i === groups.length - 1 ? 'var(--destructive)' : 'var(--foreground)')
  const alpha = (i) => (i === 0 || i === groups.length - 1 ? 0.3 : 0.1)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Box plot of days from inquiry to first visit, by referral source" className="block h-auto w-full">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top} y2={H - 26} style={{ stroke: 'var(--foreground)' }} strokeOpacity="0.1" strokeDasharray="3 5" />
          <text x={x(t)} y={H - 8} textAnchor="middle" {...txt(11.5)}>
            {t}
          </text>
        </g>
      ))}
      {groups.map((g, i) => {
        const cy = top + i * rowH + rowH / 2
        const s = g.stats
        const d = i * 0.28
        return (
          <g key={g.name}>
            <text x="0" y={cy - 2} fontSize="13" fontWeight="600" style={{ fill: 'var(--foreground)' }}>
              {g.name}
            </text>
            <text x="0" y={cy + 14} fontSize="11" style={{ fill: 'var(--muted-foreground)', ...DATA }}>
              n = {s.n}
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: d }}>
              {g.values.map((v, j) => (
                <circle key={j} cx={x(v)} cy={cy + (((j * 37) % 17) - 8) * 1.6} r="1.9" style={{ fill: 'var(--foreground)' }} fillOpacity="0.28" />
              ))}
            </motion.g>
            <motion.path d={`M${x(s.whiskerLow)} ${cy} H${x(s.whiskerHigh)} M${x(s.whiskerLow)} ${cy - 7} V${cy + 7} M${x(s.whiskerHigh)} ${cy - 7} V${cy + 7}`} fill="none" style={{ stroke: 'var(--foreground)' }} strokeWidth="1.6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease, delay: 0.25 + d }} />
            <motion.rect x={x(s.q1)} y={cy - 15} width={x(s.q3) - x(s.q1)} height="30" rx="7" style={{ fill: fill(i), fillOpacity: alpha(i), stroke: 'var(--foreground)', transformBox: 'fill-box', transformOrigin: 'center' }} strokeWidth="1.6" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease, delay: 0.35 + d }} />
            <motion.line x1={x(s.med)} x2={x(s.med)} y1={cy - 15} y2={cy + 15} style={{ stroke: 'var(--foreground)' }} strokeWidth="3.4" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 + d }} />
            {s.outliers.map((v, j) => (
              <motion.circle key={j} cx={x(v)} cy={cy} r="3.4" fill="none" style={{ stroke: 'var(--foreground)', transformBox: 'fill-box', transformOrigin: 'center' }} strokeWidth="1.5" {...pop(0.9 + d + j * 0.03)} />
            ))}
            <motion.text x={x(s.whiskerHigh) + 8} y={cy - 9} fontSize="12" fontWeight="700" style={{ fill: 'var(--foreground)', ...DATA }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + d }}>
              {fmt(s.med)}d
            </motion.text>
          </g>
        )
      })}
    </svg>
  )
}
