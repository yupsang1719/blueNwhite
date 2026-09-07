import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiExternalLink, FiArrowUpRight } from 'react-icons/fi'
import ReactGA from 'react-ga4'
import { BeeDoodle } from './BeeSketch'
import HairlineRule from './ui/HairlineRule'

/**
 * Screenshot thumbnail. `project.screenshots[0]` can be absent, and even
 * a present URL can 404 — both fall back to the same placeholder so the
 * box never collapses or shows a broken-image icon. Desaturated at rest
 * to read as monochrome editorial photography; the parent `article`'s
 * `group` reveals colour on hover, since the whole row is one hit target.
 */
function Thumb({ src, alt }) {
  const [broken, setBroken] = useState(false)
  const showPlaceholder = !src || broken

  return (
    <div className="aspect-[4/3] w-full overflow-hidden bg-paper-raised">
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center">
          <BeeDoodle size={32} className="text-ink-muted/40" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
      )}
    </div>
  )
}

/** Matches ProjectCardClean's grid exactly so nothing shifts when data arrives. */
export function ProjectCardSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-4 items-start gap-x-6 py-10 sm:grid-cols-8 lg:grid-cols-12">
      <div className="hidden lg:col-span-1 lg:block">
        <div className="h-4 w-6 rounded bg-paper-raised" />
      </div>
      <div className="col-span-4 sm:col-span-3 lg:col-span-4">
        <div className="aspect-[4/3] w-full bg-paper-raised" />
      </div>
      <div className="col-span-4 space-y-3 sm:col-span-5 lg:col-span-7">
        <div className="h-3 w-1/3 rounded bg-paper-raised" />
        <div className="h-5 w-2/3 rounded bg-paper-raised" />
        <div className="h-3 w-full rounded bg-paper-raised" />
        <div className="h-3 w-4/5 rounded bg-paper-raised" />
        <div className="flex gap-2 pt-1">
          <div className="h-3 w-12 rounded bg-paper-raised" />
          <div className="h-3 w-14 rounded bg-paper-raised" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectCardClean({ project, index }) {
  const isLive = project.status === 'Live'

  return (
    <article className="group relative">
      <Link
        to={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${project.title}`}
      />

      <div className="grid grid-cols-4 items-start gap-x-6 py-10 sm:grid-cols-8 lg:grid-cols-12">
        {index != null && (
          <div className="hidden font-display text-ed-sm tabular-nums tracking-ed-wide text-ink-muted lg:col-span-1 lg:block">
            {String(index + 1).padStart(2, '0')}
          </div>
        )}

        <div className="col-span-4 sm:col-span-3 lg:col-span-4">
          <Thumb src={project?.screenshots?.[0]} alt={`${project.title} preview`} />
        </div>

        <div className={`col-span-4 sm:col-span-5 ${index != null ? 'lg:col-span-7' : 'lg:col-span-8'}`}>
          <p className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">
            {project.type} · {project.timeline}
          </p>

          <h3 className="mt-1 truncate font-ed-serif font-bold text-ed-xl text-ink transition-colors group-hover:text-accent">
            {project.title}
          </h3>

          <p className="mt-3 max-w-prose text-ed-base leading-normal text-ink-muted line-clamp-2">
            {project.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-accent' : 'bg-ink-muted'}`} aria-hidden="true" />
              {project.status}
            </span>
            {project.tech.slice(0, 6).map((t) => (
              <span key={t} className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">
                {t}
              </span>
            ))}
          </div>

          <div className="relative z-20 mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-ed-xs text-ink-muted">{project.role}</span>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => { e.stopPropagation(); ReactGA.event({ category: 'Project', action: 'click_github', label: project.title }) }}
                aria-label="GitHub repo"
                className="text-ink-muted transition-colors hover:text-accent"
              >
                <FiGithub size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => { e.stopPropagation(); ReactGA.event({ category: 'Project', action: 'click_live', label: project.title }) }}
                aria-label="Live site"
                className="text-ink-muted transition-colors hover:text-accent"
              >
                <FiExternalLink size={16} />
              </a>
            )}
            <span className="flex items-center gap-1 text-ed-xs uppercase tracking-ed-wide text-ink-muted opacity-0 transition-opacity group-hover:text-accent group-hover:opacity-100">
              View case study <FiArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </div>

      <HairlineRule />
    </article>
  )
}
