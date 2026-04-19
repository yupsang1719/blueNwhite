import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiDownload, FiArrowRight, FiCode } from 'react-icons/fi'

import {
  SiReact, SiVite, SiTailwindcss, SiFramer,
  SiNodedotjs, SiExpress, SiMongodb, SiMongoose, SiJsonwebtokens,
  SiStripe, SiAmazons3,
  SiDocker, SiNginx, SiLinux, SiVercel,
  SiGit, SiPostman, SiSpring,
} from 'react-icons/si'
import ExperienceSection from '../components/ExperienceSection'
import SkillPill from '../components/SkillPill'

// Category accent colors
const CATEGORY_META = {
  Frontend: { color: '#0ea5e9', border: 'border-t-sky-400 dark:border-t-sky-500',       label: 'What users see' },
  Backend:  { color: '#22c55e', border: 'border-t-emerald-400 dark:border-t-emerald-500', label: 'What powers it' },
  DevOps:   { color: '#3b82f6', border: 'border-t-blue-400 dark:border-t-blue-500',      label: 'How it ships' },
  Tools:    { color: '#8b5cf6', border: 'border-t-violet-400 dark:border-t-violet-500',  label: 'How I work' },
}

const skills = {
  Frontend: [
    { name: 'React',         level: 5, icon: SiReact },
    { name: 'Vite',          level: 4, icon: SiVite },
    { name: 'Tailwind CSS',  level: 5, icon: SiTailwindcss },
    { name: 'Framer Motion', level: 4, icon: SiFramer },
    { name: 'React Router',  level: 5, icon: SiReact },
  ],
  Backend: [
    { name: 'Node.js',  level: 5, icon: SiNodedotjs },
    { name: 'Express',  level: 5, icon: SiExpress },
    { name: 'MongoDB',  level: 5, icon: SiMongodb },
    { name: 'Mongoose', level: 4, icon: SiMongoose },
    { name: 'JWT/Auth', level: 5, icon: SiJsonwebtokens },
    { name: 'Stripe',   level: 4, icon: SiStripe },
    { name: 'AWS S3',   level: 3, icon: SiAmazons3 },
  ],
  DevOps: [
    { name: 'NGINX',          level: 4, icon: SiNginx },
    { name: 'VPS / Linux',    level: 4, icon: SiLinux },
    { name: 'Docker',         level: 3, icon: SiDocker },
    { name: 'Vercel / Render',level: 3, icon: SiVercel },
  ],
  Tools: [
    { name: 'Git',             level: 5, icon: SiGit },
    { name: 'Postman',         level: 4, icon: SiPostman },
    { name: 'VS Code',         level: 5, icon: FiCode },
    { name: 'Spring Boot',     level: 4, icon: SiSpring },
  ],
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function About() {
  return (
    <section className="relative overflow-hidden px-4 py-16">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)]" />

      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {/* Avatar placeholder — swap src for a real photo */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-primary-200
                            bg-gradient-to-br from-primary-100 to-indigo-100
                            dark:border-primary-900 dark:from-primary-950 dark:to-indigo-950
                            flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400
                            select-none">
              BT
            </div>
            <div>
              <h1 className="text-3xl font-bold">Birash Thing</h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Full-Stack Web Developer · Open to opportunities
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition
                         hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <FiDownload size={14} /> Resume
            </a>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2
                         text-sm font-medium text-white transition hover:bg-primary-700"
            >
              My Work <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-neutral-600 dark:text-neutral-300">
          I build fast, secure, and accessible web apps across the full stack — from
          responsive UIs to scalable APIs and databases. I care about clean architecture,
          meaningful UX, and shipping things that actually move metrics.
        </p>
      </motion.div>

      {/* ===== Skills ===== */}
      <div className="mx-auto mt-14 w-full max-w-5xl">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">Self-rated · 1–5</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-5 md:grid-cols-2"
        >
          {Object.entries(skills).map(([group, list]) => {
            const meta = CATEGORY_META[group]
            return (
              <motion.div
                key={group}
                variants={item}
                className={`rounded-2xl border border-t-4 bg-white/70 p-4 backdrop-blur-sm
                            dark:border-neutral-800 dark:bg-neutral-900/60 ${meta.border}`}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold">{group}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">{meta.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {list.map(s => (
                    <SkillPill
                      key={s.name}
                      name={s.name}
                      level={s.level}
                      color={meta.color}
                      icon={s.icon}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Experience timeline */}
      <ExperienceSection />
    </section>
  )
}
