import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NeuButton from './NeuButton'
import TriagePane from './Inbox'
import { Bars, DATA, Gauge, HBars, LineChart, Spark } from './charts'
import { ASK, BP, INTRO, NEW_PATIENTS, ONBOARDING, REPLY, SOURCES, TILES } from './demo'
import { useDesign } from './design'
import { CheckIcon, ClockIcon, TrendIcon } from './icons'
import { ease, spring } from './neu'

const TABS = [
  ['triage', 'Triage'],
  ['patients', 'Patients'],
  ['analytics', 'Analytics'],
  ['onboarding', 'Onboarding'],
]

const Groove = () => <div aria-hidden="true" className="h-[3px] w-full rounded-full shadow-groove" />
const Well = ({ children, className = '' }) => <div className={`rounded-3xl p-5 shadow-well sm:p-6 ${className}`}>{children}</div>
const H3 = ({ children }) => <h3 className="font-display text-[17px] font-bold">{children}</h3>
const Big = ({ value, note }) => (
  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <span className="text-[34px] leading-none font-bold" style={DATA}>
      {value}
    </span>
    <span className="text-[14px] text-muted-foreground">{note}</span>
  </div>
)

function Tabs({ value, onChange }) {
  const { neu } = useDesign()
  return (
    <div role="group" aria-label="Demo view" className="flex flex-wrap gap-1 rounded-full p-1.5 shadow-well">
      {TABS.map(([id, label]) => {
        const selected = id === value
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(id)}
            className={`relative cursor-pointer rounded-full px-4 py-2 text-[15px] ${selected ? 'font-bold' : 'font-semibold text-muted-foreground'}`}
          >
            {selected && (
              <motion.span layoutId="console-tab" transition={spring} className="absolute inset-0 rounded-full" style={{ boxShadow: neu.raisedSm }} />
            )}
            <span className="relative">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function Tile({ label, value, note, series, alert }) {
  return (
    <div className="rounded-2xl p-4 shadow-raised-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-[28px] leading-none font-bold" style={DATA}>
        {value}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">{note}</p>
        <Spark values={series} alert={alert} />
      </div>
    </div>
  )
}

function PatientsPane() {
  const [q, setQ] = useState(0)
  const a = ASK[q]
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">Sample patient, age 54</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {TILES.map((t) => (
          <Tile key={t.label} {...t} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Well>
          <H3>Blood pressure</H3>
          <LineChart values={BP.values} labels={BP.labels} band={BP.band} alert label="Systolic blood pressure over six weeks, rising above the target range" />
          <p className="mt-2 text-[15px] font-semibold text-destructive-ink">Above target since week 3.</p>
        </Well>
        <Well>
          <H3>Care plan</H3>
          <Gauge value={83} caption="5 of 6 on track" />
          <p className="mt-2 text-[15px] font-semibold">Eye exam overdue.</p>
        </Well>
      </div>
      <Well>
        <H3>Ask</H3>
        <div role="group" aria-label="Suggested questions" className="mt-3 flex flex-wrap gap-2.5">
          {ASK.map((item, i) => (
            <button
              key={item.q}
              type="button"
              aria-pressed={i === q}
              onClick={() => setQ(i)}
              className={`cursor-pointer rounded-full px-4 py-2 text-[15px] ${i === q ? 'font-bold shadow-well' : 'font-semibold shadow-raised-sm'}`}
            >
              {item.q}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            <p className="mt-4 rounded-2xl p-4 text-[17px] leading-snug font-semibold shadow-raised-sm">{a.answer}</p>
            <p className="mt-2 text-sm text-muted-foreground">From: {a.sources}</p>
          </motion.div>
        </AnimatePresence>
      </Well>
    </div>
  )
}

function AnalyticsPane() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">Sample practice. Numbers are illustrative.</p>
      <div className="grid gap-5 md:grid-cols-2">
        <Well>
          <H3>New patients</H3>
          <Big value="14" note="3 more than Aug" />
          <Bars values={NEW_PATIENTS.values} labels={NEW_PATIENTS.labels} />
        </Well>
        <Well>
          <H3>Reply time</H3>
          <Big value="1h 12m" note="Down 42%" />
          <LineChart values={REPLY.values} labels={REPLY.labels} label="Median reply time over eight weeks, falling from 2 hours 5 minutes to 1 hour 12 minutes" />
        </Well>
        <Well>
          <H3>Panel capacity</H3>
          <Gauge value={92} caption="412 of 450 patients" />
        </Well>
        <Well>
          <H3>Where patients come from</H3>
          <HBars rows={SOURCES} />
        </Well>
      </div>
      <Well className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full text-link shadow-raised-sm">
          <TrendIcon size={22} />
        </span>
        <p className="font-display text-[19px] leading-snug font-bold">Full in about 8 weeks. Add a schedule day.</p>
      </Well>
    </div>
  )
}

function Status({ item, approved, onApprove }) {
  if (item.status === 'approve') {
    return approved ? (
      <span className="inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap text-success-ink">
        <CheckIcon size={16} />
        Approved
      </span>
    ) : (
      <NeuButton tone="primary" onClick={onApprove} className="h-10 rounded-xl px-4 text-[14px]">
        Approve
      </NeuButton>
    )
  }
  if (item.status === 'done') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap text-success-ink">
        <CheckIcon size={16} />
        {item.label ?? 'Done'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-muted-foreground">
      <ClockIcon size={16} />
      {item.label}
    </span>
  )
}

function OnboardingPane() {
  const [approved, setApproved] = useState(false)
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Object.entries(ONBOARDING).map(([who, items]) => (
        <Well key={who}>
          <H3>{who}</H3>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item, i) => (
              <li key={item.name} className="flex flex-col gap-3">
                {i > 0 && <Groove />}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
                  <span className="text-[16px] font-semibold">{item.name}</span>
                  <Status item={item} approved={approved} onApprove={() => setApproved(true)} />
                </div>
              </li>
            ))}
          </ul>
        </Well>
      ))}
    </div>
  )
}

// One console, four views of the same product. The header carries only the tabs and the sample-data label.
export default function Console() {
  const { neu } = useDesign()
  const [tab, setTab] = useState('triage')
  return (
    <motion.section
      aria-label="Product demo"
      initial={{ y: 26, boxShadow: neu.flat }}
      animate={{ y: 0, boxShadow: neu.raised }}
      transition={{ duration: 1, ease, delay: 0.35 }}
      className="rounded-[32px] p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} />
        <span className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground shadow-well">Sample data</span>
      </div>
      <p className="mt-3 text-[15px] font-semibold text-muted-foreground">{INTRO[tab]}</p>

      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            {tab === 'triage' && <TriagePane />}
            {tab === 'patients' && <PatientsPane />}
            {tab === 'analytics' && <AnalyticsPane />}
            {tab === 'onboarding' && <OnboardingPane />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
