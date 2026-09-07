import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchProjects } from '../shared/projects'
import ProjectCardClean, { ProjectCardSkeleton } from '../components/ProjectCardClean'
import ExperienceSection from '../components/ExperienceSection'
import SkillsMarquee from '../components/SkillsMarquee'
import Hero from '../components/Hero'
import Container from '../components/ui/Container'
import SectionHeader from '../components/ui/SectionHeader'
import EditorialLink from '../components/ui/EditorialLink'
import HairlineRule from '../components/ui/HairlineRule'

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
      <Container className="mt-16">
        <SectionHeader
          number={1}
          eyebrow="Selected Work"
          title="Recent Projects"
          action={<EditorialLink to="/projects">See all</EditorialLink>}
        />

        {loading && (
          <div>
            <ProjectCardSkeleton />
            <HairlineRule />
            <ProjectCardSkeleton />
          </div>
        )}
        {!loading && error && (
          <p className="py-10 text-ed-sm text-ink-muted">{error}</p>
        )}
        {!loading && !error && projects.length === 0 && (
          <p className="py-10 text-ed-sm text-ink-muted">No projects to show yet — check back soon.</p>
        )}
        {!loading && !error && projects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {projects.map((p, i) => (
              <motion.div key={p.slug} variants={itemVariants}>
                <ProjectCardClean project={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
      {/* ===== Experience ===== */}
      <ExperienceSection limit={3} number={2} eyebrow="Career" />
    </section>
    </>
  )
}