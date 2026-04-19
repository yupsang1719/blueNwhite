import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProject } from '../shared/projects'
import { useDarkMode } from '../shared/useDarkMode'
import { fetchRepo } from '../shared/github'
import GithubStats from '../components/GithubStats'
import {
  FiArrowLeft, FiExternalLink, FiGithub,
  FiClock, FiUser, FiAlertTriangle, FiTool, FiTrendingUp, FiList,
  FiX, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi'
import {
  SiMongodb, SiExpress, SiReact, SiNodedotjs, SiRedis, SiDocker,
  SiStripe, SiSocketdotio, SiChartdotjs, SiTailwindcss, SiMongoose,
  SiVite, SiCloudinary, SiJsonwebtokens,
} from 'react-icons/si'

const iconMap = {
  'MongoDB':      SiMongodb,
  'Mongoose':     SiMongoose,
  'Express':      SiExpress,
  'React':        SiReact,
  'Node':         SiNodedotjs,
  'Node.js':      SiNodedotjs,
  'Redis':        SiRedis,
  'Docker':       SiDocker,
  'Stripe':       SiStripe,
  'Socket.io':    SiSocketdotio,
  'Chart.js':     SiChartdotjs,
  'Tailwind CSS': SiTailwindcss,
  'Vite':         SiVite,
  'Cloudinary':   SiCloudinary,
  'JWT':          SiJsonwebtokens,
}

// Color map reused from ProjectCardVSCode
const TECH_COLORS = {
  'React':        { light: ['#ebf9ff', '#0369a1', '#bae6fd'], dark: ['#0c2a3a', '#38bdf8', '#164e63'] },
  'Node':         { light: ['#f0fdf4', '#15803d', '#bbf7d0'], dark: ['#052e16', '#4ade80', '#14532d'] },
  'Node.js':      { light: ['#f0fdf4', '#15803d', '#bbf7d0'], dark: ['#052e16', '#4ade80', '#14532d'] },
  'Express':      { light: ['#f5f5f5', '#525252', '#e5e5e5'], dark: ['#1c1c1c', '#a3a3a3', '#333333'] },
  'MongoDB':      { light: ['#f0fdf4', '#166534', '#86efac'], dark: ['#052e16', '#86efac', '#14532d'] },
  'Mongoose':     { light: ['#fef2f2', '#991b1b', '#fecaca'], dark: ['#2d0a0a', '#fca5a5', '#7f1d1d'] },
  'Socket.io':    { light: ['#f8fafc', '#334155', '#cbd5e1'], dark: ['#0f172a', '#94a3b8', '#1e293b'] },
  'Redis':        { light: ['#fff1f2', '#be123c', '#fda4af'], dark: ['#2d0a0f', '#fb7185', '#881337'] },
  'Docker':       { light: ['#eff6ff', '#1d4ed8', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
  'Stripe':       { light: ['#f5f3ff', '#6d28d9', '#ddd6fe'], dark: ['#1a0a3a', '#a78bfa', '#4c1d95'] },
  'Cloudinary':   { light: ['#eff6ff', '#1e40af', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
  'Chart.js':     { light: ['#fefce8', '#854d0e', '#fde68a'], dark: ['#1c1000', '#fbbf24', '#713f12'] },
  'Tailwind CSS': { light: ['#ecfeff', '#0e7490', '#a5f3fc'], dark: ['#061b1e', '#22d3ee', '#164e63'] },
  'Vite':         { light: ['#f5f3ff', '#7c3aed', '#ddd6fe'], dark: ['#1a0a3a', '#a78bfa', '#4c1d95'] },
  'JWT':          { light: ['#fdf4ff', '#7e22ce', '#e9d5ff'], dark: ['#1a0a2a', '#c084fc', '#581c87'] },
  'AWS S3':       { light: ['#fff7ed', '#c2410c', '#fed7aa'], dark: ['#2a0f00', '#fb923c', '#7c2d12'] },
  'Recharts':     { light: ['#fdf4ff', '#7e22ce', '#e9d5ff'], dark: ['#1a0a2a', '#c084fc', '#581c87'] },
  'Zod':          { light: ['#eff6ff', '#1d4ed8', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
}
const DEFAULT_CHIP = {
  light: ['#f9fafb', '#374151', '#e5e7eb'],
  dark:  ['#1a1a1a', '#d1d5db', '#333333'],
}
function techChipStyle(tech, dark) {
  const entry = TECH_COLORS[tech] || DEFAULT_CHIP
  const [bg, text, border] = dark ? entry.dark : entry.light
  return { backgroundColor: bg, color: text, border: `1px solid ${border}` }
}

const STATUS_STYLES = {
  'Live':           'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  'In Development': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  'Completed':      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
}

// Left-border accent per section
const SECTION_ACCENT = {
  problem:  'border-l-amber-400 dark:border-l-amber-500',
  solution: 'border-l-primary-500 dark:border-l-primary-400',
  impact:   'border-l-emerald-500 dark:border-l-emerald-400',
  features: 'border-l-violet-400 dark:border-l-violet-500',
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [dark] = useDarkMode()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ghStats, setGhStats] = useState(null)
  const [ghLoading, setGhLoading] = useState(false)
  const [lightbox, setLightbox] = useState(null) // index of open image

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchProject(slug)
        if (!data) throw new Error('Not found')
        setProject(data)
        // Fetch GitHub stats in parallel, non-blocking
        if (data.githubRepo) {
          setGhLoading(true)
          fetchRepo(data.githubRepo)
            .then(stats => setGhStats(stats))
            .finally(() => setGhLoading(false))
        }
      } catch {
        setError('Project not found.')
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  if (loading) {
    return (
      <section className="px-4 py-16">
        <div className="mx-auto w-full max-w-6xl animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </section>
    )
  }

  if (error || !project) {
    return (
      <section className="px-4 py-16 text-center">
        <p className="mb-4 text-neutral-600 dark:text-neutral-300">{error || 'Project not found.'}</p>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm
                     hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <FiArrowLeft /> Back to Projects
        </button>
      </section>
    )
  }

  const { title, summary, tech = [], problem, solution, impact,
          status = 'Completed', type = 'Side Project', timeline = '2024',
          role = 'Full-Stack Developer', repoUrl, liveUrl, features = [],
          screenshots = [] } = project

  const sections = [
    problem  && { id: 'problem',  label: 'Problem' },
    solution && { id: 'solution', label: 'Solution' },
    impact   && { id: 'impact',   label: 'Outcome & Impact' },
    features.length > 0 && { id: 'features', label: 'Key Features' },
  ].filter(Boolean)

  return (
    <section className="relative overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)]" />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm
                   text-neutral-600 transition hover:bg-neutral-100
                   dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <FiArrowLeft size={14} /> Back
      </button>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row">

        {/* ===== Left: Main case study ===== */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0 flex-1"
        >
          {/* Hero header */}
          <header className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
              {type}
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h1>
            {summary && (
              <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-300">{summary}</p>
            )}

            {/* Meta chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <MetaChip icon={<FiClock size={11} />} label={timeline} />
              <MetaChip icon={<FiUser size={11} />} label={role} />
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium
                               ${STATUS_STYLES[status] || STATUS_STYLES['Completed']}`}>
                {status === 'Live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />}
                {status}
              </span>
            </div>
          </header>

          {/* Screenshot gallery */}
          {screenshots.length > 0 && (
            <div className="mb-8">
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {screenshots.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className="group/img relative flex-none overflow-hidden rounded-xl border
                               border-neutral-200 dark:border-neutral-800 shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <img
                      src={src}
                      alt={`${title} screenshot ${i + 1}`}
                      className="h-48 w-auto max-w-xs object-cover object-top transition-transform
                                 duration-300 group-hover/img:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 transition group-hover/img:bg-black/10" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section cards */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="space-y-4"
          >
            {problem && (
              <SectionCard id="problem" accent={SECTION_ACCENT.problem} variants={sectionVariants}
                icon={<FiAlertTriangle className="text-amber-500" />}
                title="Problem" subtitle="What I set out to solve">
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{problem}</p>
              </SectionCard>
            )}
            {solution && (
              <SectionCard id="solution" accent={SECTION_ACCENT.solution} variants={sectionVariants}
                icon={<FiTool className="text-primary-500" />}
                title="Solution" subtitle="How I approached it">
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{solution}</p>
              </SectionCard>
            )}
            {impact && (
              <SectionCard id="impact" accent={SECTION_ACCENT.impact} variants={sectionVariants}
                icon={<FiTrendingUp className="text-emerald-500" />}
                title="Outcome & Impact" subtitle="Results & value">
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{impact}</p>
              </SectionCard>
            )}
            {features.length > 0 && (
              <SectionCard id="features" accent={SECTION_ACCENT.features} variants={sectionVariants}
                icon={<FiList className="text-violet-500" />}
                title="Key Features" subtitle="What I actually built">
                <ul className="mt-3 space-y-2">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </motion.div>

          {/* Bottom CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5
                           text-sm font-medium text-white transition hover:bg-primary-700">
                <FiExternalLink size={14} /> View Live
              </a>
            )}
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm transition
                           hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                <FiGithub size={14} /> View Code
              </a>
            )}
            {!liveUrl && !repoUrl && (
              <Link to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm transition
                           hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                Interested in details? Let's talk →
              </Link>
            )}
          </div>
        </motion.article>

        {/* ===== Right: Sidebar ===== */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full flex-none space-y-4 lg:w-56"
        >
          {/* Tech stack */}
          <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm
                          dark:border-neutral-800 dark:bg-neutral-900/70">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Tech stack</h3>
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => {
                const Icon = iconMap[t] || null
                return (
                  <span key={t}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={techChipStyle(t, dark)}
                  >
                    {Icon && <Icon size={11} />}
                    {t}
                  </span>
                )
              })}
            </div>
          </div>

          {/* GitHub stats */}
          {(ghLoading || ghStats || repoUrl) && (
            <GithubStats
              stats={ghStats}
              loading={ghLoading}
              htmlUrl={repoUrl}
            />
          )}

          {/* In-page nav */}
          {sections.length > 0 && (
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm
                            dark:border-neutral-800 dark:bg-neutral-900/70">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Sections</h3>
              <ul className="space-y-1">
                {sections.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-600 transition
                                 hover:bg-neutral-100 hover:text-primary-600
                                 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400">
                      <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.aside>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full
                       bg-white/10 text-white transition hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <FiX size={18} />
          </button>

          {lightbox > 0 && (
            <button
              className="absolute left-4 grid h-9 w-9 place-items-center rounded-full
                         bg-white/10 text-white transition hover:bg-white/20"
              onClick={e => { e.stopPropagation(); setLightbox(n => n - 1) }}
            >
              <FiChevronLeft size={20} />
            </button>
          )}
          {lightbox < screenshots.length - 1 && (
            <button
              className="absolute right-14 grid h-9 w-9 place-items-center rounded-full
                         bg-white/10 text-white transition hover:bg-white/20"
              onClick={e => { e.stopPropagation(); setLightbox(n => n + 1) }}
            >
              <FiChevronRight size={20} />
            </button>
          )}

          <motion.img
            key={lightbox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={screenshots[lightbox]}
            alt={`${title} screenshot ${lightbox + 1}`}
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          <p className="absolute bottom-4 text-sm text-white/50">
            {lightbox + 1} / {screenshots.length}
          </p>
        </motion.div>
      )}
    </section>
  )
}

function MetaChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1
                     text-[11px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
    </span>
  )
}

function SectionCard({ id, accent, variants, icon, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      variants={variants}
      className={`rounded-2xl border border-l-4 bg-white/80 p-5 shadow-sm backdrop-blur-sm
                  dark:border-neutral-800 dark:bg-neutral-900/70 ${accent}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg
                         bg-neutral-50 dark:bg-neutral-800">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-[11px] uppercase tracking-wider text-neutral-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </motion.section>
  )
}
