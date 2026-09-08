import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchProjects } from '../shared/projects'
import { fetchUserRepos } from '../shared/github'
import ProjectCardClean, { ProjectCardSkeleton } from '../components/ProjectCardClean'
import RepoCard from '../components/RepoCard'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import HairlineRule from '../components/ui/HairlineRule'
import EditorialLink from '../components/ui/EditorialLink'
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

/** Matches RepoCard's row dimensions so nothing shifts when data arrives. */
function SkeletonRepo() {
  return (
    <div className="animate-pulse py-6">
      <div className="flex justify-between">
        <div className="h-5 w-1/3 rounded bg-paper-raised" />
        <div className="h-4 w-10 rounded bg-paper-raised" />
      </div>
      <div className="mt-3 h-3 w-full rounded bg-paper-raised" />
      <div className="mt-1 h-3 w-4/5 rounded bg-paper-raised" />
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-12 rounded bg-paper-raised" />
        <div className="h-3 w-8 rounded bg-paper-raised" />
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
    <section className="relative overflow-hidden py-16">
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
        <Container>
          <SectionHeader
            number={2}
            eyebrow="From GitHub"
            title="Other Repos"
            action={
              !reposLoading && repos.length > 0 && (
                <span className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">
                  {repos.length} repos
                </span>
              )
            }
          >
            Updates automatically when I push new work.
          </SectionHeader>

          {reposLoading && (
            <div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <SkeletonRepo />
                  <HairlineRule />
                </div>
              ))}
            </div>
          )}

          {!reposLoading && repos.length === 0 && (
            <p className="py-10 text-ed-sm text-ink-muted">No repos to show yet — check back soon.</p>
          )}

          {!reposLoading && repos.length > 0 && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {repos.map((repo) => (
                  <motion.div key={repo.id} variants={itemVariants}>
                    <RepoCard repo={repo} />
                    <HairlineRule />
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-8">
                <EditorialLink
                  href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => ReactGA.event({ category: 'Outbound', action: 'click_github_profile', label: 'View all on GitHub' })}
                >
                  View all on GitHub <FiArrowRight size={14} className="inline" aria-hidden="true" />
                </EditorialLink>
              </div>
            </>
          )}
        </Container>

      </div>
    </section>
    </>
  )
}
