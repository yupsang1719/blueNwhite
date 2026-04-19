import { motion } from 'framer-motion'
import { FiBriefcase, FiMapPin, FiCalendar, FiExternalLink } from 'react-icons/fi'
import { experiences } from '../data/experience'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
}

export default function ExperienceSection({ limit }) {
  const list = limit ? experiences.slice(0, limit) : experiences

  return (
    <section className="relative mx-auto w-full max-w-5xl py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent dark:via-primary-400/30" />

      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Experience</h2>
        {limit && experiences.length > limit && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {experiences.length - limit} more on About
          </span>
        )}
      </div>

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="relative grid gap-6 pl-5"
      >
        {/* vertical line */}
        <span className="pointer-events-none absolute left-2 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-800" />

        {list.map((xp, idx) => (
          <motion.li key={idx} variants={item} className="relative">
            {/* timeline dot — filled for current, outlined for past */}
            <span className={`absolute -left-[7px] top-2.5 h-3.5 w-3.5 rounded-full border-2
              ${xp.current
                ? 'border-primary-600 bg-primary-600 shadow-[0_0_0_3px_rgba(37,99,235,0.15)]'
                : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900'
              }`}
            />

            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              {/* header row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                    <FiBriefcase className="shrink-0 text-primary-600" size={13} />
                    {xp.role}
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-600">·</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{xp.company}</span>
                </div>
                {xp.current && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Current
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1"><FiCalendar size={11} /> {xp.period}</span>
                <span className="inline-flex items-center gap-1"><FiMapPin size={11} /> {xp.location}</span>
              </div>

              {/* highlights */}
              <ul className="mt-3 space-y-1.5 pl-4 text-sm text-neutral-700 dark:text-neutral-300">
                {xp.highlights.map((h, i) => (
                  <li key={i} className="relative before:absolute before:-left-3 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-neutral-400 dark:before:bg-neutral-600">
                    {h}
                  </li>
                ))}
              </ul>

              {/* tech + links */}
              {(xp.tech?.length > 0 || xp.links?.length > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {(xp.tech || []).map(t => (
                    <span key={t} className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {t}
                    </span>
                  ))}
                  {(xp.links || []).map((l, i) => (
                    <a key={i} href={l.href} target={l.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                       className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:border-neutral-700 dark:hover:bg-neutral-800">
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
