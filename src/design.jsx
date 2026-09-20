import { createContext, useContext } from 'react'
import SCHEMES from './schemes.json'
import { buildNeu } from './neu'

// The shipped design. Colors, shadows, type and background are CSS variables, and index.css holds
// first-paint fallbacks for all of them, so nothing here can flash a different look.
export const DESIGN = { scheme: 'graphite', bg: 'fluid', wordmark: 'urbanist-caveat', mark: 'mono' }

// Deep mint. True mint (#6EE7B7) is only 1.4:1 on a light ground; this is 4.6:1.
const HEALTH = '#087F5B'

function grainUrl() {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n' x='0' y='0' width='100%' height='100%'>" +
    "<feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>" +
    "<feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const scheme = SCHEMES[DESIGN.scheme]

export function applyDesign() {
  const root = document.documentElement
  const set = (k, v) => root.style.setProperty(k, v)
  Object.entries(scheme.vars).forEach(([k, v]) => set(k, v))
  scheme.wash.forEach((c, i) => set(`--wash-${i + 1}`, c))
  const shade = (a) => `rgba(${scheme.shade.join(',')},${Math.min(1, +(a * scheme.shadeK).toFixed(3))})`
  set('--shade-a', shade(0.2))
  set('--shade-b', shade(0.18))
  set('--shade-c', shade(0.25))
  set('--lit-a', `rgba(${scheme.lit.join(',')},${scheme.litA})`)
  set('--health', HEALTH)
  set('--wm-ink', '#000000')
  set('--grain', grainUrl())
  set('--grain-opacity', '0.13')
  set('--font-head', "'Mona Sans'")
  set('--font-body', "'Geist'")
  set('--font-data', "'Geist Mono', ui-monospace, monospace")
  root.dataset.bg = DESIGN.bg
  root.style.colorScheme = 'light'
}

const value = { design: DESIGN, scheme, neu: buildNeu(scheme) }
const Ctx = createContext(value)

export const DesignProvider = ({ children }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>
export const useDesign = () => useContext(Ctx)
