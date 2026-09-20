import { useState } from 'react'
import { motion } from 'motion/react'
import NeuButton from './NeuButton'
import { Mark } from './Wordmark'
import { BoxPlot, DATA, MedTimeline } from './charts'
import { GROUPS, MED_ROWS, MED_TOTAL, growthSummary } from './clinosData'
import { CheckIcon, FileIcon, FolderIcon, TrendIcon } from './icons'
import { ease } from './neu'
import { useScrollPlay } from './useScrollPlay'

// Three short conversations that play as you scroll to them (same idea as Base Camp's own landing
// demos): a question, the agent's working trace, source documents, then the answer and its result.
// Together they cover reading documents, sending mail, making files and charts, and analysis.

const rise = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease } }
const Groove = () => <div aria-hidden="true" className="h-[3px] w-full rounded-full shadow-groove" />

function Frame({ frameRef, label, minH, children }) {
  return (
    <div ref={frameRef} className="rounded-3xl p-5 shadow-well sm:p-7" style={{ minHeight: minH }}>
      <p className="text-[13px] font-semibold text-muted-foreground">{label}</p>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </div>
  )
}

const UserMsg = ({ children }) => (
  <motion.div
    {...rise}
    className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-[16px] leading-snug font-semibold text-primary-foreground shadow-raised-sm sm:max-w-[80%]"
  >
    {children}
  </motion.div>
)

function AgentRow({ children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full shadow-raised-sm" title="clinOS">
        <Mark size={18} disc={false} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">{children}</div>
    </div>
  )
}

