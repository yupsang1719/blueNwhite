import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchProjects } from '../shared/projects'
import ProjectCardClean from '../components/ProjectCardClean'
import ExperienceSection from '../components/ExperienceSection'
import SkillsMarquee from '../components/SkillsMarquee'
import Hero from '../components/Hero'

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
      <link rel="canonical" href="https://bluenwhite.co.uk/" />
      <meta property="og:title" content="Birash Thing — Full-Stack Web Developer" />
      <meta property="og:description" content="MERN Developer based in Aldershot, UK. Building SaaS products and web apps. Open to full-stack and web developer roles." />
      <meta property="og:url" content="https://bluenwhite.co.uk/" />
    </Helmet>
    <Hero />

    <section className="relative overflow-hidden px-4">

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