import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchProjects } from '../shared/projects'
import ProjectCardClean from '../components/ProjectCardClean'
import ExperienceSection from '../components/ExperienceSection'
import { SiMongodb, SiExpress, SiReact, SiNodedotjs } from 'react-icons/si'
import SkillsMarquee from '../components/SkillsMarquee'
import { BeeDoodle, BeeTrail, Honeycomb } from '../components/BeeSketch'

// Framer Motion animation presets
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const items = await fetchProjects(2)
        setProjects(items)
      } catch {
        setError('Failed to load projects.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
    <Helmet>
      <title>Birash Thing — Full-Stack Web Developer</title>
      <meta name="description" content="MERN Developer based in Aldershot, UK. Building SaaS products and web apps. Open to full-stack and web developer roles." />
    </Helmet>
    <section className="relative overflow-hidden px-4">

      {/* Blue glow */}
      <div className="pointer-events-none absolute inset-0 -z-10
        bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_70%)]" />

      {/* Bee sketch accents */}
      <BeeDoodle size={88}
        className="absolute -top-2 right-2 opacity-[0.06] dark:opacity-[0.08]
                   text-amber-600 dark:text-amber-400 rotate-12 pointer-events-none" />
      <BeeTrail width={220} height={80}
        className="absolute top-16 left-0 opacity-[0.07] dark:opacity-[0.09]
                   text-amber-500 dark:text-amber-400 pointer-events-none" />
      <Honeycomb size={52}
        className="absolute bottom-32 left-8 opacity-[0.07] dark:opacity-[0.09]
                   text-amber-600 dark:text-amber-400 pointer-events-none" />
      <Honeycomb size={36}
        className="absolute bottom-20 left-20 opacity-[0.05] dark:opacity-[0.07]
                   text-amber-600 dark:text-amber-400 pointer-events-none" />

      {/* ===== Hero Section ===== */}
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center space-y-6">
        {/* Intro */}
        {/* Open to work badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5
                     dark:border-emerald-800 dark:bg-emerald-950/40"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Open to work</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400"
        >
          👋 Hi, I’m Birash Thing
        </motion.p>

        {/* Headline with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl"
        >
          I craft scalable, modern{' '}
          <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
            full-stack web apps
          </span>{' '}
          that ship fast and scale further.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-neutral-600 dark:text-neutral-300 text-lg"
        >
          Full-stack web developer focused on responsive, secure, data-driven apps.
          I care about clean code, fast UX, and meaningful product impact.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/projects"
            className="rounded-xl bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition"
          >
            View My Work
          </Link>
          <Link
            to="/contact"
            className="rounded-xl border border-neutral-200 px-6 py-3 font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Let’s Connect
          </Link>
        </motion.div>

        {/* Tech Stack Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-8 pt-4"
        >
          {[
            { Icon: SiMongodb,   label: 'MongoDB',  color: '#47A248' },
            { Icon: SiExpress,   label: 'Express',  color: '#888888' },
            { Icon: SiReact,     label: 'React',    color: '#61DAFB' },
            { Icon: SiNodedotjs, label: 'Node.js',  color: '#68A063' },
          ].map(({ Icon, label, color }, i) => (
            <motion.span
              key={i}
              whileHover={{ y: -4, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="inline-flex text-4xl text-neutral-400 dark:text-neutral-500 transition-colors duration-200 cursor-default"
              onMouseEnter={e => {
                e.currentTarget.style.color = color
                e.currentTarget.style.filter = `drop-shadow(0 0 8px ${color}66)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = ''
                e.currentTarget.style.filter = ''
              }}
              title={label}
              aria-label={label}
            >
              <Icon />
            </motion.span>
          ))}
        </motion.div>
      </div>
      
      <SkillsMarquee />

      {/* ===== Recent Projects (2 only) ===== */}
      <div className="mx-auto mt-16 w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            See all →
          </Link>
        </div>

        {loading && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {[0, 1].map(i => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/80">
                <div className="h-48 bg-neutral-100 dark:bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-4 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-3 w-4/5 rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="flex gap-2 pt-1">
                    <span className="h-5 w-14 rounded-md bg-neutral-100 dark:bg-neutral-800" />
                    <span className="h-5 w-16 rounded-md bg-neutral-100 dark:bg-neutral-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700
                          dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">{error}</div>
        )}
        {!loading && !error && projects.length > 0 && (
          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {projects.map((p) => (
              <motion.div key={p.slug} variants={itemVariants}>
                <ProjectCardClean project={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      {/* ===== Experience ===== */}
      <ExperienceSection limit={3} />
    </section>
    </>
  )
}