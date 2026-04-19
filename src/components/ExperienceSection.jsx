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

export default function ExperienceSection() {
  return (
    <section className="relative mx-auto w-full max-w-5xl py-16">
      {/* subtle divider glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent dark:via-primary-400/30" />
      
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Experience</h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Selected roles</span>
      </div>

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative grid gap-8 pl-5"
      >
        {/* vertical line */}
        <span className="pointer-events-none absolute left-2 top-0 h-full w-px bg-neutral-200 dark:bg-neutral-800" />

        {experiences.map((xp, idx) => (
          <motion.li key={idx} variants={item} className="relative">
            {/* timeline dot */}
            <span className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary-600 shadow dark:border-neutral-900" />

            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              {/* header row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <FiBriefcase className="text-primary-600" />
                  {xp.role}
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-sm">{xp.company}</span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1"><FiCalendar /> {xp.period}</span>
                <span className="inline-flex items-center gap-1"><FiMapPin /> {xp.location}</span>
              </div>

              {/* highlights */}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
                {xp.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>

              {/* tech + links */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(xp.tech || []).map(t => (
                  <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-neutral-600 dark:text-neutral-300 dark:border-neutral-700">
                    {t}
                  </span>
                ))}
                {(xp.links || []).map((l, i) => (
                  <a key={i} href={l.href} target={l.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                     className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:border-neutral-700 dark:hover:bg-neutral-800">
                    <FiExternalLink /> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}