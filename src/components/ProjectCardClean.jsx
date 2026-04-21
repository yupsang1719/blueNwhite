import { Link } from 'react-router-dom'
import { FiGithub, FiExternalLink, FiArrowUpRight } from 'react-icons/fi'

const STATUS_CONFIG = {
  'Live':           { color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
  'Completed':      { color: 'bg-violet-500',  text: 'text-violet-700  dark:text-violet-400',  bg: 'bg-violet-50  dark:bg-violet-950/50'  },
  'In Development': { color: 'bg-amber-400',   text: 'text-amber-700   dark:text-amber-400',   bg: 'bg-amber-50   dark:bg-amber-950/50'   },
}

export default function ProjectCardClean({ project }) {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG['Completed']

  return (
    <div className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm
                    transition hover:shadow-lg hover:-translate-y-0.5
                    dark:border-neutral-800 dark:bg-neutral-900/80">

      <Link to={`/projects/${project.slug}`} className="absolute inset-0 z-10 rounded-2xl" aria-label={`Open ${project.title}`} />

      {/* Screenshot */}
      <div className="relative overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-800">
        {project?.screenshots?.[0] ? (
          <>
            <img
              src={project.screenshots[0]}
              alt={`${project.title} preview`}
              className="h-48 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-48 items-center justify-center">
            <span className="font-mono text-2xl font-bold text-neutral-300 dark:text-neutral-600">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status badge overlaid on screenshot */}
        <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1
                         text-[11px] font-semibold backdrop-blur-sm
                         ${status.text} bg-white/85 dark:bg-black/60`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.color} ${project.status === 'Live' ? 'animate-pulse' : ''}`} />
          {project.status}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {project.type} · {project.timeline}
            </p>
            <h3 className="mt-0.5 truncate font-bold text-neutral-900 transition-colors
                           group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
              {project.title}
            </h3>
          </div>

          {/* Links */}
          <div className="relative z-20 flex shrink-0 items-center gap-0.5 text-neutral-400">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer"
                 onClick={(e) => e.stopPropagation()}
                 aria-label="GitHub repo"
                 className="grid h-7 w-7 place-items-center rounded-lg transition
                            hover:bg-neutral-100 hover:text-neutral-700
                            dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <FiGithub size={15} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                 onClick={(e) => e.stopPropagation()}
                 aria-label="Live site"
                 className="grid h-7 w-7 place-items-center rounded-lg transition
                            hover:bg-neutral-100 hover:text-neutral-700
                            dark:hover:bg-neutral-800 dark:hover:text-neutral-200">
                <FiExternalLink size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {project.summary}
        </p>

        {/* Tech chips */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.tech.slice(0, 6).map((t) => (
            <span key={t}
              className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5
                         font-mono text-[11px] text-neutral-600
                         dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {t}
            </span>
          ))}
        </div>

      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3
                      dark:border-neutral-800">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">{project.role}</span>
        <span className="relative z-20 flex items-center gap-1 text-xs font-medium text-blue-600
                         opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
          View case study <FiArrowUpRight size={13} />
        </span>
      </div>

    </div>
  )
}
