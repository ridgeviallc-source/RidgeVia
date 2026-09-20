import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NeuButton from './NeuButton'
import { MESSAGES } from './data'
import { useDesign } from './design'
import { ArrowRightIcon, ChevronIcon, CheckIcon, ClockIcon, FlagIcon, PenIcon } from './icons'
import { spring } from './neu'

const Groove = () => <div aria-hidden="true" className="h-[3px] w-full rounded-full shadow-groove" />

function Urgency({ urgent }) {
  return urgent ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-sm font-bold whitespace-nowrap text-destructive-foreground">
      <FlagIcon size={14} stroke={2.4} />
      Urgent, red flag
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold shadow-raised-sm">
      <ClockIcon size={14} />
      Routine
    </span>
  )
}

// The action Base Camp took, not just a summary of it: who it handed the message to, and that it is done.
function Routed({ to }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[16px] font-bold shadow-raised-sm">
        <ArrowRightIcon size={16} />
        {to}
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-success-ink">
        <CheckIcon size={16} />
        Done
      </span>
    </span>
  )
}

// The triage view: a message list on the left, what Base Camp did with the selected message on the right.
export default function TriagePane() {
  const { neu } = useDesign()
  const [selectedId, setSelectedId] = useState(MESSAGES[0].id)
  const [approved, setApproved] = useState({})
  const m = MESSAGES.find((x) => x.id === selectedId)
  const isApproved = Boolean(approved[m.id])
  const setApproval = (value) => setApproved((prev) => ({ ...prev, [m.id]: value }))

  const rows = [
    ['Intent', m.intent],
    ['Urgency', <Urgency key="u" urgent={m.urgent} />],
    ['Key facts', m.facts],
    ['Routed to', <Routed key="r" to={m.routedTo} />, true],
  ]

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <ul aria-label="Sample messages" className="flex flex-col gap-1.5">
        {MESSAGES.map((msg) => {
          const selected = msg.id === selectedId
          return (
            <li key={msg.id}>
              <button
                type="button"
                onClick={() => setSelectedId(msg.id)}
                aria-current={selected ? 'true' : undefined}
                className="relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3.5 text-left"
              >
                {selected && (
                  <motion.span
                    layoutId="inbox-well"
                    transition={spring}
                    className="absolute inset-0 rounded-2xl"
                    style={{ boxShadow: neu.well }}
                  />
                )}
                <span
                  className={`relative grid size-10 shrink-0 place-items-center rounded-full ${
                    msg.urgent ? 'bg-destructive text-destructive-foreground' : 'text-link shadow-raised-sm'
                  }`}
                >
                  {msg.urgent ? <FlagIcon size={19} /> : <PenIcon size={18} />}
                </span>
                <span className="relative min-w-0 flex-1">
                  <span className={`block text-[16px] leading-snug ${selected ? 'font-bold' : 'font-semibold'}`}>{msg.title}</span>
                  <span className={`mt-0.5 block text-sm ${msg.urgent ? 'font-bold text-destructive-ink' : 'text-muted-foreground'}`}>
                    {msg.urgent ? 'Red flag' : msg.intent}, <span style={{ fontFamily: 'var(--font-data, inherit)' }}>{msg.time}</span>
                  </span>
                </span>
                {selected && <ChevronIcon className="relative shrink-0 text-link" />}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="rounded-3xl p-5 shadow-well sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Patient message, <span style={{ fontFamily: 'var(--font-data, inherit)' }}>{m.time}</span>
                </p>
                <p className="mt-2 font-display text-[22px] leading-snug font-semibold">{m.body}</p>

                <h3 className="mt-6 font-display text-[17px] font-bold">What Base Camp found</h3>
                <dl className="mt-3 flex flex-col gap-2.5">
                  {rows.map(([label, value, strong], i) => (
                    <div key={label} className="flex flex-col gap-2.5">
                      {i > 0 && <Groove />}
                      <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-3">
                        <dt className={`text-sm ${strong ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{label}</dt>
                        <dd className="text-[16px] leading-snug">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h3 className="font-display text-[17px] font-bold">Draft reply</h3>
                <div className="mt-2 rounded-2xl p-4 text-[16px] leading-relaxed shadow-raised-sm">{m.draft}</div>
                <h3 className="mt-5 font-display text-[17px] font-bold">Chart Update</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{m.note}</p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {isApproved ? (
                    <>
                      <motion.div
                        initial={{ boxShadow: neu.raisedSm }}
                        animate={{ boxShadow: neu.pressed }}
                        transition={spring}
                        className="inline-flex h-[52px] items-center gap-2 rounded-2xl px-6 font-bold whitespace-nowrap text-success-ink"
                      >
                        <CheckIcon />
                        Approved and sent
                      </motion.div>
                      <button
                        type="button"
                        onClick={() => setApproval(false)}
                        className="cursor-pointer font-semibold text-link underline underline-offset-4"
                      >
                        Undo
                      </button>
                    </>
                  ) : (
                    <NeuButton tone="primary" onClick={() => setApproval(true)}>
                      <CheckIcon />
                      Approve and send
                    </NeuButton>
                  )}
                </div>
                <p role="status" className="mt-3 text-[15px] text-muted-foreground">
                  {isApproved
                    ? 'You approved this reply. In a real practice it would go to the patient now.'
                    : 'Nothing is sent until a person approves it.'}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
