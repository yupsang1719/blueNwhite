import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fetchProject } from '../shared/projects'
import { fetchRepo } from '../shared/github'
import GithubStats from '../components/GithubStats'
import Container from '../components/ui/Container'
import EditorialLink from '../components/ui/EditorialLink'
import {
  FiArrowLeft, FiExternalLink, FiGithub,
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

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function ProjectDetail() {
  const { slug } = useParams()
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
        ReactGA.event({ category: 'Project', action: 'view', label: slug })
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
      <Container as="section" className="py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-24 rounded bg-paper-raised" />
          <div className="h-8 w-2/3 rounded bg-paper-raised" />
          <div className="h-4 w-full rounded bg-paper-raised" />
          <div className="h-4 w-5/6 rounded bg-paper-raised" />
        </div>
      </Container>
    )
  }

  if (error || !project) {
    return (
      <Container as="section" className="py-16 text-center">
        <p className="mb-4 text-ed-base text-ink-muted">{error || 'Project not found.'}</p>
        <EditorialLink to="/projects">
          <FiArrowLeft className="mr-1.5 inline" size={14} aria-hidden="true" /> Back to Projects
        </EditorialLink>
      </Container>
    )
  }

  const { title, summary, tech = [], problem, solution, impact,
          status = 'Completed', type = 'Side Project', timeline = '2024',
          role = 'Full-Stack Developer', repoUrl, liveUrl, features = [],
          screenshots = [] } = project

  const sections = [
    problem  && { id: 'problem',  title: 'Problem',           subtitle: 'What I set out to solve' },
    solution && { id: 'solution', title: 'Solution',          subtitle: 'How I approached it' },
    impact   && { id: 'impact',   title: 'Outcome & Impact',  subtitle: 'Results & value' },
    features.length > 0 && { id: 'features', title: 'Key Features', subtitle: 'What I actually built' },
  ].filter(Boolean)

  const isLive = status === 'Live'

  return (
    <>
    <Helmet>
      <title>{title} — Birash Thing</title>
      <meta name="description" content={`${summary} Built by Birash Thing, Full-Stack MERN Developer.`} />
      <meta property="og:title" content={`${title} — Birash Thing`} />
      <meta property="og:description" content={summary} />
      <meta property="og:url" content={`https://bluenwhite.co.uk/projects/${slug}`} />
      <link rel="canonical" href={`https://bluenwhite.co.uk/projects/${slug}`} />
    </Helmet>
    <Container as="section" className="py-16">
      <EditorialLink to="/projects" className="mb-8 inline-flex items-center gap-1.5">
        <FiArrowLeft size={14} aria-hidden="true" /> Back
      </EditorialLink>

      <div className="flex w-full flex-col gap-10 lg:flex-row">

        {/* ===== Left: Main case study ===== */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0 flex-1"
        >
          {/* Hero header */}
          <header>
            <p className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">{type}</p>
            <h1 className="mt-2 font-ed-serif font-black text-ed-2xl leading-tight tracking-ed-tight text-ink sm:text-ed-3xl">
              {title}
            </h1>
            {summary && (
              <p className="mt-3 max-w-2xl text-ed-base leading-normal text-ink-muted">{summary}</p>
            )}

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
              <span>{timeline}</span>
              <span>{role}</span>
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-accent' : 'bg-ink-muted'}`} aria-hidden="true" />
                {status}
              </span>
            </div>
          </header>

          {/* Screenshot gallery */}
          {screenshots.length > 0 && (
            <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
              {screenshots.map((src, i) => (
                <GalleryThumb
                  key={i}
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  onClick={() => { setLightbox(i); ReactGA.event({ category: 'Project', action: 'view_screenshot', label: `${title} - screenshot ${i + 1}` }) }}
                />
              ))}
            </div>
          )}

          {/* Case study sections */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          >
            {problem && (
              <CaseStudySection id="problem" variants={sectionVariants} title="Problem" subtitle="What I set out to solve">
                {problem}
              </CaseStudySection>
            )}
            {solution && (
              <CaseStudySection id="solution" variants={sectionVariants} title="Solution" subtitle="How I approached it">
                {solution}
              </CaseStudySection>
            )}
            {impact && (
              <CaseStudySection id="impact" variants={sectionVariants} title="Outcome & Impact" subtitle="Results & value">
                {impact}
              </CaseStudySection>
            )}
            {features.length > 0 && (
              <CaseStudySection id="features" variants={sectionVariants} title="Key Features" subtitle="What I actually built">
                <ul className="space-y-2">
                  {features.map((feat, i) => (
                    <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-ink-muted/50">
                      {feat}
                    </li>
                  ))}
                </ul>
              </CaseStudySection>
            )}
          </motion.div>

          {/* Bottom CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-rule pt-8">
            {liveUrl && (
              <EditorialLink href={liveUrl} target="_blank" rel="noreferrer"
                onClick={() => ReactGA.event({ category: 'Project', action: 'click_live', label: title })}>
                <FiExternalLink size={14} className="mr-1.5 inline" aria-hidden="true" /> View Live
              </EditorialLink>
            )}
            {repoUrl && (
              <EditorialLink href={repoUrl} target="_blank" rel="noreferrer"
                onClick={() => ReactGA.event({ category: 'Project', action: 'click_github', label: title })}>
                <FiGithub size={14} className="mr-1.5 inline" aria-hidden="true" /> View Code
              </EditorialLink>
            )}
            {!liveUrl && !repoUrl && (
              <EditorialLink to="/contact">Interested in details? Let's talk →</EditorialLink>
            )}
          </div>
        </motion.article>

        {/* ===== Right: Sidebar ===== */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full flex-none space-y-8 lg:w-56"
        >
          {/* Tech stack */}
          <div>
            <h3 className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Tech stack</h3>
            <div className="mt-3 flex flex-col gap-2">
              {tech.map((t) => {
                const Icon = iconMap[t] || null
                return (
                  <span key={t} className="flex items-center gap-2 text-ed-sm text-ink-muted">
                    {Icon && <Icon size={13} aria-hidden="true" />}
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
            <div className="border-t border-rule pt-4">
              <h3 className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">Sections</h3>
              <ul className="mt-3 space-y-2">
                {sections.map(({ id, title: sectionTitle }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-ed-sm text-ink-muted transition-colors hover:text-accent">
                      {sectionTitle}
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
                       bg-hero-fg/10 text-hero-fg transition-colors hover:bg-hero-fg/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>

          {lightbox > 0 && (
            <button
              className="absolute left-4 grid h-9 w-9 place-items-center rounded-full
                         bg-hero-fg/10 text-hero-fg transition-colors hover:bg-hero-fg/20"
              onClick={e => { e.stopPropagation(); setLightbox(n => n - 1) }}
              aria-label="Previous screenshot"
            >
              <FiChevronLeft size={20} />
            </button>
          )}
          {lightbox < screenshots.length - 1 && (
            <button
              className="absolute right-14 grid h-9 w-9 place-items-center rounded-full
                         bg-hero-fg/10 text-hero-fg transition-colors hover:bg-hero-fg/20"
              onClick={e => { e.stopPropagation(); setLightbox(n => n + 1) }}
              aria-label="Next screenshot"
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
            className="max-h-[85vh] max-w-full"
            onClick={e => e.stopPropagation()}
          />

          <p className="absolute bottom-4 text-ed-sm text-hero-fg/50">
            {lightbox + 1} / {screenshots.length}
          </p>
        </motion.div>
      )}
    </Container>
    </>
  )
}

/** Grayscale-at-rest, colour-on-hover thumbnail — matches ProjectCardClean's
 * Thumb. Falls back to a plain placeholder box if the image 404s, so a bad
 * screenshot URL never shows a broken-image icon. */
function GalleryThumb({ src, alt, onClick }) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return (
      <div className="flex h-48 w-32 shrink-0 items-center justify-center bg-paper-raised text-ed-xs text-ink-muted">
        Unavailable
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className="group/img shrink-0 overflow-hidden focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
    >
      <img
        src={src}
        alt={alt}
        onError={() => setBroken(true)}
        className="h-48 w-auto max-w-xs object-cover object-top grayscale transition-all duration-300 group-hover/img:scale-105 group-hover/img:grayscale-0"
        loading="lazy"
      />
    </button>
  )
}

function CaseStudySection({ id, variants, title, subtitle, children }) {
  return (
    <motion.section id={id} variants={variants} className="mt-8 border-t border-rule pt-8">
      <h2 className="font-ed-serif font-bold text-ed-lg text-ink">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-ed-xs uppercase tracking-ed-wide text-ink-muted">{subtitle}</p>
      )}
      <div className="mt-3 text-ed-base leading-normal text-ink-muted">{children}</div>
    </motion.section>
  )
}
