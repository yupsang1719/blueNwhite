import { Link } from 'react-router-dom'
import { FiGithub, FiExternalLink, FiGitMerge, FiCircle, FiClock } from 'react-icons/fi'

const STATUS_CONFIG = {
  'Live':           { color: 'bg-emerald-500', label: 'Live',        ring: 'ring-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
  'Completed':      { color: 'bg-violet-500',  label: 'Merged',      ring: 'ring-violet-500/20',  text: 'text-violet-600  dark:text-violet-400'  },
  'In Development': { color: 'bg-amber-400',   label: 'In Progress', ring: 'ring-amber-400/20',   text: 'text-amber-600   dark:text-amber-400'   },
}

const TYPE_COLORS = {
  'SaaS Product':    'bg-blue-50   text-blue-700   dark:bg-blue-950/50  dark:text-blue-300',
  'Personal Project':'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
  'Client Project':  'bg-teal-50   text-teal-700   dark:bg-teal-950/50  dark:text-teal-300',
}

export default function ProjectCardGH({ project }) {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG['Completed']
  const typeClass = TYPE_COLORS[project.type] ?? TYPE_COLORS['Personal Project']

  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-white/90 shadow-sm transition
                    hover:border-neutral-300 hover:shadow-md
                    dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">

      {/* Clickable overlay — full card links to detail page */}
      <Link to={`/projects/${project.slug}`} className="absolute inset-0 z-10 rounded-xl" aria-label={`Open ${project.title}`} />

      {/* Screenshot banner */}
      {project?.screenshots?.[0] && (
        <div className="overflow-hidden rounded-t-xl border-b border-neutral-200 dark:border-neutral-800">
          <img
            src={project.screenshots[0]}
            alt={`${project.title} preview`}
            className="h-44 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5">

        {/* Row 1: status dot · title · links */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Animated pulse dot */}
            <span className={`relative flex h-3 w-3 shrink-0 items-center justify-center`}>
              {project.status === 'Live' && (
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.color} opacity-50`} />
              )}
              <span className={`relative h-2.5 w-2.5 rounded-full ${status.color}`} />
            </span>

            <h3 className="truncate font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
          </div>

          {/* Links — above the overlay */}
          <div className="relative z-20 flex shrink-0 items-center gap-0.5 text-neutral-400">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer"
                 onClick={(e) => e.stopPropagation()}
                 aria-label="GitHub repo"
                 className="grid h-7 w-7 place-items-center rounded-md transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <FiGithub size={15} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                 onClick={(e) => e.stopPropagation()}
                 aria-label="Live site"
                 className="grid h-7 w-7 place-items-center rounded-md transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <FiExternalLink size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Row 2: type badge · timeline */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeClass}`}>
            {project.type}
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={11} />
            {project.timeline}
          </span>
          <span className={`ml-auto font-medium text-[11px] ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Row 3: summary */}
        <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {project.summary}
        </p>

        {/* Row 4: tech chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 6).map((t) => (
            <span key={t}
              className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-600
                         dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}
