import { FiStar, FiGitBranch, FiClock, FiAlertCircle, FiGithub } from 'react-icons/fi'
import { timeAgo, LANG_COLORS } from '../shared/github'

export default function GithubStats({ stats, loading, htmlUrl }) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm
                      dark:border-neutral-800 dark:bg-neutral-900/70 animate-pulse">
        <div className="mb-3 h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    )
  }

  // Not configured or fetch failed — show a plain GitHub link if we have one
  if (!stats) {
    if (!htmlUrl) return null
    return (
      <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm
                      dark:border-neutral-800 dark:bg-neutral-900/70">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">GitHub</h3>
        <a href={htmlUrl} target="_blank" rel="noreferrer"
           className="inline-flex items-center gap-2 text-sm text-neutral-600 transition
                      hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400">
          <FiGithub size={14} /> View repository
        </a>
      </div>
    )
  }

  const langColor = LANG_COLORS[stats.language] || '#6b7280'

  return (
    <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm
                    dark:border-neutral-800 dark:bg-neutral-900/70">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">GitHub</h3>
        {htmlUrl && (
          <a href={htmlUrl} target="_blank" rel="noreferrer"
             aria-label="Open repository on GitHub"
             className="text-neutral-400 transition hover:text-neutral-700 dark:hover:text-neutral-200">
            <FiGithub size={14} />
          </a>
        )}
      </div>

      {/* Stats row — only show non-zero counts */}
      {(stats.stars > 0 || stats.forks > 0) && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {stats.stars > 0 && <Stat icon={<FiStar size={13} />} value={stats.stars} label="stars" />}
          {stats.forks > 0 && <Stat icon={<FiGitBranch size={13} />} value={stats.forks} label="forks" />}
          {stats.openIssues > 0 && <Stat icon={<FiAlertCircle size={13} />} value={stats.openIssues} label="issues" />}
        </div>
      )}

      {/* Language + last pushed */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
        {stats.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            {stats.language}
          </span>
        )}
        {stats.pushedAt && (
          <span className="flex items-center gap-1">
            <FiClock size={11} />
            Updated {timeAgo(stats.pushedAt)}
          </span>
        )}
      </div>

      {/* Topics */}
      {stats.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {stats.topics.slice(0, 6).map(t => (
            <span key={t}
              className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700
                         dark:bg-primary-950/40 dark:text-primary-400">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
      <span className="text-neutral-400">{icon}</span>
      <span className="font-medium">{value}</span>
      <span className="text-neutral-400 text-xs">{label}</span>
    </span>
  )
}
