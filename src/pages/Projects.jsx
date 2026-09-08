import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchProjects } from '../shared/projects'
import { fetchUserRepos } from '../shared/github'
import ProjectCardClean, { ProjectCardSkeleton } from '../components/ProjectCardClean'
import RepoCard from '../components/RepoCard'
import { BeeDoodle } from '../components/BeeSketch'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import HairlineRule from '../components/ui/HairlineRule'
import { FiArrowRight } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'
import ReactGA from 'react-ga4'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function SkeletonRepo() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-white/90 p-4
                    dark:border-neutral-800 dark:bg-neutral-900/70">
      <div className="flex justify-between">
        <div className="h-4 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-4 w-10 rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
      <div className="mt-2 h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-1 h-3 w-4/5 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-3 flex gap-2">
        <div className="h-3 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-8 rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
  )
}

// Repo names already covered by featured case studies
const FEATURED_REPOS = new Set(['blueNwhite', 'tracksWeb', 'bullBarkham'])

export default function Projects() {
  const [items, setItems]         = useState([])
  const [repos, setRepos]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [reposLoading, setReposLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchProjects()
        setItems(data)
      } catch {
        setError('Failed to load projects.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const all = await fetchUserRepos()
      setRepos(all.filter((r) => !FEATURED_REPOS.has(r.name)))
      setReposLoading(false)
    })()
  }, [])

  return (
    <>
    <Helmet>
      <title>Projects — Birash Thing</title>
      <meta name="description" content="Full-stack MERN projects by Birash Thing — SaaS platforms, event ticketing, pub management, and more." />
      <link rel="canonical" href="https://bluenwhite.co.uk/projects" />
      <meta property="og:title" content="Projects — Birash Thing" />
      <meta property="og:description" content="Full-stack MERN projects by Birash Thing — SaaS platforms, event ticketing, pub management, and more." />
      <meta property="og:url" content="https://bluenwhite.co.uk/projects" />
    </Helmet>
    <section className="relative overflow-hidden px-4 py-16">
      {/* Bee mark — single, subtle */}
      <BeeDoodle size={64}
        className="absolute top-8 right-0 opacity-[0.06] dark:opacity-[0.08]
                   text-amber-600 dark:text-amber-400 pointer-events-none" />

      <div className="mx-auto w-full max-w-[var(--container-max)] space-y-16">

        {/* ── Featured Projects ── */}
        <Container>
          <SectionHeader
            as="h1"
            eyebrow="Full-Stack Development"
            title="Projects by Birash Thing"
            action={
              !loading && items.length > 0 && (
                <span className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">
                  {items.length} featured
                </span>
              )
            }
          >
            Full-stack MERN apps built by Birash Thing — SaaS platforms, event ticketing, and more.
          </SectionHeader>

          {loading && (
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <ProjectCardSkeleton />
                  <HairlineRule />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="py-10 text-ed-sm text-ink-muted">{error}</p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="py-10 text-ed-sm text-ink-muted">No projects to show yet — check back soon.</p>
          )}

          {!loading && !error && items.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {items.map((p, i) => (
                <motion.div key={p.slug} variants={itemVariants}>
                  <ProjectCardClean project={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </Container>

        {/* ── All GitHub Repos ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 flex items-end justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">Other Repos</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Live from GitHub — updates automatically when I push new work.
              </p>
            </div>
            {!reposLoading && repos.length > 0 && (
              <span className="text-sm text-neutral-400 dark:text-neutral-500">
                {repos.length} repos
              </span>
            )}
          </motion.div>

          {reposLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRepo key={i} />)}
            </div>
          )}

          {!reposLoading && repos.length === 0 && (
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              No public repos found.
            </p>
          )}

          {!reposLoading && repos.length > 0 && (
            <>
              <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {repos.map((repo) => (
                  <motion.div key={repo.id} variants={itemVariants}>
                    <RepoCard repo={repo} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-6 flex justify-center">
                <a
                  href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => ReactGA.event({ category: 'Outbound', action: 'click_github_profile', label: 'View all on GitHub' })}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-5 py-2
                             text-sm font-medium text-neutral-600 shadow-sm transition
                             hover:border-neutral-300 hover:text-neutral-900 hover:shadow
                             dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300
                             dark:hover:border-neutral-500 dark:hover:text-white"
                >
                  View all on GitHub
                  <FiArrowRight size={14} />
                </a>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
    </>
  )
}
