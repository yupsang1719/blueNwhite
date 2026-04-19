import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiDownload, FiArrowRight, FiCode, FiZap, FiTarget } from 'react-icons/fi'
import {
  SiReact, SiVite, SiTailwindcss, SiFramer,
  SiNodedotjs, SiExpress, SiMongodb, SiMongoose, SiJsonwebtokens,
  SiStripe, SiAmazons3,
  SiDocker, SiNginx, SiLinux, SiVercel,
  SiGit, SiPostman, SiSpring,
} from 'react-icons/si'
import ExperienceSection from '../components/ExperienceSection'
import SkillPill from '../components/SkillPill'
import { BeeDoodle, BeeTrail, Honeycomb } from '../components/BeeSketch'

const CATEGORY_META = {
  Frontend: { color: '#0ea5e9', border: 'border-t-sky-400 dark:border-t-sky-500',        label: 'What users see' },
  Backend:  { color: '#22c55e', border: 'border-t-emerald-400 dark:border-t-emerald-500', label: 'What powers it' },
  DevOps:   { color: '#3b82f6', border: 'border-t-blue-400 dark:border-t-blue-500',       label: 'How it ships' },
  Tools:    { color: '#8b5cf6', border: 'border-t-violet-400 dark:border-t-violet-500',   label: 'How I work' },
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
    { name: 'NGINX',           level: 4, icon: SiNginx },
    { name: 'VPS / Linux',     level: 4, icon: SiLinux },
    { name: 'Docker',          level: 3, icon: SiDocker },
    { name: 'Vercel / Render', level: 3, icon: SiVercel },
  ],
  Tools: [
    { name: 'Git',         level: 5, icon: SiGit },
    { name: 'Postman',     level: 4, icon: SiPostman },
    { name: 'VS Code',     level: 5, icon: FiCode },
    { name: 'Spring Boot', level: 4, icon: SiSpring },
  ],
}

const stats = [
  { value: '6+',  label: 'Years experience' },
  { value: '4+',  label: 'Production apps' },
  { value: '2',   label: 'Paying SaaS clients' },
  { value: '3',   label: 'Countries worked' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function About() {
  return (
    <section className="relative overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)]" />

      {/* Bee sketch accents */}
      <BeeTrail width={200} height={70}
        className="absolute top-10 right-0 opacity-[0.07] dark:opacity-[0.09]
                   text-amber-500 dark:text-amber-400 pointer-events-none -scale-x-100" />
      <Honeycomb size={58}
        className="absolute top-8 left-4 opacity-[0.06] dark:opacity-[0.08]
                   text-amber-600 dark:text-amber-400 pointer-events-none" />
      <Honeycomb size={40}
        className="absolute top-20 left-16 opacity-[0.05] dark:opacity-[0.07]
                   text-amber-600 dark:text-amber-400 pointer-events-none" />
      <BeeDoodle size={76}
        className="absolute bottom-40 right-0 opacity-[0.06] dark:opacity-[0.08]
                   text-amber-600 dark:text-amber-400 -rotate-6 pointer-events-none" />

      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-primary-200
                            bg-gradient-to-br from-primary-100 to-indigo-100
                            dark:border-primary-900 dark:from-primary-950 dark:to-indigo-950
                            flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400 select-none">
              BT
            </div>
            <div>
              <h1 className="text-3xl font-bold">Birash Thing</h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Full-Stack Web Developer · Aldershot, UK
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1
                              dark:bg-emerald-950/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Open to work</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/cv"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition
                         hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <FiDownload size={14} /> Resume
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2
                         text-sm font-medium text-white transition hover:bg-primary-700"
            >
              My Work <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 max-w-2xl space-y-3 text-neutral-600 dark:text-neutral-300">
          <p>
            I started out in enterprise Java — building backend services for a US fintech startup and
            leading contract development for an insurance platform. Then spent three years in education,
            where I built an LMS from scratch during the pandemic and taught web technologies to university students.
          </p>
          <p>
            Now I'm deep in the MERN stack — building production SaaS, client websites, and tools that
            people actually use. I care about shipping clean, fast, maintainable code and I'm equally
            comfortable designing a database schema, wiring up a Stripe integration, or fine-tuning a UI animation.
          </p>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {stats.map(s => (
            <div key={s.label}
              className="rounded-2xl border bg-white/70 p-4 text-center backdrop-blur-sm
                         dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{s.value}</p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ===== Currently Building ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-14 w-full max-w-5xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <FiZap className="text-amber-500" size={18} />
          <h2 className="text-2xl font-semibold">Currently Building</h2>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 backdrop-blur-sm
                        dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-neutral-900 dark:text-white">BarBooks</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live · 2 paying clients
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                SaaS pub finance platform for UK pubs — P&L reports, expense tracking, financial dashboards, and PDF exports.
                Built for HMRC's Making Tax Digital mandate (April 2026), targeting the UK's ~19,500 independent pubs at £20–30/month.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['React 19', 'TanStack Query', 'Express v5', 'MongoDB', 'AWS S3', 'Recharts', 'Zod'].map(t => (
                  <span key={t} className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[11px] text-neutral-600
                                           dark:border-amber-900/50 dark:bg-neutral-900 dark:text-neutral-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== Looking For ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-10 w-full max-w-5xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <FiTarget className="text-primary-600" size={18} />
          <h2 className="text-2xl font-semibold">What I'm Looking For</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: 'Role type',    body: 'Full-stack developer, web developer, or hybrid technical/marketing roles.' },
            { title: 'Work style',   body: 'Remote-first or hybrid. Comfortable working independently and in teams.' },
            { title: 'Environment',  body: 'Product-driven teams where I can contribute across the stack and see the impact of my work.' },
          ].map(c => (
            <div key={c.title}
              className="rounded-2xl border bg-white/70 p-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">{c.title}</p>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-300">{c.body}</p>
            </div>
          ))}
        </div>
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
                    <SkillPill key={s.name} name={s.name} level={s.level} color={meta.color} icon={s.icon} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Experience timeline */}
      <ExperienceSection />

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-10 w-full max-w-5xl"
      >
        <h2 className="mb-4 text-2xl font-semibold">Education</h2>
        <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">
                Bachelor's Degree in Information Technology
              </p>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                College of Information and Technology · Kathmandu, Tinkune, Nepal
              </p>
            </div>
            <span className="mt-1 shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500
                             dark:bg-neutral-800 dark:text-neutral-400 sm:mt-0">
              Feb 2015 – Apr 2019
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
