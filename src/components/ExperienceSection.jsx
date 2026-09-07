import { motion } from 'framer-motion'
import { FiMapPin, FiExternalLink } from 'react-icons/fi'
import { experiences } from '../data/experience'
import Container from './ui/Container'
import SectionHeader from './ui/SectionHeader'
import HairlineRule from './ui/HairlineRule'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function ExperienceSection({ limit, types, number, eyebrow }) {
  let list = types ? experiences.filter(e => types.includes(e.type)) : experiences
  if (limit) list = list.slice(0, limit)

  return (
    <Container as="section" className="py-16">
      <SectionHeader
        number={number}
        eyebrow={eyebrow}
        title="Experience"
        action={
          limit && experiences.length > limit && (
            <span className="text-ed-xs text-ink-muted">
              +{experiences.length - limit} more on About
            </span>
          )
        }
      />

      <motion.ol
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {list.map((xp, idx) => (
          <motion.li key={idx} variants={item}>
            <div className="grid grid-cols-4 gap-x-6 gap-y-3 py-8 sm:grid-cols-8 lg:grid-cols-12">
              <div className="col-span-4 sm:col-span-2 lg:col-span-2">
                <p className="font-display text-ed-sm tabular-nums text-ink-muted">{xp.period}</p>
                <p className="mt-1 flex items-center gap-1 text-ed-xs text-ink-muted">
                  <FiMapPin size={11} aria-hidden="true" /> {xp.location}
                </p>
              </div>

              <div className="col-span-4 sm:col-span-6 lg:col-span-10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div>
                    <p className="font-display text-ed-lg text-ink">{xp.role}</p>
                    <p className="mt-0.5 text-ed-sm text-ink-muted">{xp.company}</p>
                  </div>
                  {xp.current && (
                    <span className="flex items-center gap-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      Current
                    </span>
                  )}
                </div>

                <ul className="mt-3 space-y-1.5 text-ed-base leading-normal text-ink-muted">
                  {xp.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-ink-muted/50"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                {(xp.tech?.length > 0 || xp.links?.length > 0) && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {(xp.tech || []).map(t => (
                      <span key={t} className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">
                        {t}
                      </span>
                    ))}
                    {(xp.links || []).map((l, i) => (
                      <a
                        key={i}
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-ed-xs text-ink-muted underline decoration-rule underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {l.label} <FiExternalLink size={11} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <HairlineRule />
          </motion.li>
        ))}
      </motion.ol>
    </Container>
  )
}