// The agent's visible working steps. Finished steps show a check; the newest pulses until the next thing appears.
function Working({ lines, done }) {
  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, i) => {
        const active = i === lines.length - 1 && !done
        return (
          <motion.div key={line} {...rise} className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
            {active ? (
              <motion.span className="size-2.5 shrink-0 rounded-full bg-health" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} />
            ) : (
              <CheckIcon size={14} className="shrink-0 text-success-ink" />
            )}
            <span>{line}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

const Chip = ({ icon, children }) => (
  <motion.span {...rise} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold shadow-raised-sm">
    {icon}
    {children}
  </motion.span>
)
const Answer = ({ children }) => (
  <motion.p {...rise} className="rounded-2xl rounded-tl-md p-4 text-[16px] leading-relaxed shadow-raised-sm">
    {children}
  </motion.p>
)
const Card = ({ children, className = '' }) => (
  <motion.div {...rise} className={`rounded-2xl p-4 shadow-raised-sm sm:p-5 ${className}`}>
    {children}
  </motion.div>
)

/* 1. Read documents, cross-reference the chart, draft an email that waits for approval. */
const EMAIL_STEPS = [500, 900, 800, 700, 1100, 900]
const EMAIL_WORK = ['Reading the denial letter…', 'Matching 3 chart notes and 2 PT reports…']

function EmailDraft({ sent, onSend }) {
  return (
    <Card>
      <dl className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-1 text-[14px]">
        <dt className="text-muted-foreground">To</dt>
        <dd>Appeals Department</dd>
        <dt className="text-muted-foreground">Subject</dt>
        <dd className="font-semibold">Appeal: lumbar MRI, claim 88214</dd>
      </dl>
      <div className="my-3">
        <Groove />
      </div>
      <p className="text-[15px] leading-relaxed">
        Conservative care was completed before this request: six weeks of physical therapy (Jun 4 to Jul 16) and daily NSAIDs. Records attached. Please reverse the denial.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold shadow-well">
          <FileIcon size={13} />
          PT_Progress_Jul.pdf
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold shadow-well">
          <FileIcon size={13} />
          Chart_Notes_Jun-Jul.pdf
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {sent ? (
          <span className="inline-flex h-11 items-center gap-2 font-bold text-success-ink">
            <CheckIcon size={18} />
            Sent
          </span>
        ) : (
          <NeuButton tone="primary" size="sm" onClick={onSend}>
            <CheckIcon size={18} />
            Approve and send
          </NeuButton>
        )}
        <span className="text-[13px] text-muted-foreground">{sent ? 'Sent from your practice account.' : 'Nothing sends until you approve.'}</span>
      </div>
    </Card>
  )
}

function EmailScene() {
  const { ref, step } = useScrollPlay(EMAIL_STEPS)
  const [sent, setSent] = useState(false)
  return (
    <Frame frameRef={ref} label="Cross-reference, then email" minH={600}>
      {step >= 1 && <UserMsg>Marcus B.&apos;s insurer denied his MRI. Check the letter against his chart and email the reviewer.</UserMsg>}
      {step >= 2 && (
        <AgentRow>
          <Working lines={EMAIL_WORK.slice(0, step - 1)} done={step >= 5} />
          {step >= 4 && (
            <div className="flex flex-wrap gap-2">
              <Chip icon={<FileIcon size={14} />}>Denial_Letter_09-03.pdf</Chip>
              <Chip icon={<FileIcon size={14} />}>PT_Progress_Jul.pdf</Chip>
            </div>
          )}
          {step >= 5 && <Answer>The denial says no conservative care was tried. His chart shows six weeks of PT and NSAIDs, Jun 4 to Jul 16. Draft ready.</Answer>}
          {step >= 6 && <EmailDraft sent={sent} onSend={() => setSent(true)} />}
        </AgentRow>
      )}
    </Frame>
  )
}

/* 2. Pull a patient's history, chart it, and save the file into the practice's folders. */
const MED_STEPS = [500, 900, 800, 900, 1800]
const MED_WORK = [`Pulling ${MED_TOTAL} requests from messages and calls…`, 'Plotting by medication…']
const SAVE_PATH = 'practice/core/patients/dana-o/med-requests-2026.png'

function MedScene() {
  const { ref, step } = useScrollPlay(MED_STEPS)
  return (
    <Frame frameRef={ref} label="Graph and save" minH={640}>
      {step >= 1 && <UserMsg>Graph Dana O.&apos;s medication requests this year. Save it to her folder.</UserMsg>}
      {step >= 2 && (
        <AgentRow>
          <Working lines={MED_WORK.slice(0, step - 1)} done={step >= 4} />
          {step >= 4 && (
            <Card>
              <p className="text-[14px] font-semibold">Medication requests, Oct to Sep</p>
              <div className="mt-3">
                <MedTimeline rows={MED_ROWS} />
              </div>
            </Card>
          )}
          {step >= 5 && (
            <>
              <Answer>Done. One 84-day gap in her metformin, mid-January to mid-April.</Answer>
              <motion.div {...rise} className="flex items-start gap-3 rounded-2xl px-4 py-3 shadow-well">
                <span className="mt-0.5 text-success-ink">
                  <FolderIcon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[14px] font-bold text-success-ink">
                    <CheckIcon size={15} />
                    Saved
                  </p>
                  <p className="mt-0.5 text-[13px] break-all" style={DATA}>
                    {SAVE_PATH}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AgentRow>
      )}
    </Frame>
  )
}

/* 3. Analyze the practice's own data, pick the right chart, and turn it into a growth move. */
const GROWTH_STEPS = [500, 900, 800, 800, 900, 2600, 900]
const SUMMARY = growthSummary()
const GROWTH_WORK = [`Reading ${SUMMARY.total} inquiries from the last 12 months…`, 'A box plot fits: the spread matters more than the average…', 'Testing the gap between sources…']

function GrowthScene() {
  const { ref, step } = useScrollPlay(GROWTH_STEPS)
  return (
    <Frame frameRef={ref} label="Scale your practice" minH={860}>
      {step >= 1 && <UserMsg>Where do new patients stall between first inquiry and first visit?</UserMsg>}
      {step >= 2 && (
        <AgentRow>
          <Working lines={GROWTH_WORK.slice(0, step - 1)} done={step >= 5} />
          {step >= 5 && (
            <Card>
              <p className="text-[14px] font-semibold">Days from inquiry to first visit, by source</p>
              <p className="mt-1 text-[13px] text-muted-foreground" style={DATA}>
                {SUMMARY.fast.days}d vs {SUMMARY.slow.days}d, {SUMMARY.ratio}x, {SUMMARY.p}
              </p>
              <div className="mt-3">
                <BoxPlot groups={GROUPS} />
              </div>
            </Card>
          )}
          {step >= 6 && (
            <Answer>
              {SUMMARY.fast.name} patients book in a median {SUMMARY.fast.days} days. {SUMMARY.slow.name} leads take {SUMMARY.slow.days} days, {SUMMARY.ratio}x slower, and it is not chance.
            </Answer>
          )}
          {step >= 7 && (
            <motion.div {...rise} className="flex items-start gap-3 rounded-2xl p-4 shadow-well">
              <span className="mt-0.5 shrink-0 text-link">
                <TrendIcon size={22} />
              </span>
              <div>
                <p className="font-display text-[19px] leading-snug font-bold">Add Tuesday afternoons.</p>
                <p className="mt-1 text-[15px] leading-snug text-muted-foreground">About 9 more new patients a month, and capacity lasts 13 more weeks.</p>
                <p className="mt-1.5 text-[12px] text-muted-foreground">Illustrative projection.</p>
              </div>
            </motion.div>
          )}
        </AgentRow>
      )}
    </Frame>
  )
}

// The conversations live in their own scrollable panel, so the demo stays one screen tall on the page
// and each scene plays when you scroll it into view inside the panel.
export default function ClinOS() {
  return (
    <div>
      <div
        role="region"
        aria-label="clinOS conversations. Scroll to see more."
        tabIndex={0}
        className="clinos-scroll h-[min(74vh,720px)] overflow-y-auto pr-1.5"
      >
        <div className="flex flex-col gap-6 py-2">
          <EmailScene />
          <MedScene />
          <GrowthScene />
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Illustrative conversations. Names, files and numbers are made up.</p>
    </div>
  )
}
