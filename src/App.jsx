import { motion } from 'motion/react'
import Backdrop from './Backdrop'
import Console from './Console'
import NeuButton from './NeuButton'
import Wordmark from './Wordmark'
import { useDesign } from './design'
import { BrainIcon, ExtIcon, FlagIcon, InboxIcon, MailIcon, UserPlusIcon } from './icons'
import { ease } from './neu'

const container = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8'
const BASECAMP = 'https://basecamp.ridgevia.co'
const MAIL = 'mailto:ridgeviallc@gmail.com?subject=RidgeVia%20Health'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }
// Items start shifted but fully opaque, so the first still frame already shows every word.
const item = { hidden: { y: 16 }, show: { y: 0, transition: { duration: 0.8, ease } } }

// Scroll reveal for surfaces: depth animates in (flat -> raised), opacity never does.
function Rise({ className = '', children }) {
  const { neu } = useDesign()
  return (
    <motion.div
      initial={{ y: 18, boxShadow: neu.flat }}
      whileInView={{ y: 0, boxShadow: neu.raised }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const Groove = ({ className = '' }) => <div aria-hidden="true" className={`rounded-full shadow-groove ${className}`} />

const facts = [
  { name: 'Triage', icon: <InboxIcon size={24} />, text: 'Reads every message, ranks urgency, extracts the key facts, and pages the right teammate.' },
  {
    name: 'Knows your practice',
    icon: <BrainIcon size={24} />,
    text: 'Every patient, message, and number feeds one system that knows how your practice runs. Ask it anything, from one chart to what drives growth. It works like a second you.',
  },
  { name: 'Onboarding', icon: <UserPlusIcon size={24} />, text: 'Gets new patients and new staff up to speed faster.' },
  {
    name: 'Safety',
    icon: <FlagIcon size={24} className="text-destructive-ink" />,
    text: 'Red-flag rules run first and override the model. Patient replies wait for your approval. HIPAA Business Associate for covered practices.',
  },
]

const principles = [
  { name: 'Autonomous, never unsupervised', text: 'Base Camp does the work. Your team approves what matters.' },
  { name: 'Built inside real practices', text: "Runs in independent practices today. Every feature starts with a clinician's request." },
  { name: 'No forced migration', text: 'Works with the tools you already use. Useful on day one, no lock-in.' },
]

export default function App() {
  return (
    <>
      <Backdrop />
      <a
        href="#main"
        className="sr-only rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>

      <header className="nav-bar sticky top-0 z-40">
        <div className={`${container} flex items-center justify-between gap-3 py-2.5 sm:py-3`}>
          <a href="https://ridgevia.co" aria-label="RidgeVia Health home" className="flex items-center">
            <Wordmark className="text-[17px] sm:text-[24px]" />
          </a>
          <nav aria-label="Primary" className="flex shrink-0 items-center gap-0.5 rounded-full p-1 text-[13px] font-semibold whitespace-nowrap shadow-well sm:gap-1 sm:p-1.5 sm:text-[15px]">
            <a href={BASECAMP} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-primary-foreground shadow-raised-sm hover:brightness-125 sm:gap-1.5 sm:px-4 sm:py-2">
              Base Camp <ExtIcon size={12} />
            </a>
            <a href={MAIL} className="rounded-full px-3 py-1.5 text-foreground hover:underline sm:px-4 sm:py-2">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section>
          <div className={`${container} flex flex-col gap-12 py-10 lg:gap-14 lg:py-14`}>
            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.h1
                variants={item}
                className="max-w-[15ch] font-display text-[48px] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance sm:text-[68px] lg:text-[92px]"
              >
                <span className="simply-gloss" data-text="Simply">
                  Simply
                </span>{' '}
                scale your practice.
              </motion.h1>
            </motion.div>
            <dl className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              {facts.map((f) => (
                <div key={f.name} className="flex flex-col gap-4 rounded-[28px] p-5 shadow-raised sm:p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full text-link shadow-raised-sm">{f.icon}</span>
                  <div>
                    <dt className="font-display text-[22px] leading-tight font-bold tracking-[-0.02em]">{f.name}</dt>
                    <dd className="mt-1.5 text-[16px] leading-relaxed text-muted-foreground">{f.text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="base-camp" className={`${container} flex min-h-svh flex-col justify-center py-20`}>
          <h2 className="font-display text-[64px] leading-none font-extrabold tracking-[-0.045em] sm:text-[104px] lg:text-[140px]">Base Camp</h2>
          <p className="mt-8 max-w-[34ch] text-[22px] leading-relaxed text-muted-foreground sm:text-[26px]">
            The autonomous agent for small and medium practices. Better outcomes, with far less data work.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <NeuButton as="a" href={BASECAMP} tone="primary" size="lg">
              Open Base Camp <ExtIcon />
            </NeuButton>
            <a href={`${BASECAMP}/features`} className="text-[19px] font-bold text-link underline underline-offset-4">
              Features
            </a>
            <a href={`${BASECAMP}/pricing`} className="text-[19px] font-bold text-link underline underline-offset-4">
              Pricing
            </a>
          </div>
        </section>

        <section id="demo" className={`${container} pb-10`}>
          <Console />
        </section>

        <section className={`${container} py-16`}>
          <h2 className="max-w-[20ch] font-display text-[38px] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance sm:text-[48px]">
            Better outcomes, less data work.
          </h2>
          <Rise className="mt-12 flex flex-col gap-8 rounded-[32px] p-7 md:flex-row md:gap-10 md:p-10">
            {principles.map((p, i) => (
              <div key={p.name} className="contents">
                {i > 0 && <Groove className="h-[3px] w-full md:h-auto md:w-[3px] md:self-stretch" />}
                <div className="flex-1">
                  <h3 className="font-display text-[24px] leading-tight font-bold tracking-[-0.02em]">{p.name}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </div>
            ))}
          </Rise>
        </section>

        <section id="contact" className={`${container} py-20`}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[36px] p-8 shadow-well md:flex-row md:items-center md:p-12">
            <div>
              <h2 className="max-w-[18ch] font-display text-[34px] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance sm:text-[44px]">
                Practices, investors, and collaborators.
              </h2>
              <p className="mt-4 max-w-[46ch] text-[19px] leading-relaxed text-muted-foreground">
                Run a practice, invest in this space, or build for it? Let&apos;s talk.
              </p>
            </div>
            <NeuButton as="a" href={MAIL} tone="primary" size="lg" className="shrink-0">
              <MailIcon size={22} />
              Email RidgeVia Health
            </NeuButton>
          </div>
        </section>
      </main>

      <footer className={`${container} flex flex-col gap-4 pt-4 pb-12 text-[15px] text-muted-foreground`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Wordmark className="text-[20px]" />
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-7 gap-y-2 font-semibold">
            <a href={BASECAMP} className="inline-flex items-center gap-1.5 hover:text-foreground">
              Base Camp <ExtIcon size={13} />
            </a>
            <a href={`${BASECAMP}/privacy`} className="hover:text-foreground">Privacy</a>
            <a href={`${BASECAMP}/terms`} className="hover:text-foreground">Terms</a>
            <a href="mailto:ridgeviallc@gmail.com" className="hover:text-foreground">Contact</a>
          </nav>
        </div>
        <p>Base Camp is a RidgeVia Health product. &copy; 2026 RidgeVia LLC.</p>
      </footer>

    </>
  )
}
