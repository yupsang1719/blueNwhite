import { motion } from 'framer-motion'
import { FiMapPin, FiExternalLink } from 'react-icons/fi'
import { experiences } from '../data/experience'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// One accent colour per role in order
const BADGE_COLORS = [
  'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
]

export default function ExperienceSection({ limit }) {
  const list = limit ? experiences.slice(0, limit) : experiences

  return (
    <section className="relative mx-auto w-full max-w-5xl py-16">
      {/* section divider glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent dark:via-primary-400/30" />

      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Experience</h2>
        {limit && experiences.length > limit && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            +{experiences.length - limit} more on About
          </span>
        )}
      </div>

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="relative grid gap-5 pl-14"
      >
        {/* fading vertical line */}
        <span className="pointer-events-none absolute left-[15px] top-4 h-[calc(100%-2rem)] w-px
          bg-gradient-to-b from-neutral-300 via-neutral-200 to-transparent
          dark:from-neutral-700 dark:via-neutral-800 dark:to-transparent" />

        {list.map((xp, idx) => (
          <motion.li key={idx} variants={item} className="relative">

            {/* Company badge */}
            <div className={`absolute -left-14 top-3 flex h-9 w-9 select-none items-center justify-center
              rounded-xl text-sm font-bold shadow-sm ${BADGE_COLORS[idx % BADGE_COLORS.length]}`}>
              {xp.company[0]}
            </div>

            {/* Card */}
            <div className={`group rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm
              transition hover:-translate-y-0.5 hover:shadow-md
              dark:bg-neutral-900/60
              ${xp.current
                ? 'border-primary-200 border-l-4 border-l-primary-500 bg-primary-50/40 dark:border-neutral-700 dark:border-l-primary-500 dark:bg-primary-950/20'
                : 'border-neutral-200 dark:border-neutral-800'
              }`}>

              {/* Top row: role + Current badge */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{xp.role}</p>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{xp.company}</p>
                </div>
                {xp.current && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1
                    text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Current
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600
                  dark:bg-neutral-800 dark:text-neutral-400">
                  {xp.period}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                  <FiMapPin size={10} /> {xp.location}
                </span>
              </div>

              {/* Highlights */}
              <ul className="mt-3 space-y-1.5 pl-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {xp.highlights.map((h, i) => (
                  <li key={i}
                    className="relative before:absolute before:-left-3.5 before:top-[0.55em] before:h-1 before:w-1
                      before:rounded-full before:bg-neutral-300 dark:before:bg-neutral-600">
                    {h}
                  </li>
                ))}
              </ul>

              {/* Tech chips + links */}
              {(xp.tech?.length > 0 || xp.links?.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(xp.tech || []).map(t => (
                    <span key={t}
                      className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[11px]
                        text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {t}
                    </span>
                  ))}
                  {(xp.links || []).map((l, i) => (
                    <a key={i} href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-primary-200 px-2.5 py-0.5
                        text-[11px] text-primary-700 hover:bg-primary-50
                        dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-950/40">
                      <FiExternalLink size={10} /> {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
