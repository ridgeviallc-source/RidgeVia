import { useEffect } from 'react'
import { motion } from 'motion/react'
import Backdrop from './Backdrop'
import Console from './Console'
import NeuButton from './NeuButton'
import Wordmark from './Wordmark'
import campfire from './campfire-logo.png'
import { useDesign } from './design'
import { BrainIcon, ExtIcon, FlagIcon, InboxIcon, MailIcon, UserPlusIcon } from './icons'
import { ease } from './neu'

const container = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8'
// A row that fills the screen under the sticky bar and is a soft scroll-snap target.
const ROW = 'snap-row flex min-h-[calc(100svh-4.75rem)] flex-col'
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

// Everything below the first screen fades and rises in as it enters and fades out as it leaves, tied to the
// scroll position (the .reveal rules in index.css, run by the compositor). Browsers without scroll-driven
// animations get a one-time fade-in as each block arrives instead, and reduced-motion visitors get neither.
function useRevealFallback() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (CSS.supports('animation-timeline: view()')) return undefined
    const blocks = [...document.querySelectorAll('.reveal')]
    const watch = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          watch.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    blocks.forEach((el) => {
      el.classList.add('reveal-js')
      watch.observe(el)
    })
    return () => watch.disconnect()
  }, [])
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
  useRevealFallback()
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
        {/* Every part of the page is a row that fills the screen under the sticky bar (about 4.75rem). The page
            softly snaps to each row as you scroll (index.css), a nudge toward one row at a time. */}
        <section className={`${container} ${ROW} py-10 lg:py-14`}>
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h1
              variants={item}
              className="max-w-[15ch] font-display text-[48px] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance sm:text-[68px] lg:text-[92px]"
            >
              Simply scale your practice.
            </motion.h1>
          </motion.div>
        </section>

        <section className={`${container} ${ROW} py-5 sm:py-6`}>
          <dl className="grid flex-1 auto-rows-fr gap-4 sm:grid-cols-2 sm:gap-5">
            {facts.map((f) => (
              <div key={f.name} className="reveal flex flex-col justify-center gap-5 rounded-[32px] p-6 shadow-raised sm:p-8">
                <span className="grid size-12 shrink-0 place-items-center rounded-full text-link shadow-raised-sm">{f.icon}</span>
                <div>
                  <dt className="font-display text-[24px] leading-tight font-bold tracking-[-0.02em] sm:text-[26px] lg:text-[28px]">{f.name}</dt>
                  <dd className="mt-2 text-[16px] leading-relaxed text-muted-foreground lg:text-[17px]">{f.text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <section id="base-camp" className={`${container} ${ROW} justify-center py-12`}>
          <h2 className="reveal basecamp-wordmark text-[clamp(40px,13vw,52px)] leading-[1.05] sm:text-[84px] md:text-[104px] lg:text-[136px]">
            {/* The campfire is exactly as tall as the capital letters (0.7em in this cut) and sits on the baseline, so its top and bottom line up with the letters. */}
            <img src={campfire} alt="" aria-hidden="true" className="mr-[0.2em] inline-block h-[0.7em] w-auto align-baseline" />
            Base Camp
          </h2>
          <p className="reveal mt-8 max-w-[34ch] text-[22px] leading-relaxed text-muted-foreground sm:text-[26px]" style={{ '--in-s': '8%', '--in-e': '98%' }}>
            The autonomous agent for small and medium practices. Better outcomes, with far less data work.
          </p>
          <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ '--in-s': '16%', '--in-e': '100%' }}>
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

        <section id="demo" className={`${container} ${ROW} justify-center py-4`}>
          <div className="reveal" style={{ '--in-e': '25%', '--out-s': '75%' }}>
            <Console />
          </div>
        </section>

        <section className={`${container} ${ROW} justify-center gap-10 py-12`}>
          <h2 className="reveal max-w-[20ch] font-display text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance sm:text-[44px] lg:text-[56px]">
            Better outcomes, less data work.
          </h2>
          <div className="reveal" style={{ '--in-e': '45%', '--out-s': '55%' }}>
            <Rise className="flex flex-col gap-8 rounded-[36px] p-7 sm:p-9 md:min-h-[34svh] md:flex-row md:gap-10 md:p-10">
              {principles.map((p, i) => (
                <div key={p.name} className="contents">
                  {i > 0 && <Groove className="h-[3px] w-full md:h-auto md:w-[3px] md:self-stretch" />}
                  <div className="flex-1">
                    <h3 className="font-display text-[22px] leading-tight font-bold tracking-[-0.02em] sm:text-[24px]">{p.name}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground lg:text-[17px]">{p.text}</p>
                  </div>
                </div>
              ))}
            </Rise>
          </div>
        </section>

        <section id="contact" className={`${container} ${ROW} py-8`}>
          <div className="reveal flex flex-1 flex-col items-start justify-center gap-8 rounded-[40px] p-7 shadow-well sm:p-12 lg:p-14">
            <h2 className="max-w-[20ch] font-display text-[32px] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance sm:text-[44px] lg:text-[56px]">
              Practices, investors, and collaborators.
            </h2>
            <p className="max-w-[44ch] text-[18px] leading-relaxed text-muted-foreground sm:text-[20px]">
              Run a practice, invest in this space, or build for it? Let&apos;s talk.
            </p>
            <NeuButton as="a" href={MAIL} tone="primary" size="lg" className="shrink-0">
              <MailIcon size={22} />
              Email RidgeVia Health
            </NeuButton>
          </div>
        </section>
      </main>

      <footer className={`${container} snap-end-row flex flex-col gap-4 pt-4 pb-12 text-[15px] text-muted-foreground`}>
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
