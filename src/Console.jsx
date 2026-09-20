import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ClinOS from './ClinOS'
import NeuButton from './NeuButton'
import TriagePane from './Inbox'
import { INTRO, ONBOARDING } from './demo'
import { useDesign } from './design'
import { CheckIcon, ClockIcon } from './icons'
import { ease, spring } from './neu'

const TABS = [
  ['triage', 'Triage'],
  ['clinos', 'clinOS'],
  ['onboarding', 'Onboarding'],
]

const Groove = () => <div aria-hidden="true" className="h-[3px] w-full rounded-full shadow-groove" />
const Well = ({ children, className = '' }) => <div className={`rounded-3xl p-5 shadow-well sm:p-6 ${className}`}>{children}</div>
const H3 = ({ children }) => <h3 className="font-display text-[17px] font-bold">{children}</h3>

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

// One console, three views of the same product. It opens on clinOS, whose conversations play as you scroll.
export default function Console() {
  const { neu } = useDesign()
  const [tab, setTab] = useState('clinos')
  return (
    <motion.section
      aria-label="Product demo"
      initial={{ y: 26, boxShadow: neu.flat }}
      animate={{ y: 0, boxShadow: neu.raised }}
      transition={{ duration: 1, ease, delay: 0.35 }}
      className="rounded-[32px] p-3 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} />
        <span className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground shadow-well">Sample UI and data</span>
      </div>
      <p className="mt-3 text-[15px] font-semibold text-muted-foreground">{INTRO[tab]}</p>

      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            {tab === 'triage' && <TriagePane />}
            {tab === 'clinos' && <ClinOS />}
            {tab === 'onboarding' && <OnboardingPane />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Sample interface.</span> The Base Camp platform has a different theme. Conversations, names, files and numbers are made up.
      </p>
    </motion.section>
  )
}
