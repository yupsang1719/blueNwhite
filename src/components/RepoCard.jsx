import { FiStar, FiGitBranch, FiExternalLink, FiGithub } from 'react-icons/fi'
import { LANG_COLORS, timeAgo } from '../shared/github'

export default function RepoCard({ repo }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white/90 p-4
                    shadow-sm transition hover:shadow-md hover:-translate-y-0.5
                    dark:border-neutral-800 dark:bg-neutral-900/70">

      {/* Top row: name + links */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="truncate font-mono text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            {repo.name}
          </a>
          <div className="flex shrink-0 items-center gap-1 text-neutral-400">
            <a href={repo.htmlUrl} target="_blank" rel="noreferrer"
               aria-label="GitHub" className="rounded p-1 hover:text-neutral-700 dark:hover:text-neutral-200">
              <FiGithub size={15} />
            </a>
            {repo.homepage && (
              <a href={repo.homepage} target="_blank" rel="noreferrer"
                 aria-label="Live site" className="rounded p-1 hover:text-neutral-700 dark:hover:text-neutral-200">
                <FiExternalLink size={15} />
              </a>
            )}
          </div>
        </div>

        {repo.description && (
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {repo.description}
          </p>
        )}

        {repo.topics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {repo.topics.slice(0, 4).map((t) => (
              <span key={t}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700
                           dark:bg-blue-950/50 dark:text-blue-300">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom row: language · stars · forks · pushed */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#8b949e' }} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <FiStar size={11} /> {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <FiGitBranch size={11} /> {repo.forks}
          </span>
        )}
        {repo.pushedAt && (
          <span className="ml-auto">{timeAgo(repo.pushedAt)}</span>
        )}
      </div>
    </div>
  )
}
