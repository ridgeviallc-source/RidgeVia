// Sample data for the clinOS demo. Everything here is synthetic and generated deterministically, so
// the box plot, the numbers in the agent's sentence and the rank test always agree with each other.

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function gauss(rnd) {
  let u = 0
  let v = 0
  while (!u) u = rnd()
  while (!v) v = rnd()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
function quantile(sorted, q) {
  const pos = (sorted.length - 1) * q
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo)
}

// Tukey box plot: box = Q1..Q3, whiskers reach the furthest points within 1.5 x IQR, the rest are outliers.
export function summarize(values) {
  const s = [...values].sort((a, b) => a - b)
  const q1 = quantile(s, 0.25)
  const med = quantile(s, 0.5)
  const q3 = quantile(s, 0.75)
  const iqr = q3 - q1
  const lo = q1 - 1.5 * iqr
  const hi = q3 + 1.5 * iqr
  const inside = s.filter((v) => v >= lo && v <= hi)
  return { n: s.length, q1, med, q3, whiskerLow: inside[0], whiskerHigh: inside[inside.length - 1], outliers: s.filter((v) => v < lo || v > hi), max: s[s.length - 1] }
}

// Abramowitz and Stegun 7.1.26.
function erfc(x) {
  const t = 1 / (1 + 0.3275911 * x)
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
  return poly * Math.exp(-x * x)
}

// Two-sided Mann-Whitney U test, normal approximation with continuity correction (fine for n > 40).
export function mannWhitneyP(a, b) {
  const all = [...a.map((v) => [v, 0]), ...b.map((v) => [v, 1])].sort((x, y) => x[0] - y[0])
  const ranks = new Array(all.length)
  for (let i = 0; i < all.length; ) {
    let j = i
    while (j + 1 < all.length && all[j + 1][0] === all[i][0]) j++
    const avg = (i + j) / 2 + 1
    for (let k = i; k <= j; k++) ranks[k] = avg
    i = j + 1
  }
  const n1 = a.length
  const n2 = b.length
  const r1 = all.reduce((sum, [, g], i) => (g === 0 ? sum + ranks[i] : sum), 0)
  const u = r1 - (n1 * (n1 + 1)) / 2
  const mu = (n1 * n2) / 2
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12)
  const z = (Math.abs(u - mu) - 0.5) / sigma
  return erfc(z / Math.SQRT2)
}

// Days from first inquiry to first visit, by where the patient came from (312 inquiries in all).
const SOURCES = [
  { name: 'Employer group', n: 71, median: 4, sigma: 0.42, seed: 11 },
  { name: 'Patient referral', n: 103, median: 6, sigma: 0.45, seed: 23 },
  { name: 'Physician referral', n: 46, median: 7.5, sigma: 0.4, seed: 37 },
  { name: 'Search', n: 92, median: 9.6, sigma: 0.5, seed: 41 },
]
export const GROUPS = SOURCES.map((s) => {
  const rnd = mulberry32(s.seed)
  const values = Array.from({ length: s.n }, () => Math.max(1, Math.round(s.median * Math.exp(s.sigma * gauss(rnd)))))
  return { name: s.name, values, stats: summarize(values) }
})

export function growthSummary() {
  const first = GROUPS[0]
  const last = GROUPS[GROUPS.length - 1]
  const p = mannWhitneyP(first.values, last.values)
  const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))
  return {
    total: GROUPS.reduce((sum, g) => sum + g.stats.n, 0),
    fast: { name: first.name, days: fmt(first.stats.med) },
    slow: { name: last.name, days: fmt(last.stats.med) },
    ratio: (last.stats.med / first.stats.med).toFixed(1),
    p: p < 0.001 ? 'p < 0.001' : `p = ${p.toFixed(3)}`,
  }
}

// One year of medication requests for one sample patient. `at` is months since Oct 1 (0 to 12).
export const MED_ROWS = [
  { name: 'Lisinopril', at: [0.4, 1.4, 2.4, 3.4, 4.4, 5.4, 6.4, 7.4, 8.4, 9.4, 10.4, 11.4] },
  { name: 'Metformin', at: [0.5, 1.5, 2.5, 3.6, 6.4, 7.5, 8.5, 9.6, 10.6, 11.5] },
  { name: 'Atorvastatin', at: [1, 4, 7, 10] },
]
export const MED_TOTAL = MED_ROWS.reduce((sum, r) => sum + r.at.length, 0)
